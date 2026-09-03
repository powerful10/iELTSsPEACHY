import React, { useState, useEffect } from 'react';
import { Timer, FileEdit, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { SpeakingPrompt } from '../types';

interface Part2CueCardProps {
  prompt: SpeakingPrompt;
  onStartSpeaking: () => void;
  prepCompleted: boolean;
}

export const Part2CueCard: React.FC<Part2CueCardProps> = ({
  prompt,
  onStartSpeaking,
  prepCompleted,
}) => {
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && prepSecondsLeft > 0) {
      interval = window.setInterval(() => {
        setPrepSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, prepSecondsLeft]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setPrepSecondsLeft(60);
  };

  const cuePoints = prompt.cuePoints || [
    'What it is and when it happened',
    'Who was involved with you',
    'Why it was significant or memorable',
    'And explain how you feel about it now',
  ];

  return (
    <div className="bg-white border border-[#D1CEC3] rounded-2xl shadow-xs overflow-hidden max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#1A1A1A] border-b border-[#D1CEC3] px-6 py-4.5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-[#F4F1EA] text-[#A1824A] border border-[#D1CEC3] text-[10px] font-bold tracking-[0.25em] uppercase">
            Part 2 Cue Card
          </span>
          <span className="text-xs text-white/70 font-light">1-Min Individual Prep</span>
        </div>

        {/* 60s Prep Timer Indicator */}
        <div className="flex items-center gap-2 bg-[#EAE8E0] text-[#1C1C1C] px-3.5 py-1 rounded-full text-xs font-mono font-semibold border border-[#D1CEC3]">
          <Timer className="w-3.5 h-3.5 text-[#A1824A]" />
          <span>{prepSecondsLeft}s</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Topic & Cue Card */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-light text-[#1C1C1C] leading-snug">
            {prompt.question}
          </h2>

          <div className="bg-[#F4F1EA] border border-[#D1CEC3] rounded-2xl p-5 space-y-3">
            <p className="text-[10px] font-bold text-[#A1824A] uppercase tracking-[0.25em]">
              You should say:
            </p>
            <ul className="space-y-2">
              {cuePoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-[#1C1C1C]/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A1824A] mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed font-light">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prep Notepad */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="part2-prep-notes" className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider text-[10px]">
              <FileEdit className="w-3.5 h-3.5 text-[#A1824A]" />
              <span>Keyword Brainstorming Pad</span>
            </label>
            <span className="text-[10px] text-[#1C1C1C]/50 font-light">Structure ideas & key collocations</span>
          </div>
          <textarea
            id="part2-prep-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. • setting: quiet countryside • emotion: deeply nostalgic • vocabulary: poignant, watershed moment..."
            rows={3}
            className="w-full text-xs sm:text-sm p-4 bg-white border border-[#D1CEC3] rounded-xl focus:border-[#A1824A] outline-none placeholder:text-[#1C1C1C]/40 resize-none font-serif italic text-[#1C1C1C]"
          />
        </div>

        {/* Timer Controls & CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F4F1EA]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTimer}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors cursor-pointer ${
                isTimerRunning
                  ? 'bg-[#EAE8E0] text-[#1C1C1C] border-[#A1824A]'
                  : 'bg-white text-[#1C1C1C] border-[#D1CEC3] hover:bg-[#F4F1EA]'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#A1824A]" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#A1824A]" /> Start 60s Timer
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetTimer}
              className="p-2 rounded-full text-[#1C1C1C]/60 hover:text-[#1C1C1C] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onStartSpeaking}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-semibold text-xs uppercase tracking-[0.2em] border border-[#1A1A1A] hover:border-[#A1824A] active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A1824A]" />
            <span>{prepSecondsLeft === 0 ? "Time's Up — Speak Now" : 'Ready to Speak Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
