import React from 'react';
import { 
  X, 
  HelpCircle, 
  Search, 
  Layers, 
  Puzzle, 
  Wrench, 
  BookOpen, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<Props> = ({ onClose }) => {
  const steps = [
    {
      title: '1. EXPLORE & INSPECT',
      desc: 'Investigate the ruins of Dholavira. Click shimmering archaeological features, soil layers, stone cuts, and workshop debits to reveal field clues.',
      icon: Search,
      color: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-500/30'
    },
    {
      title: '2. ASSEMBLE EVIDENCE',
      desc: 'Collected clues are stored in your Evidence Board with empirical excavation notes, material composition, and published academic sources.',
      icon: Layers,
      color: 'text-sky-400',
      bg: 'bg-sky-950/40 border-sky-500/30'
    },
    {
      title: '3. RECONSTRUCT THE SYSTEM',
      desc: 'Do not guess on multiple-choice tests! Physically organize and connect components in sequence (such as hydraulic channels or lapidary drill tools).',
      icon: Wrench,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-500/30'
    },
    {
      title: '4. TEST & SIMULATE',
      desc: 'Press "Test System". Watch the dynamic flow simulation. If the system fails, examine the physical bottleneck and re-adjust your hypothesis.',
      icon: Puzzle,
      color: 'text-purple-400',
      bg: 'bg-purple-950/40 border-purple-500/30'
    },
    {
      title: '5. UNLOCK KNOWLEDGE',
      desc: 'A successful reconstruction unlocks permanent Knowledge Cards and peer-reviewed citations in your Archive, transforming gameplay into lasting mastery.',
      icon: BookOpen,
      color: 'text-orange-400',
      bg: 'bg-orange-950/40 border-orange-500/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="stone-panel w-full max-w-3xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden border border-[#c97a3e]/30 shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#d4a373]/15 flex items-center justify-between bg-[#111722]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c97a3e]/20 border border-[#c97a3e]/40 flex items-center justify-center text-[#e6a86c]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-archaeological font-bold text-lg text-[#f4efe6]">
                HOW TO PLAY: LEARNING BY DOING
              </h3>
              <p className="text-xs text-[#a0907d]">
                The Serious-Game Methodology Behind "Dholavira: City of Clues"
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1a2332] hover:bg-[#28364c] border border-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-sandstone-pattern space-y-4">
          
          {/* Methodology Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#1c2637] to-[#121924] border border-[#c97a3e]/30 text-center">
            <span className="text-[11px] font-mono text-[#e6a86c] tracking-widest uppercase block mb-1">
              THE CORE GAMEPLAY CYCLE
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-archaeological font-bold text-[#ffd9a8]">
              <span>HISTORICAL FACT</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c97a3e]" />
              <span>EVIDENCE</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c97a3e]" />
              <span>SYSTEM PUZZLE</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c97a3e]" />
              <span>RECONSTRUCTION</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c97a3e]" />
              <span>EXPLANATION</span>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-[#121824]/90 border border-white/5 flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${step.bg} ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-archaeological font-bold text-sm text-[#f5ebd9]">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#cfc2af] leading-relaxed mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Distinction Callout */}
          <div className="p-3.5 rounded-xl bg-[#0f141f] border border-[#38bdf8]/20 flex items-center gap-3 text-xs text-[#a0907d]">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-stone-200 block">
                Evidence Honesty & Citation Standard:
              </span>
              The game clearly distinguishes documented archaeological facts from educational gameplay reconstructions. Every artifact and architectural feature is linked to peer-reviewed sources.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0f16] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#c97a3e] hover:bg-[#b56b32] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            LET'S BEGIN INVESTIGATION
          </button>
        </div>

      </div>
    </div>
  );
};
