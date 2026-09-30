import React from 'react';
import { 
  BookOpen, 
  Award, 
  CheckCircle, 
  Sparkles, 
  Gem, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { soundManager } from '../../../utils/audio';

interface Props {
  onCompleteMission: () => void;
  onOpenEvidence: () => void;
  onOpenKnowledge: () => void;
}

export const BeadExplanationView: React.FC<Props> = ({
  onCompleteMission,
  onOpenEvidence,
  onOpenKnowledge,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Celebration Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/70 via-[#26170d] to-[#141b27] border-2 border-amber-400/50 shadow-2xl text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-amber-900 border border-amber-400/60 flex items-center justify-center text-amber-300 mx-auto mb-2 shadow-lg shadow-amber-950/50">
          <Gem className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block font-bold">
          MISSION #2 RECONSTRUCTION COMPLETE
        </span>
        <h2 className="font-archaeological font-black text-2xl sm:text-3xl text-white">
          THE ARTISAN'S REVELATION
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/90 max-w-xl mx-auto leading-relaxed">
          You decoded how Bronze Age artisans drilled through ultra-hard gemstones without iron or steel.
        </p>
      </div>

      {/* Structured Archaeological Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Finding 1: Ernestite Micro-Drill Bits */}
        <div className="stone-panel p-5 rounded-2xl border border-amber-500/30 space-y-2">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold block">
            1. THE ERNESTITE BREAKTHROUGH
          </span>
          <h4 className="font-archaeological font-bold text-base text-[#f5ebd9]">
            Overcoming the Hardness Barrier
          </h4>
          <p className="text-xs text-[#cfc2af] leading-relaxed">
            Carnelian is crystalline quartz with a Mohs hardness of nearly 7. Bronze and copper tools (Mohs 3–3.5) cannot drill it. Harappan craftspeople solved this by quarrying a rare metamorphic stone rich in fine-grained silica, dubbed "Ernestite" by archaeologists, providing the required hardness and fracture-toughness.
          </p>
        </div>

        {/* Finding 2: Maritime Trade & International Luxury */}
        <div className="stone-panel p-5 rounded-2xl border border-amber-500/30 space-y-2">
          <span className="text-[10px] font-mono text-[#e6a86c] uppercase tracking-wider font-bold block">
            2. GLOBAL EXPORT COMMERCE
          </span>
          <h4 className="font-archaeological font-bold text-base text-[#f5ebd9]">
            From Kutch to Mesopotamia
          </h4>
          <p className="text-xs text-[#cfc2af] leading-relaxed">
            These long barrel-cylinder beads were so prized that they were traded across the Arabian Sea to Mesopotamian kings. Excavations in the Royal Cemetery of Ur and Kish revealed Harappan-made carnelian beads, proving ancient maritime trade networks connecting the Indus and Sumer.
          </p>
        </div>

      </div>

      {/* Distinction Callout */}
      <div className="p-4 rounded-xl bg-[#0f1420] border border-white/10 text-xs space-y-2 text-[#a0907d]">
        <div className="flex items-center gap-2 text-stone-200 font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Archaeological Epistemology Note:</span>
        </div>
        <p className="leading-relaxed">
          <strong>Documented Archaeological Fact:</strong> Micro-drills of constricted neck design made of metamorphic rocks were excavated in huge numbers at Dholavira, Chanhudaro, and Lothal alongside unfinished bead blanks and bow-drill socket capstones.
        </p>
        <p className="leading-relaxed">
          <strong>Game Reconstruction:</strong> In this interactive prototype, the bow-drill RPM and depth interaction is a simplified educational representation of the real physical operation, which took up to 30 hours of continuous drilling per bead.
        </p>
      </div>

      {/* Peer-Reviewed Source Card */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider block">
              PRIMARY RESEARCH FOUNDATION
            </span>
            <span className="text-[#f1ece1] font-serif italic">
              "An Overview of the Stone Bead Drilling Technology in South Asia from Earliest Times to Harappans"
            </span>
            <span className="text-[#a0907d] block text-[11px]">
              Prabhakar, V.N. (2016), Heritage: Journal of Multidisciplinary Studies in Archaeology / Kenoyer, J.M. (2003).
            </span>
          </div>
        </div>

        <button
          onClick={() => { soundManager.playClick(); onOpenEvidence(); }}
          className="px-3.5 py-1.5 rounded-lg bg-[#141d2a] hover:bg-[#1f2b3e] border border-white/10 text-amber-200 font-mono text-[11px] shrink-0 cursor-pointer"
        >
          View Evidence Board →
        </button>
      </div>

      {/* Unlocked Reward Box */}
      <div className="p-5 rounded-2xl bg-[#141b27] border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold">
              KNOWLEDGE ARCHIVE UNLOCKED: CARD #02
            </span>
            <h4 className="font-archaeological font-bold text-base text-[#ffd9a8]">
              "Harappan Stone Bead Drilling & Pyrotechnology"
            </h4>
            <p className="text-xs text-[#a0907d]">
              Permanent entry added with full experimental lapidary citations.
            </p>
          </div>
        </div>

        <button
          onClick={() => { soundManager.playClick(); onOpenKnowledge(); }}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-mono text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          READ ARCHIVE CARD
        </button>
      </div>

      {/* Return Button */}
      <div className="pt-2 text-center">
        <button
          onClick={() => { soundManager.playClick(); onCompleteMission(); }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-archaeological font-bold text-sm tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-amber-950/60 cursor-pointer transition-all active:scale-95"
        >
          <span>COMPLETE EXPEDITION & RETURN TO MAP</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
