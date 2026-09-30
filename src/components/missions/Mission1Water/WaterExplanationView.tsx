import React from 'react';
import { 
  BookOpen, 
  Award, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { soundManager } from '../../../utils/audio';

interface Props {
  onCompleteMission: () => void;
  onOpenEvidence: () => void;
  onOpenKnowledge: () => void;
}

export const WaterExplanationView: React.FC<Props> = ({
  onCompleteMission,
  onOpenEvidence,
  onOpenKnowledge,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Celebration Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#10242b] to-[#121c29] border-2 border-emerald-400/50 shadow-2xl text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-900 border border-emerald-400/60 flex items-center justify-center text-emerald-300 mx-auto mb-2 shadow-lg shadow-emerald-950/50">
          <Award className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">
          MISSION #1 RECONSTRUCTION COMPLETE
        </span>
        <h2 className="font-archaeological font-black text-2xl sm:text-3xl text-white">
          WHAT DID YOU DISCOVER?
        </h2>
        <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl mx-auto leading-relaxed">
          You have successfully deduced and reassembled the hydraulic lifeline of Dholavira.
        </p>
      </div>

      {/* Structured Historical Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Finding 1: Arid Climate & Monsoon Harvesting */}
        <div className="stone-panel p-5 rounded-2xl border border-[#c97a3e]/30 space-y-2">
          <span className="text-[10px] font-mono text-[#e6a86c] uppercase tracking-wider font-bold block">
            1. CLIMATIC RESILIENCE & CHECK-DAMS
          </span>
          <h4 className="font-archaeological font-bold text-base text-[#f5ebd9]">
            Taming Flash Floods in an Arid Salt Desert
          </h4>
          <p className="text-xs text-[#cfc2af] leading-relaxed">
            Dholavira on Khadir Bet receives less than 300 mm of annual rainfall, arriving in brief, intense cloudbursts. Rather than relying on non-existent perennial rivers, Harappan engineers built massive stone bunds across the seasonal Manhar and Mansar nullahs to impound storm runoff before it evaporated into the Rann.
          </p>
        </div>

        {/* Finding 2: Desilting & Cascade Storage */}
        <div className="stone-panel p-5 rounded-2xl border border-[#c97a3e]/30 space-y-2">
          <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-bold block">
            2. SEDIMENT FILTRATION & CASCADES
          </span>
          <h4 className="font-archaeological font-bold text-base text-[#f5ebd9]">
            The Genius of Settling Chambers
          </h4>
          <p className="text-xs text-[#cfc2af] leading-relaxed">
            Turbulent runoff carried heavy sand and silt that would quickly choke deep tanks. The Harappans interposed desilting settling basins along the feeder channels to reduce water velocity. Dense gravel settled first, allowing clear, clean water to spill into the primary rock-cut reservoirs.
          </p>
        </div>

      </div>

      {/* Distinction Callout: Documented Fact vs Game Reconstruction */}
      <div className="p-4 rounded-xl bg-[#0f1420] border border-white/10 text-xs space-y-2 text-[#a0907d]">
        <div className="flex items-center gap-2 text-stone-200 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Archaeological Epistemology Note:</span>
        </div>
        <p className="leading-relaxed">
          <strong>Documented Archaeological Fact:</strong> Archaeological excavations by the ASI (Bisht 1999, 2015) proved the existence of 16 interconnected reservoirs, massive stone check-dams, desilting chambers, stone-cut steps, and covered drains holding ~250,000 m³ of water.
        </p>
        <p className="leading-relaxed">
          <strong>Game Reconstruction:</strong> In this educational prototype, the 6-stage linear pipeline is an abstracted functional reconstruction designed to teach cause-and-effect hydraulic logic rather than an exact topographical CAD reproduction.
        </p>
      </div>

      {/* Sourced Reference Citation Card */}
      <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <span className="font-mono text-[10px] text-sky-400 uppercase tracking-wider block">
              PRIMARY RESEARCH FOUNDATION
            </span>
            <span className="text-[#f1ece1] font-serif italic">
              "Hydrology and water resources management in ancient India"
            </span>
            <span className="text-[#a0907d] block text-[11px]">
              Singh, V.P., Yaduvanshi, B.K., et al. (2020), Journal of Hydrology / Bisht, R.S. (2015), Archaeological Survey of India.
            </span>
          </div>
        </div>

        <button
          onClick={() => { soundManager.playClick(); onOpenEvidence(); }}
          className="px-3.5 py-1.5 rounded-lg bg-[#141d2a] hover:bg-[#1f2b3e] border border-white/10 text-[#ffd9a8] font-mono text-[11px] shrink-0 cursor-pointer"
        >
          View Evidence Board →
        </button>
      </div>

      {/* Unlocked Reward Box */}
      <div className="p-5 rounded-2xl bg-[#141b27] border border-[#c97a3e]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-sky-950 border border-sky-500/50 flex items-center justify-center text-sky-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-sky-400 uppercase block font-bold">
              KNOWLEDGE ARCHIVE UNLOCKED: CARD #01
            </span>
            <h4 className="font-archaeological font-bold text-base text-[#ffd9a8]">
              "Ancient Water Engineering & Hydraulic Network"
            </h4>
            <p className="text-xs text-[#a0907d]">
              Permanent entry added with full stratigraphy and academic bibliography.
            </p>
          </div>
        </div>

        <button
          onClick={() => { soundManager.playClick(); onOpenKnowledge(); }}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          READ ARCHIVE CARD
        </button>
      </div>

      {/* Final Action Button: Complete & Proceed */}
      <div className="pt-2 text-center">
        <button
          onClick={() => { soundManager.playClick(); onCompleteMission(); }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#c97a3e] to-[#a85b24] hover:from-[#d9894d] hover:to-[#b8672e] text-white font-archaeological font-bold text-sm tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-orange-950/60 cursor-pointer transition-all active:scale-95"
        >
          <span>RETURN TO CITY MAP (UNLOCK MISSION #2)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
