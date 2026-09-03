import React from 'react';
import { Sparkles, Mic, BarChart3, Settings, Globe } from 'lucide-react';
import { Language, SpeakingPart } from '../types';

interface SessionHeaderProps {
  currentView: 'landing' | 'studio' | 'progress';
  onNavigate: (view: 'landing' | 'studio' | 'progress') => void;
  currentPart: SpeakingPart;
  onSelectPart: (part: SpeakingPart) => void;
  targetBand: number;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenSettings: () => void;
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({
  currentView,
  onNavigate,
  currentPart,
  onSelectPart,
  targetBand,
  language,
  onToggleLanguage,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F4F1EA]/90 backdrop-blur-md border-b border-[#D1CEC3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Logo / App Name */}
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white border border-[#D1CEC3] flex items-center justify-center font-serif font-bold text-sm shadow-xs group-hover:bg-[#A1824A] group-hover:border-[#A1824A] transition-colors">
            <span className="italic">IE</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-[#1C1C1C] text-xl sm:text-2xl tracking-tight leading-none">
                IELTS
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#A1824A]">
                Speaking Coach
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#1C1C1C]/60 block mt-0.5">
              Criteria-Grounded AI Studio
            </span>
          </div>
        </button>

        {/* Part Selection (Part 1, 2, 3) when in Studio */}
        {currentView === 'studio' && (
          <div className="hidden md:flex items-center gap-1 p-1 bg-[#EAE8E0] rounded-full border border-[#D1CEC3] text-xs font-semibold text-[#1C1C1C]">
            <button
              type="button"
              onClick={() => onSelectPart(1)}
              className={`px-4 py-1.5 rounded-full transition-all text-[11px] uppercase tracking-wider ${
                currentPart === 1
                  ? 'bg-[#1C1C1C] text-white shadow-xs font-bold'
                  : 'hover:text-[#A1824A]'
              }`}
            >
              Part 1: Interview
            </button>
            <button
              type="button"
              onClick={() => onSelectPart(2)}
              className={`px-4 py-1.5 rounded-full transition-all text-[11px] uppercase tracking-wider ${
                currentPart === 2
                  ? 'bg-[#1C1C1C] text-white shadow-xs font-bold'
                  : 'hover:text-[#A1824A]'
              }`}
            >
              Part 2: Long Turn
            </button>
            <button
              type="button"
              onClick={() => onSelectPart(3)}
              className={`px-4 py-1.5 rounded-full transition-all text-[11px] uppercase tracking-wider ${
                currentPart === 3
                  ? 'bg-[#1C1C1C] text-white shadow-xs font-bold'
                  : 'hover:text-[#A1824A]'
              }`}
            >
              Part 3: Discussion
            </button>
          </div>
        )}

        {/* Right Navigation & Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Target Band Chip */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D1CEC3] text-xs font-serif font-bold text-[#1C1C1C] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A1824A]" />
            <span className="text-[10px] uppercase tracking-widest text-[#1C1C1C]/60 font-sans">Target:</span>
            <span className="italic text-[#A1824A]">Band {targetBand.toFixed(1)}</span>
          </div>

          {/* Navigation Links */}
          <button
            type="button"
            onClick={() => onNavigate('studio')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all border ${
              currentView === 'studio'
                ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs'
                : 'text-[#1C1C1C] border-[#D1CEC3] bg-white hover:border-[#A1824A] hover:text-[#A1824A]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Practice</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('progress')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all border ${
              currentView === 'progress'
                ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs'
                : 'text-[#1C1C1C] border-[#D1CEC3] bg-white hover:border-[#A1824A] hover:text-[#A1824A]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Progress</span>
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => onToggleLanguage(language === 'en' ? 'uz' : 'en')}
            className="px-2.5 py-1.5 rounded-full border border-[#D1CEC3] bg-white hover:bg-[#EAE8E0] text-xs font-mono font-bold text-[#1C1C1C] transition-colors inline-flex items-center gap-1"
            title="Toggle English / Uzbek language"
          >
            <Globe className="w-3.5 h-3.5 text-[#A1824A]" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-full border border-[#D1CEC3] bg-white text-[#1C1C1C]/70 hover:text-[#1C1C1C] hover:border-[#A1824A] transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
