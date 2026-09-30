import React, { useState } from 'react';
import { EvidenceItem } from '../../../types/game';
import { EVIDENCE_DATABASE } from '../../../data/evidence';
import { Dholavira3DCanvas } from '../../game3d/Dholavira3DCanvas';
import { GameHUDOverlay, CameraMode, TimeOfDay } from '../../game3d/GameHUDOverlay';
import { 
  Search, 
  CheckCircle, 
  Layers, 
  Sparkles, 
  MapPin, 
  Eye, 
  BookOpen, 
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Box,
  Map as MapIcon
} from 'lucide-react';
import { soundManager, CityZone } from '../../../utils/audio';

interface Props {
  collectedEvidenceIds: string[];
  onCollectEvidence: (id: string) => void;
  onProceedToReconstruction: () => void;
  onRequestHint: () => void;
  currentHintLevel: number;
  hints: [string, string, string];
}

interface Hotspot {
  id: string;
  name: string;
  evidenceId: string;
  locusTag: string;
  x: number; // percentage
  y: number; // percentage
  type: string;
}

const CLUE_TO_EVIDENCE_MAP: Record<string, string> = {
  manhar_bund: 'm1_stream_bund',
  m1_stream_bund: 'm1_stream_bund',
  silt_chamber: 'm1_silt_chamber',
  m1_silt_chamber: 'm1_silt_chamber',
  eastern_reservoir: 'm1_rock_cut_reservoir',
  m1_rock_cut_reservoir: 'm1_rock_cut_reservoir',
  stone_ghats: 'm1_masonry_channel',
  m1_masonry_channel: 'm1_masonry_channel',
  sluice_gate: 'm1_sluice_steps',
  m1_sluice_steps: 'm1_sluice_steps',
  signboard_inscription: 'm1_overflow_drain',
  m1_overflow_drain: 'm1_overflow_drain',
};

