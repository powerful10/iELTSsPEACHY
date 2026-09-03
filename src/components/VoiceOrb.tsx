import React from 'react';
import { motion } from 'motion/react';
import { Mic, Volume2, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { SpeakingState } from '../types';

interface VoiceOrbProps {
  state: SpeakingState;
  volumeLevel?: number; // 0.0 to 1.0
  size?: 'sm' | 'md' | 'lg';
  statusText?: string;
  onClick?: () => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  state,
  volumeLevel = 0,
  size = 'lg',
  statusText,
  onClick,
}) => {
  const dimensions = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
  }[size];

  const scale = 1 + (state === 'listening' ? volumeLevel * 0.45 : 0);

  // Dynamic colors and animation by state
  const stateConfig = {
    idle: {
      bg: 'from-[#1A1A1A] to-[#2A2A2A]',
      shadow: 'shadow-black/20',
      ring: 'border-[#D1CEC3]',
      icon: <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-[#A1824A]" />,
      label: 'Ready to speak',
    },
    'ai-speaking': {
      bg: 'from-[#A1824A] to-[#866A38]',
      shadow: 'shadow-[#A1824A]/30',
      ring: 'border-[#D1CEC3]',
      icon: <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />,
      label: 'Coach speaking...',
    },
    listening: {
      bg: 'from-[#866A38] via-[#A1824A] to-[#C4A76E]',
      shadow: 'shadow-[#A1824A]/40',
      ring: 'border-[#1C1C1C]',
      icon: <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />,
      label: 'Listening to your voice...',
    },
    processing: {
      bg: 'from-[#1A1A1A] to-[#2C2C2C]',
      shadow: 'shadow-black/30',
      ring: 'border-[#A1824A]/60',
      icon: <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#A1824A] animate-spin" />,
      label: 'Analyzing speaking against IELTS descriptors...',
    },
    feedback: {
      bg: 'from-[#1A1A1A] to-[#2A2A2A]',
      shadow: 'shadow-black/20',
      ring: 'border-[#A1824A]',
      icon: <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#A1824A]" />,
      label: 'Feedback ready',
    },
    lesson: {
      bg: 'from-[#866A38] to-[#A1824A]',
      shadow: 'shadow-[#A1824A]/30',
      ring: 'border-[#D1CEC3]',
      icon: <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />,
      label: 'Targeted micro-lesson',
    },
    retry: {
      bg: 'from-[#1A1A1A] to-[#2A2A2A]',
      shadow: 'shadow-black/20',
      ring: 'border-[#A1824A]',
      icon: <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-[#A1824A]" />,
      label: 'Ready for retry',
    },
    comparing: {
      bg: 'from-[#1A1A1A] to-[#2C2C2C]',
      shadow: 'shadow-black/30',
      ring: 'border-[#A1824A]/60',
      icon: <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#A1824A] animate-spin" />,
      label: 'Comparing attempts...',
    },
    complete: {
      bg: 'from-[#1A1A1A] to-[#2A2A2A]',
      shadow: 'shadow-black/20',
      ring: 'border-[#D1CEC3]',
      icon: <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#A1824A]" />,
      label: 'Practice completed',
    },
    error: {
      bg: 'from-[#7F1D1D] to-[#991B1B]',
      shadow: 'shadow-red-900/30',
      ring: 'border-[#D1CEC3]',
      icon: <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />,
      label: 'Check microphone',
    },
  }[state];

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center p-6">
        {/* Animated outer aura rings */}
        {state === 'listening' && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.45, 1],
                opacity: [0.35, 0.05, 0.35],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full bg-[#A1824A]/20 filter blur-lg"
            />
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.4, 0.15, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-2 rounded-full bg-[#D1CEC3]/40 filter blur-md"
            />
          </>
        )}

        {state === 'ai-speaking' && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-[#A1824A]/20 filter blur-lg"
          />
        )}

        {/* Primary Interactive Orb */}
        <motion.button
          type="button"
          onClick={onClick}
          disabled={state === 'processing' || state === 'comparing'}
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`relative ${dimensions} rounded-full bg-gradient-to-tr ${stateConfig.bg} shadow-2xl ${stateConfig.shadow} flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none border-2 ${stateConfig.ring}`}
          aria-label={statusText || stateConfig.label}
        >
          {/* Inner sheen */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

          {/* Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {stateConfig.icon}
          </div>
        </motion.button>
      </div>

      {/* State label */}
      <div className="mt-3 text-center">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#1C1C1C]/80">
          {statusText || stateConfig.label}
        </p>
      </div>
    </div>
  );
};
