import React, { useState } from 'react';
import { 
  Droplets, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowDown,
  Layers,
  Wrench,
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

interface ComponentNode {
  id: string;
  code: string;
  name: string;
  shortDesc: string;
  evidenceRef: string;
  category: string;
  iconBg: string;
}

const ALL_COMPONENTS: ComponentNode[] = [
  {
    id: 'c_source',
    code: 'SOURCE',
    name: 'Manhar Monsoon Stream',
    shortDesc: 'Seasonal storm torrent carrying flash flood runoff and silt',
    evidenceRef: 'Manhar Stream Runoff',
    category: 'Hydraulic Source',
    iconBg: 'from-blue-600 to-sky-700'
  },
  {
    id: 'c_bund',
    code: 'COLLECTION',
    name: 'Stone Masonry Bund (Check-Dam)',
    shortDesc: 'Massive limestone dam diverting flash floods into city feeder conduit',
    evidenceRef: 'Stream Bund (Singh et al., 2020)',
    category: 'Diversion',
    iconBg: 'from-amber-600 to-yellow-700'
  },
  {
    id: 'c_desilt',
    code: 'DESILTING',
    name: 'Inlet Siltation Chamber',
    shortDesc: 'Settling tank slowing velocity to precipitate heavy sand and gravel',
    evidenceRef: 'Excavated Silt Basin (Bisht, 2015)',
    category: 'Filtration',
    iconBg: 'from-stone-600 to-slate-700'
  },
  {
    id: 'c_channel',
    code: 'CHANNEL',
    name: 'Covered Cut-Stone Aqueduct',
    shortDesc: 'Interlocking masonry conduit maintaining gradient and preventing evaporation',
    evidenceRef: 'Masonry Channel (Singh et al., 2020)',
    category: 'Conveyance',
    iconBg: 'from-orange-700 to-amber-800'
  },
  {
    id: 'c_reservoir',
    code: 'RESERVOIR',
    name: 'Deep Rock-Cut Reservoir',
    shortDesc: 'Bedrock-hewn stepped tank (73.4m x 29.3m) for multi-year civic reserve',
    evidenceRef: 'Eastern Reservoir Complex',
    category: 'Storage',
    iconBg: 'from-sky-700 to-blue-900'
  },
  {
    id: 'c_sluice',
    code: 'DISTRIBUTION',
    name: 'Regulating Sluice & Stepwell Access',
    shortDesc: 'Movable wooden board gates and terraces for controlled civic drawing',
    evidenceRef: 'Sluice Gates (Jansen, 1993)',
    category: 'Distribution',
    iconBg: 'from-emerald-700 to-teal-800'
  }
];

// The correct functional sequence
const CORRECT_SEQUENCE = ['c_source', 'c_bund', 'c_desilt', 'c_channel', 'c_reservoir', 'c_sluice'];

export const WaterFlowPuzzle: React.FC<Props> = ({
  onSuccess,
  onRecordAttempt,
  onRequestHint,
  currentHintLevel,
  hints,
}) => {
  // Slots array initialized with null or components
  const [pipeline, setPipeline] = useState<Array<ComponentNode | null>>([
    ALL_COMPONENTS[0], // Pre-seat Source in slot 0 to give intuitive start
    null,
    null,
    null,
    null,
    null,
  ]);

  // Inventory of remaining selectable components
  const [inventory, setInventory] = useState<ComponentNode[]>(
    ALL_COMPONENTS.slice(1) // All except source
  );

  const [testing, setTesting] = useState(false);
  const [simulatedStep, setSimulatedStep] = useState<number>(-1);
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Place item into first empty slot
  const handleSelectFromInventory = (component: ComponentNode) => {
    soundManager.playClick();
    setFailureReason(null);
    const emptyIndex = pipeline.findIndex(slot => slot === null);
    if (emptyIndex === -1) return;

    const newPipeline = [...pipeline];
    newPipeline[emptyIndex] = component;
    setPipeline(newPipeline);
    setInventory(inventory.filter(c => c.id !== component.id));
  };

  // Remove item from a slot back to inventory
  const handleRemoveFromSlot = (index: number) => {
    if (index === 0) return; // Keep Source fixed
    const item = pipeline[index];
    if (!item) return;

    soundManager.playClick();
    setFailureReason(null);
    setIsSuccess(false);

    const newPipeline = [...pipeline];
    newPipeline[index] = null;
    setPipeline(newPipeline);
    setInventory([...inventory, item]);
  };

  // Reset pipeline
  const handleReset = () => {
    soundManager.playClick();
    setPipeline([ALL_COMPONENTS[0], null, null, null, null, null]);
    setInventory(ALL_COMPONENTS.slice(1));
    setFailureReason(null);
    setIsSuccess(false);
    setSimulatedStep(-1);
  };

  // Test System Simulation
  const handleTestSystem = () => {
    onRecordAttempt();
    setTesting(true);
    setFailureReason(null);
    setIsSuccess(false);
    setSimulatedStep(0);

    // Check if any slot is empty
    if (pipeline.some(slot => slot === null)) {
      soundManager.playFailure();
      setTesting(false);
      setFailureReason('The hydraulic pipeline is incomplete! Place all 6 components into sequence before testing flow.');
      return;
    }

    // Sequentially simulate water through each node
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      setSimulatedStep(currentIdx);

      // Check if current step matches correct sequence
      const expectedId = CORRECT_SEQUENCE[currentIdx];
      const actualId = pipeline[currentIdx]?.id;

      if (actualId !== expectedId) {
        clearInterval(interval);
        setTesting(false);
        soundManager.playFailure();

        // Specific archaeological reasoning feedback
        if (pipeline[1]?.id !== 'c_bund') {
          setFailureReason('Flow Failed at Step 2: Unchecked monsoon torrent! Without the stone masonry check-dam, flash floods wash out across the desert plain without being impounded.');
        } else if (pipeline[2]?.id !== 'c_desilt') {
          setFailureReason('Flow Failed at Step 3: Severe Sedimentation! Bypassing the siltation basin causes dense coarse sand and gravel to choke the inner conduits and reservoirs.');
        } else if (pipeline[3]?.id !== 'c_channel') {
          setFailureReason('Flow Failed at Step 4: Conveyance Breach! Water needs the covered cut-stone aqueduct to navigate the gentle slope into the inner citadel without evaporative loss.');
        } else if (pipeline[4]?.id !== 'c_reservoir') {
          setFailureReason('Flow Failed at Step 5: Storage Failure! Water must enter the deep bedrock-carved reservoir before it can be apportioned to civic consumers.');
        } else {
          setFailureReason('Flow Failed at Final Step: Distribution error. Check the sluice gates.');
        }
        return;
      }

      // If reached the end successfully
      if (currentIdx === CORRECT_SEQUENCE.length - 1) {
        clearInterval(interval);
        setTesting(false);
        setIsSuccess(true);
        soundManager.playWaterFlow(3);
        setTimeout(() => {
          soundManager.playSuccess();
        }, 1200);
      }
    }, 600);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl stone-panel border border-[#c97a3e]/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-500/40 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" />
              STEP 3: SYSTEM RECONSTRUCTION
            </span>
            <span className="text-xs text-[#a0907d]">Hydraulic Engineering Logic</span>
          </div>
          <h3 className="font-archaeological font-bold text-base sm:text-lg text-[#f5ebd9] mt-1">
            Reconstruct the Gravity-Fed Water Conveyance Sequence
          </h3>
          <p className="text-xs text-[#cfc2af]">
            Organize the components in logical order from natural torrent runoff to urban consumption. Test the system to simulate water flow.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={testing}
            className="px-3 py-2 rounded-xl bg-[#141c29] hover:bg-[#202c40] border border-white/10 text-stone-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET
          </button>

          <button
            onClick={handleTestSystem}
            disabled={testing || isSuccess}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-archaeological font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-sky-950/60 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{testing ? 'SIMULATING WATER FLOW...' : 'TEST SYSTEM'}</span>
          </button>
        </div>
      </div>

      {/* Main Assembly Pipeline (Slots) */}
      <div className="p-5 rounded-2xl stone-panel border-2 border-sky-500/30 bg-[#0c121d] relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase text-sky-400 tracking-wider flex items-center gap-1.5 font-bold">
            <Wrench className="w-4 h-4" />
            RECONSTRUCTED FLOW SEQUENCE:
          </span>
          <span className="text-[11px] text-[#8e7a68] font-mono">
            {pipeline.filter(Boolean).length} / 6 SLOTS OCCUPIED
          </span>
        </div>

        {/* Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
          {pipeline.map((item, idx) => {
            const isSimulatingActive = simulatedStep === idx;
            const hasWaterPassed = simulatedStep > idx;

            return (
              <div
                key={idx}
                onClick={() => item && handleRemoveFromSlot(idx)}
                className={`relative p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[140px] cursor-pointer ${
                  item
                    ? hasWaterPassed || isSuccess
                      ? 'bg-sky-950/70 border-sky-400 shadow-md shadow-sky-950/50'
                      : isSimulatingActive
                      ? 'bg-sky-900/90 border-cyan-300 ring-2 ring-cyan-400 animate-pulse'
                      : 'bg-[#151f2e] border-[#c97a3e]/40 hover:border-red-400/60'
                    : 'bg-[#0f1522]/50 border-dashed border-stone-700 hover:border-sky-500/50'
                }`}
              >
                {/* Step badge */}
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    item ? 'bg-[#c97a3e]/20 text-[#ffd9a8]' : 'text-stone-500'
                  }`}>
                    STEP 0{idx + 1}
                  </span>
                  {hasWaterPassed && (
                    <span className="text-sky-400 font-bold flex items-center gap-0.5 animate-pulse">
                      <Droplets className="w-3 h-3" /> FLOWING
                    </span>
                  )}
                </div>

                {/* Node details */}
                {item ? (
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#e6a86c] block">
                      {item.category}
                    </span>
                    <h5 className="font-archaeological font-bold text-xs text-[#f5ebd9] leading-tight">
                      {item.name}
                    </h5>
                    <p className="text-[10px] text-[#a0907d] line-clamp-2">
                      {item.shortDesc}
                    </p>
                    {idx !== 0 && (
                      <span className="text-[9px] text-red-400 hover:underline font-mono block pt-1">
                        ✕ Click to remove
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-2">
                    <Droplets className="w-5 h-5 text-stone-700 mb-1" />
                    <span className="text-[11px] text-stone-500 font-mono">
                      Empty Slot
                    </span>
                    <span className="text-[9px] text-stone-600">Select from below</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Water Animation Bar across nodes */}
        {testing && (
          <div className="mt-4 h-2 bg-stone-900 rounded-full overflow-hidden border border-white/5 relative">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 transition-all duration-500"
              style={{ width: `${((simulatedStep + 1) / 6) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Failure Feedback Alert */}
      {failureReason && (
        <div className="p-4 rounded-xl bg-red-950/60 border-2 border-red-500/40 text-xs text-red-200 flex items-start gap-3 animate-in shake duration-300">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-archaeological font-bold text-sm text-red-300 block">
              RECONSTRUCTION HYPOTHESIS FAILED
            </span>
            <p className="leading-relaxed">{failureReason}</p>
            <span className="text-[11px] text-stone-400 font-mono block pt-1">
              Hint: Think about why raw torrential runoff needs sediment settling before passing into covered stone channels.
            </span>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {isSuccess && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-[#10242b] border-2 border-emerald-400 text-xs shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest font-bold block">
                  SYSTEM RECONSTRUCTED SUCCESSFULLY
                </span>
                <h4 className="font-archaeological font-bold text-lg text-white">
                  Your Reconstruction Matches Documented Archaeological Evidence!
                </h4>
                <p className="text-emerald-200/90 text-xs mt-0.5 max-w-xl">
                  Water is diverted by the bund, purged of silt in the settling basin, conveyed through the covered channel, stored in the rock-cut reservoir, and democratically apportioned via sluice steps.
                </p>
              </div>
            </div>

            <button
              onClick={() => { soundManager.playClick(); onSuccess(); }}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-archaeological font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/80 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <span>DISCOVER HISTORICAL INSIGHTS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Available Components Tray (Inventory) */}
      {!isSuccess && (
        <div className="p-5 rounded-2xl stone-panel border border-[#c97a3e]/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#e6a86c]" />
              <h4 className="font-archaeological font-bold text-sm text-[#f5ebd9]">
                AVAILABLE HYDRAULIC COMPONENTS (CLICK TO PLACE IN NEXT SLOT)
              </h4>
            </div>
            <span className="text-[11px] text-[#8e7a68] font-mono">
              {inventory.length} AVAILABLE
            </span>
          </div>

          {inventory.length === 0 ? (
            <p className="text-xs text-stone-400 italic py-2">
              All components have been placed into the pipeline slots above. Press "Test System" to evaluate your reconstruction.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {inventory.map(comp => (
                <div
                  key={comp.id}
                  onClick={() => handleSelectFromInventory(comp)}
                  className="p-3 rounded-xl bg-[#141d2a] hover:bg-[#1f2b3e] border border-white/10 hover:border-[#c97a3e] transition-all cursor-pointer group flex flex-col justify-between min-h-[110px]"
                >
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#e6a86c] block mb-0.5">
                      {comp.category}
                    </span>
                    <h5 className="font-archaeological font-bold text-xs text-[#f1ece1] group-hover:text-[#ffd9a8] leading-tight">
                      {comp.name}
                    </h5>
                    <p className="text-[10px] text-[#a0907d] mt-1 line-clamp-2">
                      {comp.shortDesc}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono text-sky-400 group-hover:underline pt-2 block">
                    + Insert Into Slot
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progressive Hint Bar */}
      <div className="p-3.5 rounded-xl bg-[#0f1521] border border-[#c97a3e]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#e6a86c]">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>
            {currentHintLevel === 0 && 'Hint: Desilting must precede long-term reservoir storage to prevent choking.'}
            {currentHintLevel === 1 && hints[0]}
            {currentHintLevel === 2 && hints[1]}
            {currentHintLevel === 3 && hints[2]}
          </span>
        </div>

        {currentHintLevel < 3 && (
          <button
            onClick={onRequestHint}
            className="px-3 py-1 rounded-lg bg-[#1a2332] hover:bg-[#253247] border border-[#c97a3e]/30 text-[#ffd9a8] font-mono text-[11px] cursor-pointer shrink-0"
          >
            REQUEST HINT (LEVEL {currentHintLevel + 1}/3)
          </button>
        )}
      </div>

    </div>
  );
};
