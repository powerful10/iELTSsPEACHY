import React from 'react';
import { Target, HelpCircle, Volume2, Mic } from 'lucide-react';
import { RetryTask, SpeakingState } from '../types';
import { VoiceOrb } from './VoiceOrb';
import { MicrophoneButton } from './MicrophoneButton';

interface RetryPanelProps {
  retryTask: RetryTask;
  speakingState: SpeakingState;
  volumeLevel: number;
  durationSeconds: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSpeakQuestion?: (text: string) => void;
  permissionError?: string | null;
  onRetryPermission?: () => void;
}

export const RetryPanel: React.FC<RetryPanelProps> = ({
  retryTask,
  speakingState,
  volumeLevel,
  durationSeconds,
  onStartRecording,
  onStopRecording,
  onSpeakQuestion,
  permissionError,
  onRetryPermission,
}) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Target Task Banner */}
      <div className="bg-white border border-[#D1CEC3] rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F4F1EA] text-[#A1824A] text-[10px] font-bold uppercase tracking-[0.25em] border border-[#D1CEC3]">
          <Target className="w-3.5 h-3.5" />
          <span>Target Skill: {retryTask.targetSkillToDemonstrate}</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1C1C1C] leading-snug">
            "{retryTask.promptText}"
          </h2>

          {onSpeakQuestion && (
            <button
              type="button"
              onClick={() => onSpeakQuestion(retryTask.promptText)}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#A1824A] hover:text-[#866A38] transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen to Coach read this prompt</span>
            </button>
          )}
        </div>

        {/* Scaffolding Hint */}
        <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#D1CEC3] text-xs text-[#1C1C1C] flex items-start gap-3 text-left">
          <HelpCircle className="w-4 h-4 text-[#A1824A] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#1C1C1C] uppercase tracking-wider text-[10px]">Tutor hint: </span>
            <span className="font-light">{retryTask.contextHint}</span>
            {retryTask.scaffoldingPhrase && (
              <p className="mt-1 font-serif italic text-xs text-[#A1824A]">
                Starter phrase: "{retryTask.scaffoldingPhrase}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Voice Orb & Controls */}
      <div className="bg-white border border-[#D1CEC3] rounded-2xl p-8 shadow-xs flex flex-col items-center justify-center space-y-6">
        <VoiceOrb
          state={speakingState}
          volumeLevel={volumeLevel}
          size="md"
          statusText={
            speakingState === 'listening'
              ? 'Listening to your retry...'
              : speakingState === 'ai-speaking'
              ? 'Coach speaking question...'
              : 'Click microphone when ready to speak'
          }
          onClick={speakingState === 'listening' ? onStopRecording : onStartRecording}
        />

        <div className="w-full max-w-xs">
          <MicrophoneButton
            isRecording={speakingState === 'listening'}
            durationSeconds={durationSeconds}
            onStart={onStartRecording}
            onStop={onStopRecording}
            permissionError={permissionError}
            onRetryPermission={onRetryPermission}
            label="Record Retry Answer"
          />
        </div>
      </div>
    </div>
  );
};
