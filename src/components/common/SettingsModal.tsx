import React from 'react';
import { GameSettings, Difficulty } from '../../types/game';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Sliders, 
  ShieldCheck, 
  Type, 
  Trash2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  settings: GameSettings;
  onClose: () => void;
  onDifficultyChange: (diff: Difficulty) => void;
  onToggleSound: () => void;
  onTextSizeChange: (size: 'normal' | 'large') => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  settings,
  onClose,
  onDifficultyChange,
  onToggleSound,
  onTextSizeChange,
  onResetProgress,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="stone-panel corner-bracket w-full max-w-md rounded-2xl p-6 border border-[#c59b4c]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-5 text-[#eae1d2]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#c59b4c]/20">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#c59b4c]" />
            <h3 className="font-archaeological font-bold text-lg text-[#f7efe4] tracking-wide">
              EXPEDITION SETTINGS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="hud-btn-glass p-1.5 rounded-lg text-[#9b9183] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Setting */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-[#e6b86a] block">
            Investigation Difficulty:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['explorer', 'investigator', 'strategist'] as Difficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={`py-2 px-2 rounded-xl text-xs font-medium capitalize border transition-all text-center cursor-pointer ${
                  settings.difficulty === diff
                    ? 'bg-[#7a5420] border-[#e6b86a]/50 text-[#f7efe4] font-bold shadow-md'
                    : 'hud-btn-glass text-[#cfc4b3]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#9b9183] italic font-mono">
            {settings.difficulty === 'explorer' && 'Explorer: In-depth visual clues and progressive hints enabled.'}
            {settings.difficulty === 'investigator' && 'Investigator: Balanced archaeological inquiry and deduction.'}
            {settings.difficulty === 'strategist' && 'Strategist: Minimal hints, strict source-based sequence requirements.'}
          </p>
        </div>

        {/* Audio Setting */}
        <div className="space-y-2 pt-2 border-t border-[#c59b4c]/15">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-[#eae1d2] flex items-center gap-2 font-medium">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-[#e6b86a]" /> : <VolumeX className="w-4 h-4 text-[#7d7467]" />}
                Atmospheric Soundscape & Period Music
              </span>
              <span className="text-[10px] text-[#9b9183] block mt-0.5">
                Ruins wind howling, distant desert birds, and reactive flute, bells & strings.
              </span>
            </div>
            <button
              onClick={onToggleSound}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.soundEnabled ? 'bg-[#7a5420] border border-[#e6b86a]/40' : 'bg-black/60 border border-white/10'
              }`}
            >
              <div
                className={`bg-[#e6b86a] w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Typography Size */}
        <div className="space-y-2 pt-2 border-t border-[#c59b4c]/15">
          <label className="text-xs font-mono uppercase text-[#e6b86a] block">
            Readability & Font Scale:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onTextSizeChange('normal')}
              className={`py-2 px-3 rounded-xl text-xs border cursor-pointer ${
                settings.textSize === 'normal'
                  ? 'bg-[#c97a3e]/30 border-[#c97a3e] text-white font-semibold'
                  : 'bg-[#141c29] border-white/10 text-[#a0907d]'
              }`}
            >
              Standard Size
            </button>
            <button
              onClick={() => onTextSizeChange('large')}
              className={`py-2 px-3 rounded-xl text-xs border cursor-pointer ${
                settings.textSize === 'large'
                  ? 'bg-[#c97a3e]/30 border-[#c97a3e] text-white font-semibold'
                  : 'bg-[#141c29] border-white/10 text-[#a0907d]'
              }`}
            >
              Large / Accessible
            </button>
          </div>
        </div>

        {/* Reset Game Progress */}
        <div className="pt-3 border-t border-white/5">
          <button
            onClick={() => {
              if (window.confirm('Reset all discovered clues and reconstructed systems? This will clear your LocalStorage.')) {
                onResetProgress();
                onClose();
              }
            }}
            className="w-full py-2 px-3 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/20 text-red-300 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Reset Local Progress</span>
          </button>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#c97a3e] hover:bg-[#b56b32] text-white text-xs font-bold transition-colors cursor-pointer"
        >
          CONFIRM SETTINGS
        </button>

      </div>
    </div>
  );
};
