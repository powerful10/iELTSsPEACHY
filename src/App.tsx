import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SpeakingState,
  SpeakingPart,
  SpeakingPrompt,
  AssessmentResponse,
  AttemptComparison,
  PracticeAttempt,
  Language,
  LearnerProfile,
} from './types';
import { SAMPLE_PROMPTS, UI_TRANSLATIONS } from './lib/constants';
import { BrowserAudioRecorder } from './lib/audioRecorder';
import { loadLearnerProfile, saveLearnerProfile, recordAttemptInProfile } from './lib/storage';

import { SessionHeader } from './components/SessionHeader';
import { LandingView } from './components/LandingView';
import { VoiceOrb } from './components/VoiceOrb';
import { MicrophoneButton } from './components/MicrophoneButton';
import { Part2CueCard } from './components/Part2CueCard';
import { AssessmentCard } from './components/AssessmentCard';
import { MicroLessonPanel } from './components/MicroLessonPanel';
import { RetryPanel } from './components/RetryPanel';
import { BeforeAfterComparison } from './components/BeforeAfterComparison';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SettingsModal } from './components/SettingsModal';

import {
  Sparkles,
  Volume2,
  RefreshCw,
  ArrowRight,
  HelpCircle,
  VolumeX,
} from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'landing' | 'studio' | 'progress'>('landing');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Profile & Memory State
  const [profile, setProfile] = useState<LearnerProfile>(() => loadLearnerProfile());
  const language = profile.preferredLanguage || 'en';

  // Practice Session State
  const [currentPart, setCurrentPart] = useState<SpeakingPart>(1);
  const [currentPrompt, setCurrentPrompt] = useState<SpeakingPrompt>(SAMPLE_PROMPTS[0]);
  const [speakingState, setSpeakingState] = useState<SpeakingState>('idle');
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  // Analysis & Assessment State
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [comparison, setComparison] = useState<AttemptComparison | null>(null);
  const [initialAudioData, setInitialAudioData] = useState<{ base64: string; mimeType: string; duration: number } | null>(null);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [processingStageText, setProcessingStageText] = useState('');

  // Audio Recorder Ref
  const recorderRef = useRef<BrowserAudioRecorder | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const t = UI_TRANSLATIONS[language];

  // Initialize recorder callbacks
  useEffect(() => {
    const recorder = new BrowserAudioRecorder();
    recorder.onVolumeChange = (vol) => setVolumeLevel(vol);
    recorder.onDurationChange = (secs) => setRecordingDuration(secs);
    recorder.onError = (err) => {
      setPermissionError(err);
      setSpeakingState('error');
    };
    recorderRef.current = recorder;

    return () => {
      recorder.cleanup();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update prompt when part changes
  const handleSelectPart = (part: SpeakingPart) => {
    setCurrentPart(part);
    const available = SAMPLE_PROMPTS.filter((p) => p.part === part);
    const next = available[0] || SAMPLE_PROMPTS[0];
    setCurrentPrompt(next);
    resetSessionToNewQuestion();
  };

  const resetSessionToNewQuestion = () => {
    setSpeakingState('idle');
    setAssessment(null);
    setComparison(null);
    setInitialAudioData(null);
    setRecordingDuration(0);
    setVolumeLevel(0);
    stopAnySpeech();
  };

  // Update learner profile
  const handleUpdateProfile = (updates: Partial<LearnerProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      saveLearnerProfile(next);
      return next;
    });
  };

  // Speak text out loud via TTS
  const speakText = useCallback(async (text: string) => {
    stopAnySpeech();
    setIsAiSpeaking(true);
    setSpeakingState('ai-speaking');

    try {
      // Try server Gemini TTS first
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'Kore' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:${data.mimeType || 'audio/mp3'};base64,${data.audioBase64}`);
          audioPlayerRef.current = audio;
          audio.onended = () => {
            setIsAiSpeaking(false);
            setSpeakingState('idle');
          };
          audio.onerror = () => {
            fallbackSpeechSynthesis(text);
          };
          await audio.play();
          return;
        }
      }
      fallbackSpeechSynthesis(text);
    } catch {
      fallbackSpeechSynthesis(text);
    }
  }, []);

  const fallbackSpeechSynthesis = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        setIsAiSpeaking(false);
        setSpeakingState('idle');
      };
      utterance.onerror = () => {
        setIsAiSpeaking(false);
        setSpeakingState('idle');
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setIsAiSpeaking(false);
      setSpeakingState('idle');
    }
  };

  const stopAnySpeech = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
  };

  // Start recording initial response
  const handleStartInitialRecording = async () => {
    stopAnySpeech();
    setPermissionError(null);
    if (!recorderRef.current) return;

    const success = await recorderRef.current.startRecording();
    if (success) {
      setSpeakingState('listening');
    }
  };

  // Stop recording & trigger holistic assessment
  const handleStopInitialRecording = async () => {
    if (!recorderRef.current) return;
    setSpeakingState('processing');
    setProcessingStageText(t.processingStates1);

    const result = await recorderRef.current.stopRecording();
    if (!result || !result.base64) {
      setSpeakingState('error');
      setPermissionError('No audio was captured. Please speak into your microphone and try again.');
      return;
    }

    setInitialAudioData({
      base64: result.base64,
      mimeType: result.mimeType,
      duration: result.durationSeconds,
    });

    // Cycle processing message
    const timer1 = setTimeout(() => setProcessingStageText(t.processingStates2), 1400);
    const timer2 = setTimeout(() => setProcessingStageText(t.processingStates3), 2800);
    const timer3 = setTimeout(() => setProcessingStageText(t.processingStates4), 4200);

    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: result.base64,
          mimeType: result.mimeType,
          promptText: currentPrompt.question,
          part: currentPrompt.part,
          targetBand: profile.targetBand,
          currentEstimate: profile.currentEstimate,
          language,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!response.ok) {
        throw new Error('Assessment failed on server');
      }

      const assessmentData: AssessmentResponse = await response.json();
      setAssessment(assessmentData);
      setSpeakingState('feedback');

      // Record in student memory
      const newAttempt: PracticeAttempt = {
        id: `att-${Date.now()}`,
        timestamp: Date.now(),
        prompt: currentPrompt,
        part: currentPrompt.part,
        audioDurationSeconds: result.durationSeconds,
        transcript: assessmentData.transcript,
        diagnosticEstimate: assessmentData.diagnosticEstimate,
        confidence: assessmentData.confidence,
        criteria: assessmentData.criteria,
        priorityBottleneck: assessmentData.priorityBottleneck,
        strengths: assessmentData.strengths,
      };

      const updated = recordAttemptInProfile(newAttempt, {
        newWeakness: assessmentData.priorityBottleneck,
      });
      setProfile(updated);

      // Speak coach summary aloud
      if (assessmentData.coachSpokenSummary) {
        speakText(assessmentData.coachSpokenSummary);
      }
    } catch (err) {
      console.error('Assessment error:', err);
      setSpeakingState('error');
      setPermissionError(t.offlineOrError);
    }
  };

  // Start retry recording
  const handleStartRetryRecording = async () => {
    stopAnySpeech();
    setPermissionError(null);
    if (!recorderRef.current) return;

    const success = await recorderRef.current.startRecording();
    if (success) {
      setSpeakingState('listening');
    }
  };

  // Stop retry recording & trigger comparison
  const handleStopRetryRecording = async () => {
    if (!recorderRef.current || !assessment) return;
    setSpeakingState('comparing');
    setProcessingStageText(t.comparingAttempts);

    const result = await recorderRef.current.stopRecording();
    if (!result || !result.base64) {
      setSpeakingState('error');
      setPermissionError('No audio captured during retry. Please try speaking again.');
      return;
    }

    try {
      // First quick transcribe/assess the retry response
      const retryAssessRes = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: result.base64,
          mimeType: result.mimeType,
          promptText: assessment.retryTask.promptText,
          part: currentPrompt.part,
          targetBand: profile.targetBand,
          currentEstimate: profile.currentEstimate,
          language,
        }),
      });

      const retryAssessData = await retryAssessRes.json();
      const retryTranscript = retryAssessData.transcript || 'Retry response';

      // Compare initial attempt with retry
      const compareRes = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initialTranscript: assessment.transcript,
          retryTranscript,
          targetSkill: assessment.retryTask.targetSkillToDemonstrate,
          microLesson: assessment.microLesson,
          retryPrompt: assessment.retryTask.promptText,
          language,
        }),
      });

      const compareData: AttemptComparison = await compareRes.json();
      setComparison(compareData);
      setSpeakingState('complete');

      // Update student profile with retry comparison
      const latestAttempt = profile.recentAttempts[0];
      if (latestAttempt) {
        latestAttempt.retryAttempt = {
          timestamp: Date.now(),
          transcript: retryTranscript,
          retryPrompt: assessment.retryTask.promptText,
          comparison: compareData,
        };
        const updated = recordAttemptInProfile(latestAttempt, {
          resolvedWeakness: compareData.didImprove ? compareData.targetSkill : undefined,
        });
        setProfile(updated);
      }

      // Celebrate with spoken feedback
      if (compareData.coachComment) {
        speakText(compareData.coachComment);
      }
    } catch (err) {
      console.error('Comparison error:', err);
      setSpeakingState('error');
      setPermissionError(t.offlineOrError);
    }
  };

  // Generate dynamic fresh question using Gemini API
  const handleGenerateFreshQuestion = async () => {
    setIsGeneratingQuestion(true);
    try {
      const res = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part: currentPart,
          targetBand: profile.targetBand,
        }),
      });

      if (res.ok) {
        const newPrompt: SpeakingPrompt = await res.json();
        setCurrentPrompt(newPrompt);
        resetSessionToNewQuestion();
      }
    } catch (err) {
      console.warn('Failed to generate dynamic question:', err);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1C1C1C] flex flex-col font-sans selection:bg-[#A1824A]/20 selection:text-[#1C1C1C]">
      {/* Session Navigation Header */}
      <SessionHeader
        currentView={currentView}
        onNavigate={(view) => {
          stopAnySpeech();
          setCurrentView(view);
        }}
        currentPart={currentPart}
        onSelectPart={handleSelectPart}
        targetBand={profile.targetBand}
        language={language}
        onToggleLanguage={(l) => handleUpdateProfile({ preferredLanguage: l })}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentView === 'landing' && (
          <LandingView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onStartSpeaking={() => setCurrentView('studio')}
            language={language}
            onToggleLanguage={(l) => handleUpdateProfile({ preferredLanguage: l })}
          />
        )}

        {currentView === 'progress' && (
          <ProgressDashboard
            profile={profile}
            language={language}
            onSelectPrompt={() => setCurrentView('studio')}
          />
        )}

        {currentView === 'studio' && (
          <div className="space-y-8">
            {/* Studio Top Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D1CEC3]">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-white text-[#A1824A] text-[10px] font-bold uppercase tracking-[0.25em] border border-[#D1CEC3]">
                  Part {currentPart} Practice
                </span>
                <span className="text-xs text-[#1C1C1C]/70 font-serif italic">
                  {currentPrompt.topic}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateFreshQuestion}
                  disabled={isGeneratingQuestion || speakingState === 'listening'}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D1CEC3] bg-white hover:bg-[#EAE8E0] text-xs font-semibold uppercase tracking-wider text-[#1C1C1C] disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#A1824A] ${isGeneratingQuestion ? 'animate-spin' : ''}`} />
                  <span>Fresh Prompt</span>
                </button>

                {isAiSpeaking && (
                  <button
                    type="button"
                    onClick={stopAnySpeech}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <VolumeX className="w-3.5 h-3.5 text-[#A1824A]" />
                    <span>Mute Coach</span>
                  </button>
                )}
              </div>
            </div>

            {/* PROCESSING STATE VIEW */}
            {(speakingState === 'processing' || speakingState === 'comparing') && (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
                <VoiceOrb
                  state={speakingState}
                  size="lg"
                  statusText={processingStageText}
                />
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-light text-[#1C1C1C]">
                    {speakingState === 'processing' ? 'Diagnosing Spoken Formulation...' : 'Comparing Speech Evidence...'}
                  </h3>
                  <p className="text-xs text-[#1C1C1C]/60 font-light leading-relaxed">
                    Evaluating response against Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation descriptors.
                  </p>
                </div>
              </div>
            )}

            {/* IDLE / LISTENING / AI-SPEAKING STATE VIEW */}
            {(speakingState === 'idle' ||
              speakingState === 'listening' ||
              speakingState === 'ai-speaking' ||
              speakingState === 'error') && (
              <div className="space-y-6">
                {/* If Part 2, Show Cue Card with 1-min timer */}
                {currentPart === 2 ? (
                  <Part2CueCard
                    prompt={currentPrompt}
                    prepCompleted={false}
                    onStartSpeaking={handleStartInitialRecording}
                  />
                ) : (
                  /* Part 1 or Part 3 Question Card */
                  <div className="bg-white border border-[#D1CEC3] rounded-2xl p-6 sm:p-10 shadow-xs text-center max-w-3xl mx-auto space-y-5">
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A1824A] bg-[#F4F1EA] px-3.5 py-1 rounded-full border border-[#D1CEC3]">
                        {currentPart === 1 ? 'Everyday Interview Prompt' : 'Two-Way Abstract Discussion'}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1C1C1C] leading-snug">
                        "{currentPrompt.question}"
                      </h2>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => speakText(currentPrompt.question)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F4F1EA] text-[#1C1C1C] text-xs font-semibold uppercase tracking-wider border border-[#D1CEC3] transition-all cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#A1824A]" />
                        <span>{t.listenToQuestion}</span>
                      </button>
                    </div>

                    {currentPrompt.followUpQuestion && (
                      <div className="p-3.5 bg-[#F4F1EA] rounded-xl border border-[#D1CEC3] text-xs text-[#1C1C1C]/70 inline-flex items-center gap-2 font-serif italic">
                        <HelpCircle className="w-3.5 h-3.5 text-[#A1824A]" />
                        <span>Possible follow-up probe: "{currentPrompt.followUpQuestion}"</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Primary Voice Orb & Recording Button */}
                <div className="bg-white border border-[#D1CEC3] rounded-2xl p-8 shadow-xs flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto">
                  <VoiceOrb
                    state={speakingState}
                    volumeLevel={volumeLevel}
                    size="lg"
                    statusText={
                      speakingState === 'listening'
                        ? t.recording
                        : speakingState === 'ai-speaking'
                        ? 'Coach speaking question aloud...'
                        : t.readyToSpeak
                    }
                    onClick={
                      speakingState === 'listening'
                        ? handleStopInitialRecording
                        : handleStartInitialRecording
                    }
                  />

                  <div className="w-full max-w-xs">
                    <MicrophoneButton
                      isRecording={speakingState === 'listening'}
                      durationSeconds={recordingDuration}
                      onStart={handleStartInitialRecording}
                      onStop={handleStopInitialRecording}
                      permissionError={permissionError}
                      onRetryPermission={() => setPermissionError(null)}
                      label="Record Spoken Answer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: FEEDBACK (ASSESSMENT CARD) */}
            {speakingState === 'feedback' && assessment && (
              <AssessmentCard
                assessment={assessment}
                language={language}
                onProceedToLesson={() => setSpeakingState('lesson')}
              />
            )}

            {/* STEP 6: TEACH (MICRO-LESSON) */}
            {speakingState === 'lesson' && assessment && (
              <MicroLessonPanel
                lesson={assessment.microLesson}
                retryTask={assessment.retryTask}
                onStartRetry={() => setSpeakingState('retry')}
                onSpeakModel={(text) => speakText(text)}
              />
            )}

            {/* STEP 7: RETRY TASK */}
            {speakingState === 'retry' && assessment && (
              <RetryPanel
                retryTask={assessment.retryTask}
                speakingState={speakingState}
                volumeLevel={volumeLevel}
                durationSeconds={recordingDuration}
                onStartRecording={handleStartRetryRecording}
                onStopRecording={handleStopRetryRecording}
                onSpeakQuestion={(text) => speakText(text)}
                permissionError={permissionError}
                onRetryPermission={() => setPermissionError(null)}
              />
            )}

            {/* STEP 8: COMPARE (BEFORE -> AFTER COMPARISON) */}
            {speakingState === 'complete' && comparison && (
              <BeforeAfterComparison
                comparison={comparison}
                onNextQuestion={() => {
                  handleGenerateFreshQuestion();
                  resetSessionToNewQuestion();
                }}
                onDrillMore={() => {
                  setSpeakingState('retry');
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D1CEC3] bg-white py-6 text-center text-xs text-[#1C1C1C]/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif italic">
            IELTS Speaking AI Coach • Teacher First, Scorer Second
          </p>
          <p className="text-[11px] text-[#1C1C1C]/50 font-light">
            Educational diagnostic tool based on official public IELTS band descriptors. Not affiliated with IELTS.
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onResetData={() => {
          localStorage.clear();
          setProfile(loadLearnerProfile());
        }}
      />
    </div>
  );
}
