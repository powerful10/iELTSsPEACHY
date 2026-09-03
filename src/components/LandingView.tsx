import React, { useState } from 'react';
import {
  Mic,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Target,
  BookOpen,
  RotateCcw,
  TrendingUp,
  Layers,
  Award,
  Globe,
} from 'lucide-react';
import { Language, LearnerProfile } from '../types';
import { UI_TRANSLATIONS } from '../lib/constants';

interface LandingViewProps {
  profile: LearnerProfile;
  onUpdateProfile: (updates: Partial<LearnerProfile>) => void;
  onStartSpeaking: () => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  profile,
  onUpdateProfile,
  onStartSpeaking,
  language,
  onToggleLanguage,
}) => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(profile.targetBand || 7.0);
  const [selectedBaseline, setSelectedBaseline] = useState(profile.currentEstimate || 6.0);
  const [examDate, setExamDate] = useState(profile.examDate || '');

  const t = UI_TRANSLATIONS[language];

  const handleSaveGoalAndStart = () => {
    onUpdateProfile({
      targetBand: selectedTarget,
      currentEstimate: selectedBaseline,
      examDate,
    });
    setShowGoalModal(false);
    onStartSpeaking();
  };

  const loopSteps = [
    {
      num: '1',
      title: 'Speak',
      desc: 'Answer authentic Part 1, 2, or 3 speaking prompts through natural voice interaction.',
      icon: <Mic className="w-4 h-4 text-[#A1824A]" />,
    },
    {
      num: '2',
      title: 'Assess',
      desc: 'Holistic diagnostic evaluation against all 4 official IELTS criteria with evidence.',
      icon: <Layers className="w-4 h-4 text-[#1C1C1C]" />,
    },
    {
      num: '3',
      title: 'Teach',
      desc: 'Actionable 45-second micro-lesson focusing purely on your single biggest bottleneck.',
      icon: <BookOpen className="w-4 h-4 text-[#A1824A]" />,
    },
    {
      num: '4',
      title: 'Retry',
      desc: 'Immediate transfer retry using a related prompt to activate the newly learned skill.',
      icon: <RotateCcw className="w-4 h-4 text-[#1C1C1C]" />,
    },
    {
      num: '5',
      title: 'Improve',
      desc: 'Direct Before → After comparison of quotes, demonstrating authentic observable gains.',
      icon: <TrendingUp className="w-4 h-4 text-[#A1824A]" />,
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 px-4">
        {/* Language selector toggle */}
        <div className="inline-flex items-center gap-1.5 p-1 bg-[#EAE8E0] rounded-full border border-[#D1CEC3] text-xs font-semibold text-[#1C1C1C] mb-2">
          <Globe className="w-3.5 h-3.5 ml-2 text-[#A1824A]" />
          <button
            type="button"
            onClick={() => onToggleLanguage('en')}
            className={`px-3.5 py-1 rounded-full text-[11px] uppercase tracking-wider transition-all ${
              language === 'en' ? 'bg-white text-[#1C1C1C] shadow-xs font-bold border border-[#D1CEC3]' : 'text-[#1C1C1C]/70 hover:text-[#1C1C1C]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onToggleLanguage('uz')}
            className={`px-3.5 py-1 rounded-full text-[11px] uppercase tracking-wider transition-all ${
              language === 'uz' ? 'bg-white text-[#1C1C1C] shadow-xs font-bold border border-[#D1CEC3]' : 'text-[#1C1C1C]/70 hover:text-[#1C1C1C]'
            }`}
          >
            O'zbekcha
          </button>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D1CEC3] text-[#A1824A] text-[10px] font-bold uppercase tracking-[0.25em] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A1824A]" />
            <span>Official Criteria-Grounded AI Tutoring</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-[#1C1C1C] tracking-tight leading-[1.08]">
            {t.tagline}
          </h1>

          <p className="text-base sm:text-lg text-[#1C1C1C]/75 max-w-2xl mx-auto leading-relaxed font-light">
            {t.subTagline}
          </p>
        </div>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <button
            type="button"
            onClick={() => setShowGoalModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-semibold text-xs uppercase tracking-[0.2em] border border-[#1A1A1A] hover:border-[#A1824A] shadow-md active:scale-95 transition-all cursor-pointer focus:outline-none"
          >
            <Mic className="w-4 h-4 text-[#A1824A]" />
            <span>{t.startSpeaking}</span>
            <ArrowRight className="w-4 h-4 ml-0.5 text-[#A1824A]" />
          </button>

          <button
            type="button"
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-[#EAE8E0] border border-[#D1CEC3] text-[#1C1C1C] font-semibold text-xs uppercase tracking-[0.2em] active:scale-95 transition-all"
          >
            <span>{t.howItWorks}</span>
          </button>
        </div>

        {/* Trust disclaimer badge */}
        <div className="pt-2">
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#1C1C1C]/60 bg-white/70 px-4 py-1.5 rounded-full border border-[#D1CEC3]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A1824A] flex-shrink-0" />
            <span>{t.approximateEstimateDisclaimer}</span>
          </p>
        </div>
      </section>

      {/* The Core Learning Loop Diagram */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#A1824A]">
            The Pedagogical Loop
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1C1C1C]">
            Teacher First, <span className="italic font-serif">Scorer Second</span>
          </h2>
          <p className="text-xs text-[#1C1C1C]/70 max-w-xl mx-auto leading-relaxed">
            Traditional platforms stop at numerical estimates. This tutor actively instructs you on observable mechanics and verifies your transfer retry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {loopSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#D1CEC3] rounded-2xl p-5 shadow-xs relative flex flex-col items-start space-y-3 hover:border-[#A1824A] transition-colors"
            >
              <div className="flex items-center justify-between w-full border-b border-[#F4F1EA] pb-3">
                <div className="p-2 rounded-lg bg-[#F4F1EA] border border-[#D1CEC3]/60">
                  {step.icon}
                </div>
                <span className="text-2xl font-serif italic text-[#A1824A]/70">
                  0{step.num}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#1C1C1C]">
                  {step.title}
                </h3>
                <p className="text-xs text-[#1C1C1C]/70 leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Target Goal Setup Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1C1C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F4F1EA] border border-[#D1CEC3] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="space-y-1.5 border-b border-[#D1CEC3] pb-4">
              <div className="flex items-center gap-2 text-[#A1824A] font-bold text-[10px] uppercase tracking-[0.25em]">
                <Target className="w-4 h-4" />
                <span>Personalize Coaching Trajectory</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#1C1C1C]">
                {t.setGoalTitle}
              </h3>
              <p className="text-xs text-[#1C1C1C]/70 font-light">
                {t.setGoalSubtitle}
              </p>
            </div>

            <div className="space-y-5">
              {/* Baseline Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#1C1C1C] uppercase tracking-widest">
                  {t.currentLevelLabel}: <span className="text-[#A1824A] font-serif italic text-base">Band {selectedBaseline}</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[5.0, 5.5, 6.0, 6.5, 7.0].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBaseline(b)}
                      className={`py-2 rounded-xl text-xs font-serif font-bold transition-all border ${
                        selectedBaseline === b
                          ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs'
                          : 'bg-white text-[#1C1C1C] border-[#D1CEC3] hover:bg-[#EAE8E0]'
                      }`}
                    >
                      {b.toFixed(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Band Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#1C1C1C] uppercase tracking-widest">
                  {t.targetBandLabel}: <span className="text-[#A1824A] font-serif italic text-base">Band {selectedTarget}</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[6.5, 7.0, 7.5, 8.0, 8.5].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedTarget(b)}
                      className={`py-2 rounded-xl text-xs font-serif font-bold transition-all border ${
                        selectedTarget === b
                          ? 'bg-[#A1824A] text-white border-[#A1824A] shadow-xs'
                          : 'bg-white text-[#1C1C1C] border-[#D1CEC3] hover:bg-[#EAE8E0]'
                      }`}
                    >
                      {b.toFixed(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Exam Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1C1C1C]/70">
                  {t.examDateLabel}
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#D1CEC3] bg-white focus:border-[#A1824A] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D1CEC3]">
              <button
                type="button"
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1C1C1C]/70 hover:bg-[#EAE8E0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGoalAndStart}
                className="px-6 py-2.5 rounded-xl bg-[#1C1C1C] hover:bg-black text-white text-xs uppercase tracking-wider font-bold shadow-sm active:scale-95 transition-all"
              >
                {t.continueToPractice} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