export const WaterInvestigationScene: React.FC<Props> = ({
  collectedEvidenceIds,
  onCollectEvidence,
  onProceedToReconstruction,
  onRequestHint,
  currentHintLevel,
  hints,
}) => {
  const [viewMode, setViewMode] = useState<'3d' | 'schematic'>('3d');
  const [cameraMode, setCameraMode] = useState<CameraMode>('third_person');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('noon');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [cameraResetTrigger, setCameraResetTrigger] = useState<number>(0);
  const [quickFocusTarget, setQuickFocusTarget] = useState<'reservoir' | 'bund' | 'citadel' | 'player' | null>(null);
  const [isWaterFlowing, setIsWaterFlowing] = useState<boolean>(false);
  const [virtualMoveDirection, setVirtualMoveDirection] = useState<'forward' | 'backward' | 'left' | 'right' | 'stop'>('stop');

  const [nearbyClue, setNearbyClue] = useState<{ id: string; name: string; type: string; isCollected: boolean } | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [inspectedEvidence, setInspectedEvidence] = useState<EvidenceItem | null>(null);
  const [currentZone, setCurrentZone] = useState<CityZone>('reservoir');

  const hotspots: Hotspot[] = [
    {
      id: 'hs_bund',
      name: 'North Stream Check-Dam',
      evidenceId: 'm1_stream_bund',
      locusTag: 'LOC-01',
      x: 18,
      y: 28,
      type: 'Stone Bund Dam'
    },
    {
      id: 'hs_silt',
      name: 'Sediment Settling Basin',
      evidenceId: 'm1_silt_chamber',
      locusTag: 'LOC-02',
      x: 35,
      y: 42,
      type: 'Desilting Tank'
    },
    {
      id: 'hs_channel',
      name: 'Cut-Stone Inlet Channel',
      evidenceId: 'm1_masonry_channel',
      locusTag: 'LOC-03',
      x: 48,
      y: 56,
      type: 'Aqueduct'
    },
    {
      id: 'hs_reservoir',
      name: 'Bedrock Rock-Cut Reservoir',
      evidenceId: 'm1_rock_cut_reservoir',
      locusTag: 'LOC-04',
      x: 72,
      y: 50,
      type: 'Main Reservoir'
    },
    {
      id: 'hs_sluice',
      name: 'Regulating Sluice & Steps',
      evidenceId: 'm1_sluice_steps',
      locusTag: 'LOC-05',
      x: 84,
      y: 74,
      type: 'Stepwell Sluice'
    },
    {
      id: 'hs_overflow',
      name: 'Secondary Cascading Spillway',
      evidenceId: 'm1_overflow_drain',
      locusTag: 'LOC-06',
      x: 58,
      y: 82,
      type: 'Spillway'
    }
  ];

  const handleHotspotClick = (hs: Hotspot) => {
    soundManager.playClick();
    setSelectedHotspot(hs);
    const ev = EVIDENCE_DATABASE[hs.evidenceId];
    setInspectedEvidence(ev);
  };

  const handleInspectEvidence = (clueId: string) => {
    const mappedId = CLUE_TO_EVIDENCE_MAP[clueId] || clueId;
    const ev = EVIDENCE_DATABASE[mappedId] || EVIDENCE_DATABASE[clueId];
    if (ev) setInspectedEvidence(ev);
  };

  const handleCollect = (evidenceId: string) => {
    onCollectEvidence(evidenceId);
  };

  const requiredCount = 5;
  const collectedCount = hotspots.filter(h => collectedEvidenceIds.includes(h.evidenceId)).length;
  const canReconstruct = collectedCount >= requiredCount;

  return (
    <div className="space-y-4">
      
      {/* Top Banner: Mission Objective & Clue Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl stone-panel corner-bracket border border-[#c59b4c]/30 text-[#eae1d2]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-[#c59b4c]/15 text-[#e6b86a] border border-[#c59b4c]/30">
              STEP 1: FIELD INVESTIGATION
            </span>
            <span className="text-xs text-[#9b9183]">Sector: Eastern Reservoir & Bunds</span>
          </div>
          <h3 className="font-archaeological font-bold text-base sm:text-lg text-[#f7efe4] mt-1">
            Examine Archaeological Remains & Identify Hydraulic Components
          </h3>
          <p className="text-xs text-[#cfc4b3]">
            Explore the ruins in real-time 3D or inspect the architectural schematic to identify all 5 key civil engineering features.
          </p>
        </div>

        {/* View Switcher & Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="hud-panel-subtle flex items-center gap-1 p-1 rounded-xl text-xs font-mono">
            <button
              onClick={() => { soundManager.playClick(); setViewMode('3d'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-[#7a5420] text-[#f7efe4] font-semibold border border-[#e6b86a]/40 shadow-sm'
                  : 'text-[#9b9183] hover:text-[#eae1d2]'
              }`}
            >
              <Box className="w-4 h-4 text-[#e6b86a]" />
              <span>3D WORLD</span>
            </button>
            <button
              onClick={() => { soundManager.playClick(); setViewMode('schematic'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'schematic'
                  ? 'bg-[#7a5420] text-[#f7efe4] font-semibold border border-[#e6b86a]/40 shadow-sm'
                  : 'text-[#9b9183] hover:text-[#eae1d2]'
              }`}
            >
              <MapIcon className="w-4 h-4 text-[#88b8cc]" />
              <span>SCHEMATIC</span>
            </button>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-[#9b9183] uppercase block">
              CLUES IDENTIFIED
            </span>
            <span className="font-mono text-lg font-bold text-[#e6b86a]">
              {collectedCount} <span className="text-[#7d7467] text-xs">/ {hotspots.length}</span>
            </span>
          </div>

          <button
            disabled={!canReconstruct}
            onClick={() => { soundManager.playClick(); onProceedToReconstruction(); }}
            className={`px-4 py-2.5 rounded-xl font-archaeological font-bold text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              canReconstruct
                ? 'hud-btn-bronze animate-pulse-slow shadow-lg'
                : 'bg-black/50 text-[#7d7467] border border-white/5 opacity-70 cursor-not-allowed'
            }`}
          >
            <span>{canReconstruct ? 'BEGIN RECONSTRUCTION →' : `FIND ${requiredCount - collectedCount} MORE CLUES`}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Archaeological Scene Canvas */}
      {viewMode === '3d' ? (
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl stone-panel overflow-hidden border-2 border-[#c97a3e]/35 shadow-2xl bg-[#0c121c]">
          <Dholavira3DCanvas
            collectedEvidenceIds={collectedEvidenceIds}
            onInspectClue={handleInspectEvidence}
            onNearbyClueChange={setNearbyClue}
            cameraMode={cameraMode}
            timeOfDay={timeOfDay}
            zoomLevel={zoomLevel}
            cameraResetTrigger={cameraResetTrigger}
            quickFocusTarget={quickFocusTarget}
            isWaterFlowing={isWaterFlowing}
            virtualMoveDirection={virtualMoveDirection}
            onZoneChange={setCurrentZone}
          />

          <GameHUDOverlay
            collectedCount={collectedCount}
            totalRequired={requiredCount}
            nearbyClue={nearbyClue}
            onInspectClue={handleInspectEvidence}
            onLaunchReconstruction={onProceedToReconstruction}
            cameraMode={cameraMode}
            onSetCameraMode={setCameraMode}
            timeOfDay={timeOfDay}
            onSetTimeOfDay={setTimeOfDay}
            onZoomIn={() => setZoomLevel(prev => Math.max(0.6, prev - 0.15))}
            onZoomOut={() => setZoomLevel(prev => Math.min(1.8, prev + 0.15))}
            onResetCamera={() => {
              setZoomLevel(1.0);
              setCameraResetTrigger(prev => prev + 1);
              setQuickFocusTarget('player');
            }}
            onQuickFocus={setQuickFocusTarget}
            isWaterFlowing={isWaterFlowing}
            onToggleWaterFlow={() => {
              const next = !isWaterFlowing;
              setIsWaterFlowing(next);
              if (next) soundManager.playWaterFlow();
            }}
            onMoveCommand={setVirtualMoveDirection}
            isMobileTouch={false}
            currentZone={currentZone}
          />
        </div>
      ) : (
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl stone-panel overflow-hidden border-2 border-[#c97a3e]/35 shadow-2xl bg-[#0d121c]">
        
        {/* SVG Detailed Architectural Layout of Eastern Reservoir */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
          {/* Desert ground bedrock */}
          <rect width="1000" height="600" fill="#060a10" />

          {/* Topographical contours */}
          <ellipse cx="200" cy="180" rx="350" ry="140" fill="#09111c" opacity="0.8" />
          <ellipse cx="600" cy="450" rx="450" ry="200" fill="#0c1624" opacity="0.6" />

          {/* Manhar Torrent Channel (top left) */}
          <path d="M0 160 Q 150 180 260 170" stroke="#062232" strokeWidth="26" strokeLinecap="round" opacity="0.7" />
          <path d="M0 160 Q 150 180 260 170" stroke="#0e4860" strokeWidth="10" strokeLinecap="round" opacity="0.8" />
          <path d="M0 160 Q 150 180 260 170" stroke="#38bdf8" strokeWidth="3" strokeDasharray="14 10" opacity="0.85" />
          <text x="30" y="142" fill="#7dd3fc" fontSize="11" fontFamily="monospace" letterSpacing="1">MANHAR SEASONAL STREAM RUNOFF</text>

          {/* Check-Dam / Stone Bund Structure across stream */}
          <rect x="160" y="120" width="32" height="90" rx="4" fill="#6d4122" stroke="#d4a373" strokeWidth="2" opacity="0.95" />
          <line x1="160" y1="140" x2="192" y2="140" stroke="#1f140a" strokeWidth="2" />
          <line x1="160" y1="160" x2="192" y2="160" stroke="#1f140a" strokeWidth="2" />
          <line x1="160" y1="180" x2="192" y2="180" stroke="#1f140a" strokeWidth="2" />

          {/* Intermediate Feeder Channel */}
          <path d="M192 165 L 320 230" stroke="#5a351b" strokeWidth="12" strokeLinecap="square" />
          <path d="M192 165 L 320 230" stroke="#051924" strokeWidth="6" strokeLinecap="square" />

          {/* Siltation Settling Basin (Desilting Chamber) */}
          <rect x="310" y="210" width="75" height="60" rx="6" fill="#081822" stroke="#b8860b" strokeWidth="2.5" />
          <line x1="330" y1="210" x2="330" y2="270" stroke="#8a6418" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="360" y1="210" x2="360" y2="270" stroke="#8a6418" strokeWidth="2" strokeDasharray="3 3" />
          <text x="315" y="285" fill="#e6a86c" fontSize="10" fontFamily="monospace">SILT CHAMBER</text>

          {/* Masonry Covered Channel to Reservoir */}
          <path d="M385 240 L 460 270 L 580 270" stroke="#5a351b" strokeWidth="12" strokeLinecap="square" />
          <path d="M385 240 L 460 270 L 580 270" stroke="#04121a" strokeWidth="6" strokeLinecap="square" />

          {/* Eastern Rock-Cut Reservoir (Gigantic Rectangular Basin) */}
          <rect x="580" y="160" width="360" height="280" rx="12" fill="#020e16" stroke="#b8860b" strokeWidth="3" opacity="0.95" />
          {/* Inner Steps Terraces & Dark Reflective Water Body */}
          <rect x="600" y="180" width="320" height="240" rx="8" fill="#04141e" stroke="#684a28" strokeWidth="1.5" />
          <rect x="625" y="205" width="270" height="190" rx="6" fill="#061c28" stroke="#3b6678" strokeWidth="1.5" />
          <rect x="650" y="230" width="220" height="140" rx="4" fill="#021017" stroke="#1d4d62" strokeWidth="2" />
          <text x="668" y="305" fill="#6baac5" fontSize="12" fontFamily="monospace" letterSpacing="1.5">GREAT ROCK-CUT BASIN</text>

          {/* Flight of carved bedrock steps leading down */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1="580"
              y1={240 + i * 16}
              x2="650"
              y2={240 + i * 16}
              stroke="#b8860b"
              strokeWidth="2"
            />
          ))}

          {/* Sluice Gate and Southern Access Steps */}
          <rect x="800" y="410" width="80" height="60" rx="4" fill="#141c26" stroke="#b8860b" strokeWidth="2.5" />
          <line x1="825" y1="410" x2="825" y2="470" stroke="#d4a373" strokeWidth="2.5" />
          <line x1="855" y1="410" x2="855" y2="470" stroke="#d4a373" strokeWidth="2.5" />

          {/* Secondary Cascading Drain (bottom right) */}
          <path d="M680 440 L 680 520 L 520 520" stroke="#5a351b" strokeWidth="8" strokeLinecap="round" />
          <path d="M680 440 L 680 520 L 520 520" stroke="#0e4860" strokeWidth="4" strokeDasharray="6 6" />
        </svg>

        {/* Archaeological Survey Hotspots Overlay */}
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
                <span className="absolute -inset-2 rounded-full bg-[#e6a86c]/20 animate-pulse pointer-events-none" />
              )}

              {/* Archaeological Survey Datum Reticle */}
              <div
                className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center border-2 transition-all ${
                  isCollected
                    ? 'bg-[#091512]/95 border-emerald-500/60 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.25)]'
                    : 'bg-[#10141d]/95 border-[#e6a86c]/70 text-[#ffd9a8] shadow-[0_0_22px_rgba(230,168,108,0.35)]'
                }`}
              >
                {/* Fine Crosshair Ticks */}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#e6a86c]/60" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#e6a86c]/60" />
                <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-0.5 bg-[#e6a86c]/60" />
                <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-0.5 bg-[#e6a86c]/60" />

                {isCollected ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-[#e6a86c] font-bold leading-none">{hs.locusTag}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#ffd9a8] mt-0.5" />
                  </div>
                )}
              </div>

              {/* Rich Archaeological Docket Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#090d14]/95 border border-[#e6a86c]/50 text-[#f5ebd9] shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#e6a86c] uppercase">
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

        {/* Site Legend overlay (bottom left) */}
        <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-[#0b0f17]/90 border border-white/10 text-[11px] text-[#a0907d] pointer-events-none max-w-xs hidden sm:block">
          <span className="font-archaeological text-[#e6a86c] font-bold block mb-0.5">
            EXCAVATION TRANSECT: EASTERN RESERVOIR
          </span>
          <span>Click all 6 architectural elements to examine functional relationships before reassembling the flow.</span>
        </div>
      </div>
      )}

      {/* Inspected Clue Detail Card (Appears when hotspot clicked) */}
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

            {/* Collection status */}
            <div>
              {collectedEvidenceIds.includes(inspectedEvidence.id) ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-500/35 text-xs font-mono">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>ADDED TO EVIDENCE BOARD</span>
                </div>
              ) : (
                <button
                  onClick={() => handleCollect(inspectedEvidence.id)}
                  className="hud-btn-bronze px-4 py-2 rounded-xl font-archaeological font-bold text-xs tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Layers className="w-4 h-4" />
                  <span>ADD TO EVIDENCE BOARD</span>
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
            <div className="md:col-span-2 space-y-2">
              <p className="text-sm text-[#cfc4b3] leading-relaxed">
                {inspectedEvidence.description}
              </p>
              <div className="p-3 rounded-xl hud-panel-subtle border border-[#c59b4c]/20 space-y-1">
                <span className="text-[#e6b86a] font-semibold text-[11px] font-mono block">
                  Archaeological Excavation Notes:
                </span>
                <p className="text-[#eae1d2] leading-relaxed italic">
                  "{inspectedEvidence.archaeologicalNotes}"
                </p>
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-black/50 border border-[#c59b4c]/20">
              <span className="text-[#e6b86a] font-mono text-[11px] font-semibold block uppercase">
                Artifact Metadata:
              </span>
              <div>
                <span className="text-[#9b9183] block text-[10px] font-mono">Material:</span>
                <span className="text-[#cfc4b3]">{inspectedEvidence.details?.material}</span>
              </div>
              <div>
                <span className="text-[#9b9183] block text-[10px] font-mono">Significance:</span>
                <span className="text-[#cfc4b3]">{inspectedEvidence.details?.significance}</span>
              </div>
              <div className="pt-2 border-t border-[#c59b4c]/15 flex items-center gap-1.5 text-[10.5px] italic text-[#9b9183]">
                <BookOpen className="w-3.5 h-3.5 text-[#c59b4c] shrink-0" />
                <span className="truncate">{inspectedEvidence.source}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progressive Hint Bar */}
      <div className="p-3.5 rounded-xl hud-panel-subtle border border-[#c59b4c]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#e6b86a]">
          <HelpCircle className="w-4 h-4 text-[#c59b4c] shrink-0" />
          <span className="text-[#cfc4b3]">
            {currentHintLevel === 0 && 'Need guidance on the sequence? Request a contextual field hint.'}
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
