import React from 'react';
import {
  TrendingUp,
  Target,
  Award,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
} from 'lucide-react';
import { LearnerProfile, Language } from '../types';
import { OFFICIAL_CRITERIA_INFO } from '../lib/constants';

interface ProgressDashboardProps {
  profile: LearnerProfile;
  language: Language;
  onSelectPrompt?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  profile,
  language,
  onSelectPrompt,
}) => {
  const formatMinutes = (secs: number) => {
    const mins = Math.round(secs / 60);
    return `${mins} min`;
  };

  const criteria = [
    {
      key: 'fluencyCoherence',
      name: OFFICIAL_CRITERIA_INFO.fluencyCoherence[language].name,
      score: profile.criteriaTrends?.fluencyCoherence || 6.0,
      color: 'bg-[#A1824A]',
    },
    {
      key: 'lexicalResource',
      name: OFFICIAL_CRITERIA_INFO.lexicalResource[language].name,
      score: profile.criteriaTrends?.lexicalResource || 6.0,
      color: 'bg-[#1C1C1C]',
    },
    {
      key: 'grammar',
      name: OFFICIAL_CRITERIA_INFO.grammar[language].name,
      score: profile.criteriaTrends?.grammar || 5.5,
      color: 'bg-[#A1824A]',
    },
    {
      key: 'pronunciation',
      name: OFFICIAL_CRITERIA_INFO.pronunciation[language].name,
      score: profile.criteriaTrends?.pronunciation || 6.0,
      color: 'bg-[#1C1C1C]',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Header Overview Banner */}
      <div className="bg-white border border-[#D1CEC3] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#D1CEC3]/60">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A1824A] bg-[#F4F1EA] px-3 py-1 rounded-full border border-[#D1CEC3]">
              Diagnostic Trajectory
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-light text-[#1C1C1C]">
              Current Baseline: <span className="font-serif italic text-[#A1824A]">Band {profile.currentEstimate?.toFixed(1) || '6.0'}</span>
            </h2>
            <p className="text-xs text-[#1C1C1C]/60 font-light">
              Target Goal: <span className="font-serif font-semibold text-[#1C1C1C]">Band {profile.targetBand?.toFixed(1) || '7.0'}</span>
              {profile.examDate && (
                <span className="ml-3 inline-flex items-center gap-1 text-[#1C1C1C]/70">
                  <Calendar className="w-3 h-3 text-[#A1824A]" /> Target Date: {profile.examDate}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onSelectPrompt && (
              <button
                type="button"
                onClick={onSelectPrompt}
                className="px-6 py-3 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-semibold text-xs uppercase tracking-[0.2em] border border-[#1A1A1A] hover:border-[#A1824A] shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Practice Spoken Prompt
              </button>
            )}
          </div>
        </div>

        {/* 4 Metric Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#D1CEC3] space-y-1">
            <span className="text-[9px] font-bold text-[#1C1C1C]/60 uppercase tracking-[0.2em]">
              Total Sessions
            </span>
            <p className="text-3xl font-serif font-light text-[#1C1C1C]">
              {profile.totalSessions || 0}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#D1CEC3] space-y-1">
            <span className="text-[9px] font-bold text-[#1C1C1C]/60 uppercase tracking-[0.2em]">
              Practice Time
            </span>
            <p className="text-3xl font-serif font-light text-[#1C1C1C]">
              {formatMinutes(profile.totalSpeakingTimeSeconds || 0)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#D1CEC3] space-y-1">
            <span className="text-[9px] font-bold text-[#1C1C1C]/60 uppercase tracking-[0.2em]">
              Target Retries
            </span>
            <p className="text-3xl font-serif font-light text-[#1C1C1C]">
              {profile.completedRetries || 0}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#D1CEC3] space-y-1">
            <span className="text-[9px] font-bold text-[#A1824A] uppercase tracking-[0.2em]">
              Skills Mastered
            </span>
            <p className="text-3xl font-serif font-light text-[#A1824A]">
              {profile.masteredSkills?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Criteria Progress Bars */}
      <div className="bg-white border border-[#D1CEC3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-base font-serif font-light text-[#1C1C1C] border-b border-[#F4F1EA] pb-3">
          Official Criteria Breakdown & Trends
        </h3>

        <div className="space-y-5">
          {criteria.map((c) => {
            const pct = Math.min(100, Math.max(10, ((c.score - 4) / 5) * 100));
            return (
              <div key={c.key} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1C1C1C] font-serif font-medium">{c.name}</span>
                  <span className="font-serif italic font-bold text-[#A1824A]">Band {c.score.toFixed(1)}</span>
                </div>
                <div className="w-full h-2 bg-[#EAE8E0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${c.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mastered Skills & Active Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mastered Skills */}
        <div className="bg-white border border-[#D1CEC3] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#1C1C1C] font-bold text-xs uppercase tracking-[0.2em]">
            <CheckCircle2 className="w-4 h-4 text-[#A1824A]" />
            <span>Mastered Skills</span>
          </div>

          {profile.masteredSkills?.length > 0 ? (
            <ul className="space-y-2">
              {profile.masteredSkills.map((skill, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-[#1C1C1C] bg-[#F4F1EA] p-3 rounded-xl border border-[#D1CEC3]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A1824A] mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed font-light">{skill}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#1C1C1C]/60 italic font-serif py-2">
              Complete retries following micro-lessons to record demonstrated skills here.
            </p>
          )}
        </div>

        {/* Active Focus Areas */}
        <div className="bg-white border border-[#D1CEC3] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#1C1C1C] font-bold text-xs uppercase tracking-[0.2em]">
            <AlertTriangle className="w-4 h-4 text-[#A1824A]" />
            <span>Active Growth Bottlenecks</span>
          </div>

          {profile.recurringWeaknesses?.length > 0 ? (
            <ul className="space-y-2">
              {profile.recurringWeaknesses.map((weakness, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-[#1C1C1C] bg-[#F4F1EA] p-3 rounded-xl border border-[#D1CEC3]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1C1C1C] mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed font-light">{weakness}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#1C1C1C]/60 italic font-serif py-2">
              No recurring issues currently detected. Continue practicing!
            </p>
          )}
        </div>
      </div>

      {/* Recent Practice Attempts */}
      {profile.recentAttempts?.length > 0 && (
        <div className="bg-white border border-[#D1CEC3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-3">
            <h3 className="text-base font-serif font-light text-[#1C1C1C]">
              Recent Practice History
            </h3>
            <span className="text-xs text-[#1C1C1C]/50 font-light">Last {profile.recentAttempts.length} sessions</span>
          </div>

          <div className="space-y-3">
            {profile.recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="p-4 rounded-xl bg-[#F4F1EA] border border-[#D1CEC3] space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EAE8E0] text-[#1C1C1C] border border-[#D1CEC3] font-bold text-[10px] uppercase tracking-wider">
                      Part {attempt.part}
                    </span>
                    <span className="font-serif font-medium text-[#1C1C1C]">
                      {attempt.prompt?.topic || 'Speaking Practice'}
                    </span>
                  </div>
                  <span className="text-[#1C1C1C]/50 text-[11px] font-mono">
                    {new Date(attempt.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-[#1C1C1C]/80 font-serif italic">
                  "{attempt.prompt?.question}"
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-[#1C1C1C]/70 border-t border-[#D1CEC3]/50">
                  <span className="font-serif font-bold text-[#A1824A]">
                    Estimate: Band {attempt.diagnosticEstimate.toFixed(1)}
                  </span>
                  {attempt.priorityBottleneck && (
                    <span className="text-[#1C1C1C]">
                      Priority: {attempt.priorityBottleneck}
                    </span>
                  )}
                  {attempt.retryAttempt && (
                    <span className="px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#A1824A] text-[10px] font-semibold uppercase tracking-wider">
                      ✓ Retry Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
