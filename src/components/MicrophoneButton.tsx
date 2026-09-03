import React from 'react';
import { Mic, Square, AlertCircle, RefreshCw } from 'lucide-react';

interface MicrophoneButtonProps {
  isRecording: boolean;
  durationSeconds: number;
  onStart: () => void;
  onStop: () => void;
  permissionError?: string | null;
  onRetryPermission?: () => void;
  label?: string;
  disabled?: boolean;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  isRecording,
  durationSeconds,
  onStart,
  onStop,
  permissionError,
  onRetryPermission,
  label,
  disabled = false,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (permissionError) {
    return (
      <div className="flex flex-col items-center gap-3 p-5 bg-white border border-[#D1CEC3] rounded-2xl text-center max-w-md mx-auto shadow-xs">
        <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs uppercase tracking-wider">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Microphone Access Required</span>
        </div>
        <p className="text-xs text-[#1C1C1C]/70 leading-relaxed font-light">
          {permissionError}
        </p>
        <button
          type="button"
          onClick={onRetryPermission}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1C1C] text-white rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-black transition-all shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#A1824A]" />
          <span>Grant Permission</span>
        </button>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white text-[#1C1C1C] border border-[#D1CEC3] text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#A1824A] animate-ping" />
          <span>Recording Voice ({formatTime(durationSeconds)})</span>
        </div>

        <button
          type="button"
          onClick={onStop}
          className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#A1824A] text-white hover:bg-[#866A38] rounded-full font-semibold text-xs uppercase tracking-[0.2em] border border-[#866A38] shadow-md active:scale-95 transition-all cursor-pointer focus:outline-none"
        >
          <Square className="w-4 h-4 fill-current" />
          <span>Finish & Evaluate</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onStart}
        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1A1A1A] text-white hover:bg-black hover:border-[#A1824A] disabled:bg-[#D1CEC3] disabled:text-[#1C1C1C]/40 disabled:cursor-not-allowed rounded-full font-semibold text-xs uppercase tracking-[0.2em] border border-[#1A1A1A] shadow-md active:scale-95 transition-all cursor-pointer focus:outline-none"
      >
        <Mic className="w-4 h-4 text-[#A1824A]" />
        <span>{label || 'Start Speaking'}</span>
      </button>
      <span className="text-[10px] uppercase tracking-widest text-[#1C1C1C]/60 font-medium">Click to begin your response</span>
    </div>
  );
};
