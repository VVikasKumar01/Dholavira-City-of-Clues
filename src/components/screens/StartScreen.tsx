import React, { useEffect, useState } from 'react';
import { 
  Compass, 
  Play, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  BarChart2, 
  RotateCcw,
  Shield,
  Layers
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  hasSaveGame: boolean;
  onStartNew: () => void;
  onContinue: () => void;
  onOpenKnowledge: () => void;
  onOpenHowToPlay: () => void;
  onOpenEvaluation: () => void;
}

export const StartScreen: React.FC<Props> = ({
  hasSaveGame,
  onStartNew,
  onContinue,
  onOpenKnowledge,
  onOpenHowToPlay,
  onOpenEvaluation,
}) => {
  // Particles for subtle ambient dust
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; size: number; duration: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#05080e] via-[#0b101b] to-[#04060a] text-[#f1ece1] select-none">
      
      {/* Background Stylized Archaeological Art (SVG based - 100% self-contained & high-res) */}
      <div className="absolute inset-0 pointer-events-none opacity-50 overflow-hidden">
        {/* Twilight sky dusk glow behind ancient ruins */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-amber-600/15 via-orange-800/10 to-transparent blur-3xl rounded-full" />
        
        {/* Distant Rann of Kutch Salt White Flat Horizon in deep twilight */}
        <div className="absolute bottom-40 inset-x-0 h-44 bg-gradient-to-t from-[#c8b79f]/5 to-transparent border-b border-[#e2d5c3]/10" />

        {/* Silhouetted Harappan Citadel Walls & Massive Reservoirs */}
        <svg
          className="absolute bottom-0 inset-x-0 w-full h-[52vh] object-cover opacity-75 text-[#c97a3e]"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Distant Citadel bastions */}
          <path
            d="M0 600 L0 380 L180 380 L180 340 L340 340 L340 400 L560 400 L560 320 L760 320 L760 420 L980 420 L980 350 L1180 350 L1180 390 L1440 390 L1440 600 Z"
            fill="#090d15"
          />
          {/* Stepped Reservoir Ramparts */}
          <path
            d="M80 600 L80 460 L240 460 L280 490 L440 490 L480 520 L680 520 L740 470 L960 470 L1020 530 L1360 530 L1360 600 Z"
            fill="#0d1420"
          />
          {/* Foreground stone slabs and stairs */}
          <path
            d="M200 600 L200 520 L260 520 L260 540 L320 540 L320 560 L380 560 L380 580 L440 580 L440 600 Z"
            fill="#141d2c"
          />
          <path
            d="M920 600 L920 530 L980 530 L980 550 L1040 550 L1040 570 L1100 570 L1100 600 Z"
            fill="#141d2c"
          />
        </svg>

        {/* Ambient dust particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#f4ba82] animate-pulse"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0.35,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Top Banner: Smart India Hackathon Badge */}
      <div className="relative z-10 px-4 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#141b27]/80 border border-[#c97a3e]/30 text-xs text-[#d8cbba] backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#e6a86c] animate-ping" />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#f5ebd9]">
            SMART INDIA HACKATHON 2026 PROTOTYPE
          </span>
          <span className="text-stone-500">•</span>
          <span className="text-[11px] text-[#a0907d]">Problem: Digital Mystery Game Based on Dholavira</span>
        </div>

        <button
          onClick={onOpenEvaluation}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-xs text-purple-200 transition-colors cursor-pointer"
        >
          <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-mono text-[11px] font-medium">Evaluation & Analytics (Jury Panel)</span>
        </button>
      </div>

      {/* Center Cinematic Title */}
      <div className="relative z-10 px-4 py-8 sm:py-12 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
        
        {/* Emblem */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-[#c97a3e] via-[#9e521e] to-[#4a2408] p-1 shadow-2xl shadow-orange-950/60 animate-pulse-slow">
          <div className="w-full h-full bg-[#111722] rounded-[14px] flex items-center justify-center border border-[#ffd9a8]/30">
            <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-[#f4ba82]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-archaeological font-black text-4xl sm:text-6xl md:text-7xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#fff2de] via-[#ffd9a8] to-[#c97a3e] drop-shadow-md">
          DHOLAVIRA
        </h1>

        <div className="flex items-center gap-3 my-2 sm:my-3">
          <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#c97a3e]" />
          <h2 className="font-archaeological font-bold text-lg sm:text-2xl tracking-[0.25em] text-[#e6a86c]">
            CITY OF CLUES
          </h2>
          <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#c97a3e]" />
        </div>

        {/* Tagline */}
        <p className="font-mono text-xs sm:text-sm tracking-widest text-[#a89885] uppercase mb-4">
          Explore • Decode • Rebuild
        </p>

        {/* 3D Simulation Highlight Badge */}
        <div className="flex items-center gap-2 mb-6 text-xs text-[#e6a86c] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>REAL-TIME 3D HARAPPAN ARCHAEOLOGICAL SETTLEMENT</span>
          <span aria-hidden="true">·</span>
          <span>THIRD-PERSON & ISOMETRIC</span>
        </div>

        {/* Novelty Principle Pill */}
        <div className="max-w-xl mx-auto mb-8 px-4 py-3 rounded-xl bg-[#0f1521]/80 border border-[#c97a3e]/20 text-xs text-[#cfc2af] leading-relaxed flex items-center gap-3">
          <img
            src="/src/assets/images/dholavira_archaeologist_avatar_1790659225118.jpg"
            alt="Field Archaeologist"
            className="w-12 h-12 rounded-xl object-cover border border-[#c97a3e]/40 shadow-md shrink-0"
          />
          <div className="text-left">
            <span className="text-[#ffd9a8] font-semibold block">Realistic Archaeological Exploration: </span>
            <span>Investigate massive stone fortification walls, rock-cut stepwells, and water channels. Uncover physical clues to reconstruct ancient civil engineering systems.</span>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md">
          
          <button
            onClick={onStartNew}
            className="w-full sm:w-auto flex-1 py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#c97a3e] via-[#db8748] to-[#a85b24] hover:from-[#e59454] hover:to-[#b8672e] text-white font-archaeological font-bold text-base tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-orange-950/60 cursor-pointer transition-all active:scale-95 group border-2 border-[#ffd9a8]/50 animate-pulse-slow"
          >
            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>START GAME</span>
          </button>

          {hasSaveGame && (
            <button
              onClick={onContinue}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-[#182333] hover:bg-[#233147] text-[#ffd9a8] font-archaeological font-bold text-sm tracking-wider flex items-center justify-center gap-2 border border-[#c97a3e]/40 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-[#e6a86c]" />
              <span>CONTINUE EXPEDITION</span>
            </button>
          )}

        </div>

        {/* Secondary Navigation Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4">
          <button
            onClick={onOpenKnowledge}
            className="px-4 py-2 rounded-lg bg-[#111722]/80 hover:bg-[#1a2332] border border-white/10 hover:border-sky-500/40 text-xs text-[#cfc2af] hover:text-white font-medium flex items-center gap-2 cursor-pointer transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>KNOWLEDGE ARCHIVE</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="px-4 py-2 rounded-lg bg-[#111722]/80 hover:bg-[#1a2332] border border-white/10 hover:border-amber-500/40 text-xs text-[#cfc2af] hover:text-white font-medium flex items-center gap-2 cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#e6a86c]" />
            <span>HOW TO PLAY</span>
          </button>
        </div>

      </div>

      {/* Bottom Academic Citation Strip */}
      <div className="relative z-10 px-4 py-4 border-t border-[#c97a3e]/15 bg-[#090d14]/90 backdrop-blur-sm text-center">
        <p className="text-[11px] text-[#7d6f5f] max-w-4xl mx-auto leading-relaxed">
          Grounding Research: Singh et al. (2020) <span className="italic">Hydrology & Water Management in Ancient India</span> • Prabhakar (2016) <span className="italic">Stone Bead Drilling Technology</span> • Archaeological Survey of India (Bisht 2015).
        </p>
      </div>

    </div>
  );
};
