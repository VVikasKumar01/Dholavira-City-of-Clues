import React, { useState, useEffect } from 'react';
import { 
  Gem, 
  Wrench, 
  Flame, 
  RotateCw, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { soundManager } from '../../../utils/audio';

interface Props {
  onSuccess: () => void;
  onRecordAttempt: () => void;
  onRequestHint: () => void;
  currentHintLevel: number;
  hints: [string, string, string];
}

export const BeadDrillingPuzzle: React.FC<Props> = ({
  onSuccess,
  onRecordAttempt,
  onRequestHint,
  currentHintLevel,
  hints,
}) => {
  // Step 1: Raw Material Choice
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  // Step 2: Pyrotechnology Heating Method
  const [selectedHeating, setSelectedHeating] = useState<string | null>(null);
  // Step 3: Drill Bit Choice
  const [selectedDrill, setSelectedDrill] = useState<string | null>(null);

  // Drilling simulation state
  const [drillingProgress, setDrillingProgress] = useState<number>(0);
  const [isDrilling, setIsDrilling] = useState<boolean>(false);
  const [failureMsg, setFailureMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Handle drilling progress loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDrilling && drillingProgress < 100) {
      interval = setInterval(() => {
        setDrillingProgress(prev => {
          const next = prev + 12;
          if (next >= 100) {
            clearInterval(interval);
            setIsDrilling(false);
            setIsCompleted(true);
            soundManager.playSuccess();
            return 100;
          }
          return next;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isDrilling, drillingProgress]);

  const handleStartDrill = () => {
    onRecordAttempt();
    setFailureMsg(null);

    // Validate material
    if (selectedMaterial !== 'carnelian') {
      soundManager.playFailure();
      setFailureMsg('Material Mismatch: You selected an incorrect mineral! Harappan export long-barrel beads required high-iron chalcedony/carnelian.');
      return;
    }

    // Validate heating
    if (selectedHeating !== 'kiln_pot') {
      soundManager.playFailure();
      setFailureMsg('Thermal Shock Failure: Heating raw chalcedony over open direct flame causes internal fractures and stone shattering! It must be packed inside sealed ceramic canisters in a slow kiln hearth.');
      return;
    }

    // Validate drill bit
    if (selectedDrill !== 'ernestite') {
      soundManager.playFailure();
      setFailureMsg('Tool Inappropriate: The selected tool is not suitable for this reconstruction. Bronze and copper alloys (Mohs 3–3.5) immediately deform and blunt against quartz carnelian (Mohs 7). You must use the ultra-hard "Ernestite" metamorphic micro-drill.');
      return;
    }

    // Begin drilling simulation
    soundManager.playDrillingSound(3);
    setIsDrilling(true);
  };

  const handleReset = () => {
    soundManager.playClick();
    setSelectedMaterial(null);
    setSelectedHeating(null);
    setSelectedDrill(null);
    setDrillingProgress(0);
    setIsDrilling(false);
    setFailureMsg(null);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl stone-panel border border-amber-500/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" />
              STEP 2: LAPIDARY RECONSTRUCTION
            </span>
            <span className="text-xs text-[#a0907d]">High-Precision Bronze Age Pyrotechnology</span>
          </div>
          <h3 className="font-archaeological font-bold text-base sm:text-lg text-[#f5ebd9] mt-1">
            Reconstruct the Harappan Bead Perforation Technique
          </h3>
          <p className="text-xs text-[#cfc2af]">
            Select the correct mineral blank, thermal oxidation hearth method, and constricted micro-drill bit, then execute the rotational bow-drilling process.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 rounded-xl bg-[#181d28] hover:bg-[#222a3a] border border-white/10 text-stone-300 text-xs font-mono cursor-pointer shrink-0"
        >
          RESET TOOL RIG
        </button>
      </div>

      {/* Decision Matrices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Stage 1: Mineral Selection */}
        <div className="p-4 rounded-2xl stone-panel border border-white/10 space-y-3">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
            1. SELECT GEMSTONE MINERAL BLANK
          </span>
          <div className="space-y-2">
            <button
              onClick={() => { soundManager.playClick(); setSelectedMaterial('carnelian'); }}
              className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                selectedMaterial === 'carnelian'
                  ? 'bg-amber-950/80 border-amber-400 text-white font-medium shadow-md'
                  : 'bg-[#121622] border-white/5 text-[#ded4c5] hover:bg-[#1a2133]'
              }`}
            >
              <div className="font-semibold text-amber-300">Raw Chalcedony / Carnelian</div>
              <span className="text-[10px] text-stone-400">Microcrystalline quartz, Mohs 7 hardness</span>
            </button>

            <button
              onClick={() => { soundManager.playClick(); setSelectedMaterial('steatite'); }}
              className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                selectedMaterial === 'steatite'
                  ? 'bg-amber-950/80 border-amber-400 text-white font-medium shadow-md'
                  : 'bg-[#121622] border-white/5 text-[#ded4c5] hover:bg-[#1a2133]'
              }`}
            >
              <div className="font-semibold text-stone-300">Soft Talc / Steatite</div>
              <span className="text-[10px] text-stone-400">Soapstone, Mohs 1 (Used for seals, not red beads)</span>
            </button>

            <button
              onClick={() => { soundManager.playClick(); setSelectedMaterial('sandstone'); }}
              className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                selectedMaterial === 'sandstone'
                  ? 'bg-amber-950/80 border-amber-400 text-white font-medium shadow-md'
                  : 'bg-[#121622] border-white/5 text-[#ded4c5] hover:bg-[#1a2133]'
              }`}
            >
              <div className="font-semibold text-stone-300">Granular Sandstone</div>
              <span className="text-[10px] text-stone-400">Coarse sediment, fractures easily</span>
            </button>
          </div>
        </div>

        {/* Stage 2: Thermal Oxidation Method */}
        <div className="p-4 rounded-2xl stone-panel border border-white/10 space-y-3">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
            2. THERMAL HEAT TREATMENT
          </span>
          <div className="space-y-2">
            <button
              onClick={() => { soundManager.playClick(); setSelectedHeating('kiln_pot'); }}
              className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                selectedHeating === 'kiln_pot'
                  ? 'bg-amber-950/80 border-amber-400 text-white font-medium shadow-md'
                  : 'bg-[#121622] border-white/5 text-[#ded4c5] hover:bg-[#1a2133]'
              }`}
            >
              <div className="font-semibold text-amber-300">Sealed Clay Canister in Kiln</div>
              <span className="text-[10px] text-stone-400">Slow oxidation turns iron trace minerals fiery red</span>
            </button>

            <button
              onClick={() => { soundManager.playClick(); setSelectedHeating('direct_fire'); }}
              className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                selectedHeating === 'direct_fire'
                  ? 'bg-amber-950/80 border-amber-400 text-white font-medium shadow-md'
                  : 'bg-[#121622] border-white/5 text-[#ded4c5] hover:bg-[#1a2133]'
              }`}
            >
              <div className="font-semibold text-stone-300">Direct Flame Exposure</div>
              <span className="text-[10px] text-stone-400">Exposes stone to thermal shock and fracturing</span>
            </button>

            <button
              onClick={() => { soundManager.playClick(); setSelectedHeating('no_heat'); }}
              className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                selectedHeating === 'no_heat'
                  ? 'bg-amber-950/80 border-amber-400 text-white font-medium shadow-md'
                  : 'bg-[#121622] border-white/5 text-[#ded4c5] hover:bg-[#1a2133]'
              }`}
            >
              <div className="font-semibold text-stone-300">No Thermal Treatment</div>
              <span className="text-[10px] text-stone-400">Stones remain dull yellowish-brown</span>
            </button>
          </div>
        </div>

        {/* Stage 3: Drill Tool Selection */}
        <div className="p-4 rounded-2xl stone-panel border border-white/10 space-y-3">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
            3. SELECT MICRO-DRILL BIT
          </span>
          <div className="space-y-2">
            <button
              onClick={() => { soundManager.playClick(); setSelectedDrill('ernestite'); }}
              className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                selectedDrill === 'ernestite'
                  ? 'bg-amber-950/80 border-amber-400 text-white font-medium shadow-md'
                  : 'bg-[#121622] border-white/5 text-[#ded4c5] hover:bg-[#1a2133]'
              }`}
            >
              <div className="font-semibold text-amber-300">"Ernestite" Metamorphic Bit</div>
              <span className="text-[10px] text-stone-400">Hardness ~7.5, constricted neck, specialized rock</span>
            </button>

            <button
              onClick={() => { soundManager.playClick(); setSelectedDrill('bronze'); }}
              className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                selectedDrill === 'bronze'
                  ? 'bg-amber-950/80 border-amber-400 text-white font-medium shadow-md'
                  : 'bg-[#121622] border-white/5 text-[#ded4c5] hover:bg-[#1a2133]'
              }`}
            >
              <div className="font-semibold text-stone-300">Cast Bronze/Copper Chisel</div>
              <span className="text-[10px] text-stone-400">Hardness ~3, warps against quartz</span>
            </button>

            <button
              onClick={() => { soundManager.playClick(); setSelectedDrill('flint'); }}
              className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                selectedDrill === 'flint'
                  ? 'bg-amber-950/80 border-amber-400 text-white font-medium shadow-md'
                  : 'bg-[#121622] border-white/5 text-[#ded4c5] hover:bg-[#1a2133]'
              }`}
            >
              <div className="font-semibold text-stone-300">Brittle Flint Flake</div>
              <span className="text-[10px] text-stone-400">Chips and shatters at high RPM bow speed</span>
            </button>
          </div>
        </div>

      </div>

      {/* Failure Message Alert */}
      {failureMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border-2 border-red-500/40 text-xs text-red-200 flex items-start gap-3 animate-in shake duration-300">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-archaeological font-bold text-sm text-red-300 block">
              EXPERIMENT FAILED
            </span>
            <p className="leading-relaxed">{failureMsg}</p>
          </div>
        </div>
      )}

      {/* Drilling Simulation Interaction Area */}
      <div className="p-6 rounded-2xl stone-panel border-2 border-amber-500/30 bg-[#0d1017] space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono uppercase text-amber-400 font-bold block">
              BICONICAL BOW-DRILL INTERACTION
            </span>
            <p className="text-xs text-[#a0907d]">
              Steatite capstone provides downward pressure while the bowstring spins the Ernestite bit at ~1,500 RPM with water lubrication.
            </p>
          </div>

          <button
            disabled={!selectedMaterial || !selectedHeating || !selectedDrill || isDrilling || isCompleted}
            onClick={handleStartDrill}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 disabled:opacity-40 disabled:pointer-events-none text-white font-archaeological font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-orange-950/60 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <RotateCw className={`w-4 h-4 ${isDrilling ? 'animate-spin' : ''}`} />
            <span>{isDrilling ? 'MICRO-DRILLING IN PROGRESS...' : isCompleted ? 'PERFORATION COMPLETE' : 'BEGIN ROTATIONAL DRILLING'}</span>
          </button>
        </div>

        {/* Progress Bar & Bead Visual */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-stone-400">Drilling Depth & Perforation Alignment:</span>
            <span className="text-amber-400 font-bold">{drillingProgress}%</span>
          </div>

          <div className="h-4 bg-stone-900 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-300 rounded-full transition-all duration-300"
              style={{ width: `${drillingProgress}%` }}
            />
          </div>
        </div>

        {/* Visual Graphic of Bead & Drill Meeting */}
        <div className="py-4 flex items-center justify-center">
          <div className="relative w-64 h-16 rounded-2xl bg-gradient-to-r from-orange-700 via-amber-600 to-orange-800 border-2 border-[#ffd9a8]/40 flex items-center justify-center shadow-lg shadow-orange-950/40">
            {/* Center drill hole progression */}
            <div
              className="h-3 bg-stone-950 rounded-full border border-white/20 transition-all duration-300"
              style={{ width: `${drillingProgress * 0.9}%` }}
            />
            <span className="absolute text-[10px] font-mono text-[#ffd9a8] font-bold pointer-events-none drop-shadow">
              {drillingProgress < 50 ? 'Side A: Initial Conical Pecking' : drillingProgress < 100 ? 'Side B: Biconical Junction Meeting' : '✓ Perfect Biconical Center Meet'}
            </span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {isCompleted && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/90 via-orange-950/80 to-[#1e1710] border-2 border-amber-400 text-xs shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-900/80 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold block">
                  LAPIDARY MASTERPIECE ACHIEVED
                </span>
                <h4 className="font-archaeological font-bold text-lg text-white">
                  Long-Barrel Carnelian Bead Successfully Perforated!
                </h4>
                <p className="text-amber-200/90 text-xs mt-0.5 max-w-xl">
                  Using high-temperature thermal canisters and the constricted "Ernestite" metamorphic drill, you replicated one of the pinnacle achievements of Harappan metallurgical and lapidary technology.
                </p>
              </div>
            </div>

            <button
              onClick={() => { soundManager.playClick(); onSuccess(); }}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-archaeological font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-950/80 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <span>VIEW HISTORICAL EXPLANATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Progressive Hint */}
      <div className="p-3.5 rounded-xl bg-[#0f1521] border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-400">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>
            {currentHintLevel === 0 && 'Hint: Select Carnelian, Kiln Canister, and the Ernestite bit.'}
            {currentHintLevel === 1 && hints[0]}
            {currentHintLevel === 2 && hints[1]}
            {currentHintLevel === 3 && hints[2]}
          </span>
        </div>

        {currentHintLevel < 3 && (
          <button
            onClick={onRequestHint}
            className="px-3 py-1 rounded-lg bg-[#1a2332] hover:bg-[#253247] border border-amber-500/30 text-amber-200 font-mono text-[11px] cursor-pointer shrink-0"
          >
            REQUEST HINT (LEVEL {currentHintLevel + 1}/3)
          </button>
        )}
      </div>

    </div>
  );
};
