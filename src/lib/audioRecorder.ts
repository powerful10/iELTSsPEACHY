export interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  durationSeconds: number;
  volumeLevel: number; // 0.0 to 1.0 for audio orb visualization
  error: string | null;
  permissionStatus: 'prompt' | 'granted' | 'denied';
}

export class BrowserAudioRecorder {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private startTime: number = 0;
  private timerInterval: number | null = null;

  public onVolumeChange?: (volume: number) => void;
  public onDurationChange?: (seconds: number) => void;
  public onError?: (error: string) => void;

  async checkPermission(): Promise<'prompt' | 'granted' | 'denied'> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return 'denied';
      }
      if (navigator.permissions && navigator.permissions.query) {
        // Some browsers support querying microphone permission
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          return result.state as 'prompt' | 'granted' | 'denied';
        } catch {
          return 'prompt';
        }
      }
      return 'prompt';
    } catch {
      return 'prompt';
    }
  }

  async startRecording(): Promise<boolean> {
    this.audioChunks = [];
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support microphone audio recording.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      this.mediaStream = stream;

      // Setup audio analyzer for voice orb reactivity
      try {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioContext = new AudioCtxClass();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.5;
        source.connect(this.analyser);

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const updateVolume = () => {
          if (!this.analyser) return;
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(1.0, avg / 128);
          this.onVolumeChange?.(normalized);
          this.animFrameId = requestAnimationFrame(updateVolume);
        };
        updateVolume();
      } catch (audioCtxErr) {
        console.warn('AudioContext volume metering not supported or restricted:', audioCtxErr);
      }

      // Pick best supported MIME type
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }

      this.mediaRecorder = new MediaRecorder(stream, { mimeType });
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(250); // Collect data every 250ms
      this.startTime = Date.now();

      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = window.setInterval(() => {
        const elapsed = Math.round((Date.now() - this.startTime) / 1000);
        this.onDurationChange?.(elapsed);
      }, 500);

      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to access microphone';
      this.onError?.(errorMsg);
      this.cleanup();
      return false;
    }
  }

  stopRecording(): Promise<{ blob: Blob; base64: string; mimeType: string; durationSeconds: number } | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.cleanup();
        resolve(null);
        return;
      }

      const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
      const mimeType = this.mediaRecorder.mimeType || 'audio/webm';

      this.mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(this.audioChunks, { type: mimeType });
          if (blob.size === 0) {
            this.cleanup();
            resolve(null);
            return;
          }
          const base64 = await this.blobToBase64(blob);
          this.cleanup();
          resolve({ blob, base64, mimeType, durationSeconds });
        } catch (err) {
          console.error('Error stopping recording:', err);
          this.cleanup();
          resolve(null);
        }
      };

      try {
        this.mediaRecorder.stop();
      } catch (stopErr) {
        console.warn('Error during mediaRecorder.stop():', stopErr);
        this.cleanup();
        resolve(null);
      }
    });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // Strip data:audio/webm;base64, prefix
        const base64 = dataUrl.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  cleanup() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {
        // ignore
      }
      this.audioContext = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.onVolumeChange?.(0);
  }
}
