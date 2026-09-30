import React, { useState } from 'react';
import { DialogueNode } from '../../types/game';
import { ChevronRight, FastForward, Sparkles, User } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  dialogues: DialogueNode[];
  onComplete: () => void;
}

export const DialogueBox: React.FC<Props> = ({ dialogues, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!dialogues || dialogues.length === 0) return null;

  const currentDialogue = dialogues[currentIndex];

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    soundManager.playClick();
    onComplete();
  };

  const renderAvatarSvg = (type: 'archaeologist' | 'artisan' | 'assistant') => {
    switch (type) {
      case 'archaeologist':
        return (
          <svg className="w-8 h-8 text-[#f7d0a1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
            <path d="M4 8h16" />
            <path d="M12 2v2" />
          </svg>
        );
      case 'artisan':
        return (
          <svg className="w-8 h-8 text-[#fcd34d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        );
      case 'assistant':
        return (
          <svg className="w-8 h-8 text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" />
            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-6 sm:left-6 max-w-3xl sm:mx-auto z-45 animate-in slide-in-from-bottom-4 duration-300">
      <div className="stone-panel corner-bracket rounded-2xl p-4 sm:p-5 border border-[#c59b4c]/30 shadow-[0_16px_48px_rgba(0,0,0,0.9),0_0_20px_rgba(197,155,76,0.06)] relative overflow-hidden">
        
        {/* Subtle bronze corner ambient glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#c59b4c]/10 to-transparent pointer-events-none" />

        <div className="flex items-start gap-4">
          
          {/* Avatar Icon */}
          <div 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 border border-[#c59b4c]/30 bg-black/60 shadow-inner"
            style={{ backgroundColor: `${currentDialogue.speaker.avatarColor}15` }}
          >
            {renderAvatarSvg(currentDialogue.speaker.avatarSvgType)}
          </div>

          {/* Dialogue Body */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div>
                <span className="font-archaeological font-bold text-sm sm:text-base text-[#e6b86a] tracking-wide block">
                  {currentDialogue.speaker.name}
                </span>
                <span className="text-[11px] text-[#9b9183] block font-mono">
                  {currentDialogue.speaker.role}
                </span>
              </div>

              {/* Progress indicator */}
              <div className="text-[10px] font-mono text-[#cfc4b3] px-2 py-0.5 rounded bg-black/50 border border-[#c59b4c]/20">
                {currentIndex + 1} / {dialogues.length}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#eae1d2] leading-relaxed my-2 sm:my-3">
              "{currentDialogue.text}"
            </p>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-[#c59b4c]/15">
              <button
                onClick={handleSkip}
                className="text-[11px] text-[#9b9183] hover:text-[#eae1d2] flex items-center gap-1 font-mono cursor-pointer transition-colors"
              >
                <FastForward className="w-3 h-3" />
                SKIP
              </button>

              <button
                onClick={handleNext}
                className="hud-btn-bronze px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>{currentIndex < dialogues.length - 1 ? 'CONTINUE' : 'PROCEED'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
