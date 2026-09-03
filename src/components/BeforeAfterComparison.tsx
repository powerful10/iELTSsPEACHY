import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, RotateCcw, HeartHandshake, Award } from 'lucide-react';
import { AttemptComparison } from '../types';

interface BeforeAfterComparisonProps {
  comparison: AttemptComparison;
  onNextQuestion: () => void;
  onDrillMore: () => void;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  comparison,
  onNextQuestion,
  onDrillMore,
}) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Banner: Celebration of Observable Progress */}
      <div className="bg-[#1A1A1A] text-white border border-[#D1CEC3] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-[#A1824A] text-[10px] font-bold uppercase tracking-[0.25em] mb-2">
          <Award className="w-4 h-4 text-[#A1824A]" />
          <span>Before → After Diagnostic Evidence</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-light leading-tight text-white">
          {comparison.didImprove
            ? 'Demonstrated Improvement in Target Skill'
            : 'Target Skill Attempted & Recorded'}
        </h2>
        <p className="mt-2 text-white/70 text-xs sm:text-sm font-light leading-relaxed max-w-2xl">
          {comparison.summary}
        </p>
      </div>

      {/* Side-by-Side Comparison of Quotes */}
      <div className="bg-white border border-[#D1CEC3] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-[#F4F1EA] pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A1824A] block">
            Target Focus Area
          </span>
          <h3 className="text-xl font-serif font-light text-[#1C1C1C]">
            "{comparison.targetSkill}"
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before: Initial Attempt Quote */}
          <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#D1CEC3] space-y-2">
            <span className="text-[10px] font-bold text-[#1C1C1C]/60 uppercase tracking-wider">
              Initial Attempt (Pre-Lesson)
            </span>
            <div className="p-3 bg-white rounded-lg border border-[#D1CEC3] text-xs text-[#1C1C1C]/75 italic font-serif leading-relaxed min-h-[70px] flex items-center">
              "{comparison.beforeQuote || 'Initial speech formulation'}"
            </div>
          </div>

          {/* After: Retry Attempt Quote */}
          <div className="p-4 rounded-xl bg-[#F4F1EA] border border-[#A1824A] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#A1824A] uppercase tracking-wider">
                Retry Attempt (Post-Lesson)
              </span>
              <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-[#A1824A] font-bold uppercase tracking-wider">
                Improved Control
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#D1CEC3] text-xs text-[#1C1C1C] italic font-serif leading-relaxed min-h-[70px] flex items-center">
              "{comparison.afterQuote || 'Retry speech formulation'}"
            </div>
          </div>
        </div>

        {/* Specific Observable Gains */}
        {comparison.specificGains?.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-[#F4F1EA]">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A1824A]">
              Observable Evidence of Progress
            </h4>
            <div className="space-y-2">
              {comparison.specificGains.map((gain, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F4F1EA] border border-[#D1CEC3] text-xs text-[#1C1C1C]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#A1824A] flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-light">{gain}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coach Commentary & Next Step */}
        <div className="p-5 rounded-xl bg-[#F4F1EA] border border-[#D1CEC3] text-xs text-[#1C1C1C] space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#A1824A] text-[10px] uppercase tracking-[0.2em]">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Tutor Feedback Commentary:</span>
          </div>
          <p className="leading-relaxed text-[#1C1C1C]/80 font-serif italic text-sm">
            "{comparison.coachComment}"
          </p>
          {comparison.nextStepRecommendation && (
            <p className="font-medium text-[#1C1C1C] pt-2 border-t border-[#D1CEC3]/60 text-xs">
              <span className="text-[#A1824A] font-bold uppercase tracking-wider text-[10px]">Next recommended step: </span>
              {comparison.nextStepRecommendation}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onDrillMore}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#D1CEC3] bg-white hover:bg-[#EAE8E0] text-[#1C1C1C] font-semibold text-xs uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#A1824A]" />
          <span>Practice This Weakness More</span>
        </button>

        <button
          type="button"
          onClick={onNextQuestion}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-semibold text-xs uppercase tracking-[0.2em] border border-[#1A1A1A] hover:border-[#A1824A] active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <span>Continue to Next Prompt</span>
          <ArrowRight className="w-4 h-4 text-[#A1824A]" />
        </button>
      </div>
    </div>
  );
};
