import React from 'react';
import { BookOpen, ArrowRight, Lightbulb, Volume2, CheckCircle, Target } from 'lucide-react';
import { MicroLesson, RetryTask } from '../types';

interface MicroLessonPanelProps {
  lesson: MicroLesson;
  retryTask: RetryTask;
  onStartRetry: () => void;
  onSpeakModel?: (text: string) => void;
}

export const MicroLessonPanel: React.FC<MicroLessonPanelProps> = ({
  lesson,
  retryTask,
  onStartRetry,
  onSpeakModel,
}) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Lesson Header Banner */}
      <div className="bg-[#1A1A1A] text-white border border-[#D1CEC3] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-[#A1824A] text-[10px] font-bold uppercase tracking-[0.25em] mb-2">
          <BookOpen className="w-3.5 h-3.5 text-[#A1824A]" />
          <span>Targeted Micro-Lesson (30-60 Seconds)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-light leading-tight text-white">
          {lesson.bottleneckTitle}
        </h2>
        <p className="mt-2 text-white/70 text-xs sm:text-sm font-light leading-relaxed max-w-2xl">
          Focusing on this single weakness will produce the highest immediate improvement in your IELTS speaking control.
        </p>
      </div>

      {/* 4-Step Pedagogical Breakdown: Notice -> Explain -> Model -> Practice */}
      <div className="bg-white border border-[#D1CEC3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
        {/* Step 1: Notice (What Happened) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-[#1C1C1C]">
            <span className="w-6 h-6 rounded-full bg-[#EAE8E0] text-[#1C1C1C] border border-[#D1CEC3] text-xs font-serif font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-serif text-lg text-[#1C1C1C]">Notice: What Happened in Your Answer</h3>
          </div>
          <div className="ml-8 text-xs sm:text-sm text-[#1C1C1C]/80 leading-relaxed bg-[#F4F1EA] p-4 rounded-xl border border-[#D1CEC3] font-light">
            {lesson.whatHappened}
          </div>
        </div>

        {/* Step 2: Explain (Why It Matters for IELTS) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-[#1C1C1C]">
            <span className="w-6 h-6 rounded-full bg-[#EAE8E0] text-[#1C1C1C] border border-[#D1CEC3] text-xs font-serif font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="font-serif text-lg text-[#1C1C1C]">Explain: Why This Matters for IELTS</h3>
          </div>
          <div className="ml-8 text-xs sm:text-sm text-[#1C1C1C]/80 leading-relaxed bg-white p-4 rounded-xl border border-[#D1CEC3] font-light">
            {lesson.whyItMatters}
          </div>
        </div>

        {/* Step 3: Model (Concrete Actionable Strategy & Examples) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#1C1C1C]">
            <span className="w-6 h-6 rounded-full bg-[#EAE8E0] text-[#1C1C1C] border border-[#D1CEC3] text-xs font-serif font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="font-serif text-lg text-[#1C1C1C]">Model: Concrete Strategy & Examples</h3>
          </div>

          <div className="ml-8 space-y-4">
            <div className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-[#1C1C1C] bg-[#F4F1EA] p-4 rounded-xl border border-[#D1CEC3]">
              <Lightbulb className="w-4 h-4 text-[#A1824A] flex-shrink-0 mt-0.5" />
              <span>{lesson.concreteStrategy}</span>
            </div>

            {/* Model Comparison Cards */}
            <div className="space-y-3">
              {lesson.examples.map((ex, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#F4F1EA] border border-[#D1CEC3] text-xs"
                >
                  {/* Before */}
                  <div className="space-y-1">
                    <span className="font-bold text-[#1C1C1C]/70 uppercase tracking-widest text-[9px]">
                      Avoid (Hesitant or Redundant)
                    </span>
                    <p className="text-[#1C1C1C]/70 italic font-serif bg-white p-3 rounded-lg border border-[#D1CEC3]">
                      "{ex.before}"
                    </p>
                  </div>

                  {/* After */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#A1824A] uppercase tracking-widest text-[9px]">
                        Prefer (Natural & Controlled)
                      </span>
                      {onSpeakModel && (
                        <button
                          type="button"
                          onClick={() => onSpeakModel(ex.after)}
                          className="text-[#A1824A] hover:text-[#1C1C1C] p-0.5"
                          title="Listen to model pronunciation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-[#1C1C1C] font-serif italic bg-white p-3 rounded-lg border border-[#D1CEC3]">
                      "{ex.after}"
                    </p>
                  </div>

                  {ex.explanation && (
                    <div className="sm:col-span-2 text-[#1C1C1C]/60 text-[11px] pt-1 border-t border-[#D1CEC3]/60 font-light">
                      Note: {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Practice Tip */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-[#1C1C1C]">
            <span className="w-6 h-6 rounded-full bg-[#EAE8E0] text-[#1C1C1C] border border-[#D1CEC3] text-xs font-serif font-bold flex items-center justify-center">
              4
            </span>
            <h3 className="font-serif text-lg text-[#1C1C1C]">Practice Tip for Your Retry</h3>
          </div>
          <div className="ml-8 flex items-start gap-2.5 text-xs text-[#1C1C1C]/80 bg-[#F4F1EA] p-4 rounded-xl border border-[#D1CEC3] font-light">
            <CheckCircle className="w-4 h-4 text-[#A1824A] flex-shrink-0 mt-0.5" />
            <span>{lesson.practiceTip}</span>
          </div>
        </div>
      </div>

      {/* Target Retry Trigger Banner */}
      <div className="bg-[#F4F1EA] border border-[#D1CEC3] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-[#A1824A] font-bold text-[10px] uppercase tracking-[0.25em]">
            <Target className="w-3.5 h-3.5" />
            <span>Immediate Transfer Retry</span>
          </div>
          <h4 className="text-lg font-serif font-light text-[#1C1C1C]">
            Apply this skill now to a related prompt
          </h4>
          <p className="text-xs text-[#1C1C1C]/70 max-w-md font-light leading-relaxed">
            The tutor presents a fresh related prompt to verify active skill production rather than passive repetition.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#1A1A1A] hover:bg-black text-white rounded-full font-semibold text-xs uppercase tracking-[0.2em] border border-[#1A1A1A] hover:border-[#A1824A] shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <span>Start Retry Now</span>
          <ArrowRight className="w-4 h-4 text-[#A1824A]" />
        </button>
      </div>
    </div>
  );
};
