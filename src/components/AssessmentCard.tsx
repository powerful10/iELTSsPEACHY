import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  BookOpen,
  SpellCheck,
  Headphones,
} from 'lucide-react';
import { AssessmentResponse, Language } from '../types';
import { OFFICIAL_CRITERIA_INFO } from '../lib/constants';

interface AssessmentCardProps {
  assessment: AssessmentResponse;
  language: Language;
  onProceedToLesson: () => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  language,
  onProceedToLesson,
}) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);

  const criteriaList = [
    {
      key: 'fluencyCoherence' as const,
      data: assessment.criteria.fluencyCoherence,
      icon: <Layers className="w-4 h-4 text-[#A1824A]" />,
      info: OFFICIAL_CRITERIA_INFO.fluencyCoherence[language],
    },
    {
      key: 'lexicalResource' as const,
      data: assessment.criteria.lexicalResource,
      icon: <BookOpen className="w-4 h-4 text-[#1C1C1C]" />,
      info: OFFICIAL_CRITERIA_INFO.lexicalResource[language],
    },
    {
      key: 'grammar' as const,
      data: assessment.criteria.grammar,
      icon: <SpellCheck className="w-4 h-4 text-[#A1824A]" />,
      info: OFFICIAL_CRITERIA_INFO.grammar[language],
    },
    {
      key: 'pronunciation' as const,
      data: assessment.criteria.pronunciation,
      icon: <Headphones className="w-4 h-4 text-[#1C1C1C]" />,
      info: OFFICIAL_CRITERIA_INFO.pronunciation[language],
    },
  ];

  const confidenceBadge = {
    high: { bg: 'bg-[#EAE8E0] text-[#1C1C1C] border-[#D1CEC3]', text: 'High Confidence' },
    moderate: { bg: 'bg-[#EAE8E0] text-[#1C1C1C] border-[#D1CEC3]', text: 'Moderate Confidence' },
    low: { bg: 'bg-[#EAE8E0] text-[#1C1C1C]/70 border-[#D1CEC3]', text: 'Preliminary Observation' },
  }[assessment.confidence || 'moderate'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner: Diagnostic Estimate & Disclaimer */}
      <div className="bg-white border border-[#D1CEC3] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D1CEC3]/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A1824A] bg-[#F4F1EA] px-3 py-1 rounded-full border border-[#D1CEC3]">
                Diagnostic Evaluation
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${confidenceBadge.bg}`}>
                {confidenceBadge.text}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1C1C1C]">
              Diagnostic Estimate: <span className="font-serif italic font-normal text-[#A1824A]">Band {assessment.diagnosticEstimate.toFixed(1)}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:self-center">
            <button
              type="button"
              onClick={onProceedToLesson}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-semibold text-xs uppercase tracking-[0.2em] border border-[#1A1A1A] hover:border-[#A1824A] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A1824A]" />
              <span>Teach My Bottleneck</span>
            </button>
          </div>
        </div>

        {/* Spoken Coach Summary */}
        <div className="mt-5 p-5 rounded-2xl bg-[#F4F1EA] border border-[#D1CEC3] text-sm text-[#1C1C1C] leading-relaxed">
          <p className="font-bold text-[#A1824A] mb-1.5 text-[10px] uppercase tracking-[0.25em]">
            Coach's Diagnostic Summary:
          </p>
          <p className="font-serif italic text-base sm:text-lg text-[#1C1C1C]/90">"{assessment.coachSpokenSummary}"</p>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-[10px] uppercase tracking-wider text-[#1C1C1C]/60 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#A1824A] flex-shrink-0" />
          <span>{assessment.disclaimer}</span>
        </p>
      </div>

      {/* Highest-Value Priority Bottleneck */}
      <div className="bg-white border-2 border-[#A1824A] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#1A1A1A] text-[#A1824A] rounded-xl border border-[#D1CEC3] flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between gap-2 border-b border-[#F4F1EA] pb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A1824A]">
                Primary Pedagogical Focus
              </span>
              <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#EAE8E0] text-[#1C1C1C] font-semibold border border-[#D1CEC3]">
                Priority: {assessment.microLesson.priorityLevel}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-light text-[#1C1C1C]">
              {assessment.priorityBottleneck}
            </h3>
            <p className="text-xs sm:text-sm text-[#1C1C1C]/75 leading-relaxed font-light">
              {assessment.microLesson.whatHappened}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onProceedToLesson}
                className="text-xs uppercase tracking-[0.2em] font-bold text-[#A1824A] hover:text-[#866A38] inline-flex items-center gap-1.5"
              >
                <span>Study Targeted Micro-Lesson</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Four Official Criteria Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-[#1C1C1C]">
            Official Band Criteria Breakdown
          </h3>
          <span className="text-[10px] uppercase tracking-wider text-[#1C1C1C]/50">4 Core Dimensions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteriaList.map(({ key, data, icon, info }) => {
            const isExpanded = expandedCriterion === key;
            return (
              <div
                key={key}
                className="bg-white border border-[#D1CEC3] rounded-2xl p-5 transition-all hover:border-[#A1824A] shadow-xs"
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F4F1EA]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#F4F1EA] border border-[#D1CEC3]">
                      {icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-[#1C1C1C]">
                        {info.name}
                      </h4>
                      <p className="text-xs text-[#1C1C1C]/60 font-medium">
                        Band Estimate: <span className="font-serif italic font-bold text-[#A1824A]">Band {data.estimate.toFixed(1)}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#EAE8E0] border border-[#D1CEC3] text-[#1C1C1C]/70 font-semibold uppercase tracking-wider">
                    {data.confidence}
                  </span>
                </div>

                <p className="mt-3 text-xs text-[#1C1C1C]/75 leading-relaxed font-light">
                  {data.summary}
                </p>

                {/* Growth & Observations Toggle */}
                <div className="mt-3 pt-3 border-t border-[#F4F1EA]">
                  <button
                    type="button"
                    onClick={() => setExpandedCriterion(isExpanded ? null : key)}
                    className="flex items-center justify-between w-full text-xs uppercase tracking-wider font-semibold text-[#A1824A] hover:text-[#866A38]"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Specific Observations'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2.5 text-xs">
                      {data.positiveEvidence?.length > 0 && (
                        <div className="p-3 bg-[#F4F1EA] rounded-xl border border-[#D1CEC3]">
                          <p className="font-bold text-[#1C1C1C] mb-1 text-[10px] uppercase tracking-wider">Observed strengths:</p>
                          <ul className="list-disc pl-4 space-y-1 text-[#1C1C1C]/80 font-light">
                            {data.positiveEvidence.map((pos, idx) => (
                              <li key={idx}>{pos}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {data.growthAreas?.length > 0 && (
                        <div className="p-3 bg-white rounded-xl border border-[#D1CEC3]">
                          <p className="font-bold text-[#A1824A] mb-1 text-[10px] uppercase tracking-wider">Growth opportunities:</p>
                          <ul className="list-disc pl-4 space-y-1 text-[#1C1C1C]/80 font-light">
                            {data.growthAreas.map((area, idx) => (
                              <li key={idx}>{area}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths Observed */}
      {assessment.strengths?.length > 0 && (
        <div className="bg-white border border-[#D1CEC3] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#1C1C1C] font-bold text-xs uppercase tracking-[0.2em]">
            <CheckCircle2 className="w-4 h-4 text-[#A1824A]" />
            <span>Key Observable Strengths</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {assessment.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-[#1C1C1C]/80 bg-[#F4F1EA] p-3 rounded-xl border border-[#D1CEC3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A1824A] mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed font-light">{str}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Spoken Response Transcript Collapsible */}
      <div className="bg-white border border-[#D1CEC3] rounded-2xl p-5 shadow-xs">
        <button
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex items-center justify-between w-full text-left font-semibold text-xs uppercase tracking-[0.2em] text-[#1C1C1C]"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#A1824A]" />
            <span>Spoken Answer Transcript</span>
          </div>
          {showTranscript ? <ChevronUp className="w-4 h-4 text-[#1C1C1C]/60" /> : <ChevronDown className="w-4 h-4 text-[#1C1C1C]/60" />}
        </button>

        {showTranscript && (
          <div className="mt-4 pt-4 border-t border-[#D1CEC3] text-[#1C1C1C] leading-relaxed bg-[#F4F1EA] p-5 rounded-xl font-serif italic text-sm border border-[#D1CEC3]">
            {assessment.transcript || 'No speech transcribed.'}
          </div>
        )}
      </div>
    </div>
  );
};
