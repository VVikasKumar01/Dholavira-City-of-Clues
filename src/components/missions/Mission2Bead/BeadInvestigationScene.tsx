import React, { useState } from 'react';
import { EvidenceItem } from '../../../types/game';
import { EVIDENCE_DATABASE } from '../../../data/evidence';
import { 
  Search, 
  CheckCircle, 
  Layers, 
  Gem, 
  MapPin, 
  BookOpen, 
  ArrowRight,
  Flame,
  Wrench,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../../../utils/audio';

interface Props {
  collectedEvidenceIds: string[];
  onCollectEvidence: (id: string) => void;
  onProceedToCrafting: () => void;
  onRequestHint: () => void;
  currentHintLevel: number;
  hints: [string, string, string];
}

interface WorkshopHotspot {
  id: string;
  name: string;
  evidenceId: string;
  locusTag: string;
  x: number;
  y: number;
  type: string;
}

export const BeadInvestigationScene: React.FC<Props> = ({
  collectedEvidenceIds,
  onCollectEvidence,
  onProceedToCrafting,
  onRequestHint,
  currentHintLevel,
  hints,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<WorkshopHotspot | null>(null);
  const [inspectedEvidence, setInspectedEvidence] = useState<EvidenceItem | null>(null);

  const hotspots: WorkshopHotspot[] = [
    {
      id: 'hs_raw_carnelian',
      name: 'Heating Kiln & Raw Carnelian',
      evidenceId: 'm2_raw_carnelian',
      locusTag: 'SPEC-01',
      x: 24,
      y: 36,
      type: 'Thermal Kiln'
    },
    {
      id: 'hs_ernestite',
      name: 'Micro-Drill Debitage ("Ernestite")',
      evidenceId: 'm2_ernestite_drill',
      locusTag: 'SPEC-02',
      x: 52,
      y: 45,
      type: 'Tool Cache'
    },
    {
      id: 'hs_bow_drill',
      name: 'Bow-Drill Spindle & Capstone',
      evidenceId: 'm2_bow_drill',
      locusTag: 'SPEC-03',
      x: 38,
      y: 68,
      type: 'Mechanical Rig'
    },
    {
      id: 'hs_finished_beads',
      name: 'Finished Barrel Beads Cache',
      evidenceId: 'm2_finished_beads',
      locusTag: 'SPEC-04',
      x: 75,
      y: 52,
      type: 'Export Luxury'
    }
  ];

  const handleHotspotClick = (hs: WorkshopHotspot) => {
    soundManager.playClick();
    setSelectedHotspot(hs);
    const ev = EVIDENCE_DATABASE[hs.evidenceId];
    setInspectedEvidence(ev);
  };

  const collectedCount = hotspots.filter(h => collectedEvidenceIds.includes(h.evidenceId)).length;
  const canCraft = collectedCount >= 3;

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl stone-panel corner-bracket border border-[#c59b4c]/30 text-[#eae1d2]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-[#c59b4c]/15 text-[#e6b86a] border border-[#c59b4c]/30 flex items-center gap-1">
              <Gem className="w-3.5 h-3.5 text-[#e6b86a]" />
              STEP 1: WORKSHOP INVESTIGATION
            </span>
            <span className="text-xs text-[#9b9183]">Sector: Southern Bailey Lapidary Floor</span>
          </div>
          <h3 className="font-archaeological font-bold text-base sm:text-lg text-[#f7efe4] mt-1">
            Examine Harappan Gemstone & Micro-Drilling Remains
          </h3>
          <p className="text-xs text-[#cfc4b3]">
            Click the workshop excavation markers to inspect raw nodules, ceramic firing canisters, micro-drill bits, and finished luxury beads.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#9b9183] uppercase block">
              EVIDENCE GATHERED
            </span>
            <span className="font-mono text-lg font-bold text-[#e6b86a]">
              {collectedCount} <span className="text-[#7d7467] text-xs">/ {hotspots.length}</span>
            </span>
          </div>

          <button
            disabled={!canCraft}
            onClick={() => { soundManager.playClick(); onProceedToCrafting(); }}
            className={`px-4 py-2.5 rounded-xl font-archaeological font-bold text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              canCraft
                ? 'hud-btn-bronze animate-pulse-slow shadow-lg'
                : 'bg-black/50 text-[#7d7467] border border-white/5 opacity-70 cursor-not-allowed'
            }`}
          >
            <span>{canCraft ? 'START MICRO-DRILLING →' : `FIND ${3 - collectedCount} MORE CLUES`}</span>
          </button>
        </div>
      </div>

      {/* Interactive Workshop Scene Illustration */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl stone-panel overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-[#0f1117]">
        
        {/* SVG Illustration of Harappan Bead Artisan Bench */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <rect width="1000" height="600" fill="#11131a" />
          
          {/* Workshop earthen floor */}
          <path d="M0 250 L1000 200 L1000 600 L0 600 Z" fill="#181b24" />
          <path d="M0 320 Q 500 280 1000 310 L 1000 600 L 0 600 Z" fill="#1f2330" />

          {/* Firing Kiln Hearth (Left) */}
          <ellipse cx="240" cy="230" rx="90" ry="40" fill="#3b1d11" stroke="#c97a3e" strokeWidth="3" />
          <ellipse cx="240" cy="225" rx="70" ry="30" fill="#7c2d12" />
          <circle cx="240" cy="220" r="16" fill="#f97316" opacity="0.8" />
          <text x="180" y="170" fill="#fdba74" fontSize="11" fontFamily="monospace">CERAMIC FIRING HEARTH</text>

          {/* Wooden Artisan Work-Bench (Center) */}
          <polygon points="340,320 720,290 820,480 400,520" fill="#2d2218" stroke="#d4a373" strokeWidth="2" />
          <line x1="400" y1="520" x2="400" y2="580" stroke="#1d1610" strokeWidth="12" />
          <line x1="820" y1="480" x2="820" y2="570" stroke="#1d1610" strokeWidth="12" />
          <line x1="340" y1="320" x2="340" y2="400" stroke="#1d1610" strokeWidth="8" />

          {/* Objects on Bench: Bow Drill Rig */}
          <path d="M420 380 Q 480 340 540 370" stroke="#e6a86c" strokeWidth="4" fill="none" />
          <line x1="420" y1="380" x2="540" y2="370" stroke="#f5ebd9" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Spindle */}
          <line x1="480" y1="350" x2="480" y2="440" stroke="#c97a3e" strokeWidth="5" />
          {/* Steatite capstone */}
          <ellipse cx="480" cy="348" rx="14" ry="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
          {/* Tiny drill bit */}
          <polygon points="478,440 482,440 480,455" fill="#38bdf8" />

          {/* Beads Tray on Bench */}
          <ellipse cx="640" cy="380" rx="45" ry="25" fill="#3b2c1f" stroke="#c97a3e" strokeWidth="2" />
          {/* Red carnelian beads */}
          <ellipse cx="630" cy="375" rx="12" ry="5" fill="#ea580c" />
          <ellipse cx="650" cy="382" rx="14" ry="6" fill="#c2410c" />
          <ellipse cx="635" cy="388" rx="10" ry="4" fill="#f97316" />

          {/* Raw stones debits on floor */}
          <ellipse cx="260" cy="480" rx="18" ry="12" fill="#ca8a04" stroke="#a16207" />
          <ellipse cx="290" cy="510" rx="14" ry="9" fill="#d97706" />
          <ellipse cx="230" cy="500" rx="12" ry="8" fill="#ea580c" />
        </svg>

        {/* Archaeological Field Specimen Hotspots */}
        {hotspots.map(hs => {
          const isCollected = collectedEvidenceIds.includes(hs.evidenceId);
          const isSelected = selectedHotspot?.id === hs.id;

          return (
            <button
              key={hs.id}
              onClick={() => handleHotspotClick(hs)}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer transition-all duration-300 ${
                isSelected ? 'scale-120 z-30' : 'hover:scale-110'
              }`}
            >
              {/* Subtle Warm Golden Ambient Glow Ring */}
              {!isCollected && (
                <span className="absolute -inset-2.5 rounded-full bg-amber-500/20 animate-pulse pointer-events-none" />
              )}

              {/* Archaeological Specimen Datum Reticle */}
              <div
                className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center border-2 transition-all ${
                  isCollected
                    ? 'bg-[#091512]/95 border-emerald-500/60 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.25)]'
                    : 'bg-[#140e08]/95 border-amber-500/70 text-[#ffd9a8] shadow-[0_0_24px_rgba(245,158,11,0.35)]'
                }`}
              >
                {/* Fine Crosshair Ticks */}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-amber-400/60" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-amber-400/60" />
                <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-0.5 bg-amber-400/60" />
                <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-0.5 bg-amber-400/60" />

                {isCollected ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-amber-400 font-bold leading-none">{hs.locusTag}</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 mt-0.5" />
                  </div>
                )}
              </div>

              {/* Rich Archaeological Docket Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#0e0c09]/95 border border-amber-500/50 text-[#f5ebd9] shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-amber-400 uppercase">
                  <span>{hs.locusTag}</span>
                  <span>·</span>
                  <span>{hs.type}</span>
                </div>
                <div className="font-archaeological font-bold text-xs text-[#fff5e8] mt-0.5">
                  {hs.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Clue Detail Inspector */}
      {inspectedEvidence && (
        <div className="p-5 rounded-2xl stone-panel corner-bracket border border-[#c59b4c]/35 shadow-2xl animate-in slide-in-from-bottom-2 duration-200 text-[#eae1d2]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#c59b4c]/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c59b4c]/15 text-[#e6b86a] border border-[#c59b4c]/30">
                  {inspectedEvidence.category}
                </span>
                <span className="text-xs text-[#9b9183] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#c59b4c]" />
                  {inspectedEvidence.location}
                </span>
              </div>
              <h4 className="font-archaeological font-bold text-lg text-[#f7efe4]">
                {inspectedEvidence.title}
              </h4>
            </div>

            <div>
              {collectedEvidenceIds.includes(inspectedEvidence.id) ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-500/35 text-xs font-mono">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>ADDED TO EVIDENCE BOARD</span>
                </div>
              ) : (
                <button
                  onClick={() => onCollectEvidence(inspectedEvidence.id)}
                  className="hud-btn-bronze px-4 py-2 rounded-xl font-archaeological font-bold text-xs tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Layers className="w-4 h-4" />
                  <span>ADD TO EVIDENCE BOARD</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
            <div className="md:col-span-2 space-y-2">
              <p className="text-sm text-[#cfc4b3] leading-relaxed">
                {inspectedEvidence.description}
              </p>
              <div className="p-3 rounded-xl hud-panel-subtle border border-[#c59b4c]/20 space-y-1">
                <span className="text-[#e6b86a] font-semibold text-[11px] font-mono block">
                  Archaeological Debitage Analysis:
                </span>
                <p className="text-[#eae1d2] leading-relaxed italic">
                  "{inspectedEvidence.archaeologicalNotes}"
                </p>
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-black/50 border border-[#c59b4c]/20">
              <span className="text-[#e6b86a] font-mono text-[11px] font-semibold block uppercase">
                Artifact Provenance:
              </span>
              <div>
                <span className="text-[#9b9183] block text-[10px] font-mono">Material:</span>
                <span className="text-[#cfc4b3]">{inspectedEvidence.details?.material}</span>
              </div>
              <div className="pt-2 border-t border-[#c59b4c]/15 flex items-center gap-1.5 text-[10.5px] italic text-[#9b9183]">
                <BookOpen className="w-3.5 h-3.5 text-[#c59b4c] shrink-0" />
                <span className="truncate">{inspectedEvidence.source}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hint */}
      <div className="p-3.5 rounded-xl hud-panel-subtle border border-[#c59b4c]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#e6b86a]">
          <HelpCircle className="w-4 h-4 text-[#c59b4c] shrink-0" />
          <span className="text-[#cfc4b3]">
            {currentHintLevel === 0 && 'Hint: Carnelian is quartz (Mohs 7). Examine the micro-drill tool cache to find what stone pierced it.'}
            {currentHintLevel === 1 && hints[0]}
            {currentHintLevel === 2 && hints[1]}
            {currentHintLevel === 3 && hints[2]}
          </span>
        </div>

        {currentHintLevel < 3 && (
          <button
            onClick={onRequestHint}
            className="hud-btn-glass px-3 py-1 rounded-lg text-[#e6b86a] font-mono text-[11px] cursor-pointer shrink-0"
          >
            REQUEST HINT (LEVEL {currentHintLevel + 1}/3)
          </button>
        )}
      </div>

    </div>
  );
};
