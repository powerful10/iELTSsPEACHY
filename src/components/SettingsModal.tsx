import React from 'react';
import { Settings, Globe, Target, Mic, RotateCcw, X, Check } from 'lucide-react';
import { LearnerProfile, Language } from '../types';
import { UI_TRANSLATIONS } from '../lib/constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LearnerProfile;
  onUpdateProfile: (updates: Partial<LearnerProfile>) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onResetData,
}) => {
  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[profile.preferredLanguage];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#D1CEC3] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-[#1C1C1C]">
        <div className="flex items-center justify-between pb-4 border-b border-[#D1CEC3]/60">
          <div className="flex items-center gap-2.5 text-[#1C1C1C]">
            <Settings className="w-5 h-5 text-[#A1824A]" />
            <h3 className="font-serif font-light text-2xl text-[#1C1C1C]">Coach Settings</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#1C1C1C]/50 hover:text-[#1C1C1C] hover:bg-[#F4F1EA] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-[0.25em] text-[#A1824A]">
              <Globe className="w-3.5 h-3.5 text-[#A1824A]" />
              <span>Explanation & Feedback Language</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateProfile({ preferredLanguage: 'en' })}
                className={`p-3.5 rounded-xl border text-xs font-serif font-medium flex items-center justify-between transition-all cursor-pointer ${
                  profile.preferredLanguage === 'en'
                    ? 'border-[#A1824A] bg-[#F4F1EA] text-[#1C1C1C]'
                    : 'border-[#D1CEC3] bg-white text-[#1C1C1C]/70 hover:bg-[#F4F1EA]'
                }`}
              >
                <span>English (Recommended)</span>
                {profile.preferredLanguage === 'en' && <Check className="w-3.5 h-3.5 text-[#A1824A]" />}
              </button>

              <button
                type="button"
                onClick={() => onUpdateProfile({ preferredLanguage: 'uz' })}
                className={`p-3.5 rounded-xl border text-xs font-serif font-medium flex items-center justify-between transition-all cursor-pointer ${
                  profile.preferredLanguage === 'uz'
                    ? 'border-[#A1824A] bg-[#F4F1EA] text-[#1C1C1C]'
                    : 'border-[#D1CEC3] bg-white text-[#1C1C1C]/70 hover:bg-[#F4F1EA]'
                }`}
              >
                <span>O'zbekcha (Tabiiy o'zbek tili)</span>
                {profile.preferredLanguage === 'uz' && <Check className="w-3.5 h-3.5 text-[#A1824A]" />}
              </button>
            </div>
            <p className="text-[11px] text-[#1C1C1C]/60 font-light">
              Speaking practice is always conducted in English. Explanations and micro-lessons adapt to your preferred language.
            </p>
          </div>

          {/* Target Band Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-[0.25em] text-[#A1824A]">
              <Target className="w-3.5 h-3.5 text-[#A1824A]" />
              <span>Target Band: Band {profile.targetBand}</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[6.0, 6.5, 7.0, 7.5, 8.0].map((band) => (
                <button
                  key={band}
                  type="button"
                  onClick={() => onUpdateProfile({ targetBand: band })}
                  className={`py-2 rounded-xl text-xs font-serif font-bold border transition-all cursor-pointer ${
                    profile.targetBand === band
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-[#1C1C1C] border-[#D1CEC3] hover:bg-[#F4F1EA]'
                  }`}
                >
                  {band.toFixed(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Info */}
          <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#D1CEC3] space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1C1C1C] uppercase tracking-wider text-[10px]">
              <Mic className="w-3.5 h-3.5 text-[#A1824A]" />
              <span>Microphone & Audio Processing</span>
            </div>
            <p className="text-[11px] text-[#1C1C1C]/70 font-light leading-relaxed">
              Standard 16kHz/48kHz browser audio recording with automatic echo cancellation. Audio is processed server-side through Gemini multimodal reasoning.
            </p>
          </div>

          {/* Reset Memory / History */}
          <div className="pt-3 border-t border-[#D1CEC3]/60 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all practice history and student memory?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#1C1C1C]/60 hover:text-[#1C1C1C] uppercase tracking-wider text-[10px] font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#A1824A]" />
              <span>Reset memory</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white rounded-full text-xs uppercase tracking-[0.2em] font-semibold border border-[#1A1A1A] hover:border-[#A1824A] shadow-md cursor-pointer transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
