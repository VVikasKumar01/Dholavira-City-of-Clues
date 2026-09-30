import React, { useState } from 'react';
import { GameState, MapLocation } from '../../types/game';
import { MAP_LOCATIONS, MISSIONS_DATABASE } from '../../data/missions';
import { EVIDENCE_DATABASE } from '../../data/evidence';
import { Dholavira3DCanvas } from '../game3d/Dholavira3DCanvas';
import { GameHUDOverlay, CameraMode, TimeOfDay } from '../game3d/GameHUDOverlay';
import { ArchaeologicalInspectorModal } from '../game3d/ArchaeologicalInspectorModal';
import { CityZone } from '../../utils/audio';
import { 
  Compass, 
  Layers, 
  BookOpen, 
  Map as MapIcon, 
  Box, 
  Sparkles, 
  Droplets, 
  Camera,
  ArrowRight,
  Sun,
  Eye,
  FileText
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

const CINEMATIC_RENDER_URL = '/src/assets/images/dholavira_aaa_gameplay_shot_1790660182612.jpg';

interface Props {
  state: GameState;
  onSelectMission: (missionId: string) => void;
  onOpenKnowledge: () => void;
  onOpenEvidence: () => void;
  onOpenFieldNotes?: () => void;
  onOpenPause?: () => void;
  onCollectEvidence?: (evidenceId: string) => void;
  onCompleteMission?: (missionId: string, durationSeconds: number) => void;
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

export const CityMapView: React.FC<Props> = ({
  state,
  onSelectMission,
  onOpenKnowledge,
  onOpenEvidence,
  onOpenFieldNotes,
  onOpenPause,
  onCollectEvidence,
  onCompleteMission,
}) => {
  // View mode: '3d_scene' (Real-Time 3D Playable Camera) | 'cinematic_aaa' (Cinematic Showcase) | 'cartographic_plan' (2D Survey Plan)
  const [viewMode, setViewMode] = useState<'3d_scene' | 'cinematic_aaa' | 'cartographic_plan'>('3d_scene');

  // 3D Scene Controls State
  const [cameraMode, setCameraMode] = useState<CameraMode>('third_person');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('noon');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [cameraResetTrigger, setCameraResetTrigger] = useState<number>(0);
  const [quickFocusTarget, setQuickFocusTarget] = useState<'reservoir' | 'bund' | 'citadel' | 'player' | null>(null);
  const [isWaterFlowing, setIsWaterFlowing] = useState<boolean>(true);
  const [virtualMoveDirection, setVirtualMoveDirection] = useState<'forward' | 'backward' | 'left' | 'right' | 'stop'>('stop');

  // Archaeological Clue Proximity & Inspection State
  const [nearbyClue, setNearbyClue] = useState<{ id: string; name: string; type: string; isCollected: boolean } | null>(null);
  const [inspectedClueId, setInspectedClueId] = useState<string | null>(null);
  const [currentZone, setCurrentZone] = useState<CityZone>('reservoir');

  // Cartographic 2D Selection State (for alternate plan view)
  const [selectedLocation, setSelectedLocation] = useState<MapLocation>(MAP_LOCATIONS[0]);

  // Mission 1 required evidence IDs
  const mission1 = MISSIONS_DATABASE.mission_1_water;
  const m1EvidenceCount = mission1.requiredEvidenceIds.filter(id => 
    state.collectedEvidenceIds.includes(id)
  ).length;

  const handleInspectClue = (clueId: string) => {
    soundManager.playClick();
    const mappedId = CLUE_TO_EVIDENCE_MAP[clueId] || clueId;
    setInspectedClueId(mappedId);
  };

  const handleCollectEvidenceItem = (evidenceId: string) => {
    if (onCollectEvidence) {
      onCollectEvidence(evidenceId);
    }
    setIsWaterFlowing(true);
  };

  const handleLaunchHydraulicMission = () => {
    soundManager.playClick();
    onSelectMission('mission_1_water');
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.max(0.6, prev - 0.15));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.min(1.8, prev + 0.15));
  };

  const handleResetCamera = () => {
    setZoomLevel(1.0);
    setCameraResetTrigger(prev => prev + 1);
    setQuickFocusTarget('player');
  };

  const handleQuickFocus = (target: 'reservoir' | 'bund' | 'citadel' | 'player') => {
    setQuickFocusTarget(target);
    if (target === 'reservoir') {
      setCameraMode('isometric');
    } else if (target === 'player') {
      setCameraMode('third_person');
    }
  };

  const resolvedClueId = inspectedClueId ? (CLUE_TO_EVIDENCE_MAP[inspectedClueId] || inspectedClueId) : null;
  const inspectedEvidenceItem = resolvedClueId ? (EVIDENCE_DATABASE[resolvedClueId] || null) : null;

  return (
    <div className="relative flex-1 w-full min-h-[calc(100vh-65px)] flex flex-col bg-[#080c14] text-[#f1ece1] overflow-hidden select-none">
      
      {/* Sub-Header Bar: View Mode Switcher */}
      <div className="w-full px-3 py-2 sm:px-6 bg-[#060a12]/80 backdrop-blur-xl border-b border-[#c59b4c]/20 flex flex-wrap items-center justify-between gap-3 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2">
          <div className="hud-panel-subtle flex items-center gap-1 p-1 rounded-xl text-xs font-mono">
            <button
              onClick={() => { soundManager.playClick(); setViewMode('3d_scene'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === '3d_scene'
                  ? 'bg-[#7a5420] text-[#f7efe4] font-semibold border border-[#e6b86a]/40 shadow-sm'
                  : 'text-[#9b9183] hover:text-[#eae1d2]'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-[#e6b86a]" />
              <span>3D ARCHAEOLOGICAL EXPLORATION</span>
            </button>
            <button
              onClick={() => { soundManager.playClick(); setViewMode('cinematic_aaa'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cinematic_aaa'
                  ? 'bg-[#7a5420] text-[#f7efe4] font-semibold border border-[#e6b86a]/40 shadow-sm'
                  : 'text-[#9b9183] hover:text-[#eae1d2]'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-[#e6b86a]" />
              <span>CINEMATIC SHOWCASE</span>
            </button>
            <button
              onClick={() => { soundManager.playClick(); setViewMode('cartographic_plan'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cartographic_plan'
                  ? 'bg-[#7a5420] text-[#f7efe4] font-semibold border border-[#e6b86a]/40 shadow-sm'
                  : 'text-[#9b9183] hover:text-[#eae1d2]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-[#88b8cc]" />
              <span className="hidden sm:inline">CARTOGRAPHIC SURVEY PLAN</span>
            </button>
          </div>
        </div>

        {/* Quick Progress Summary & Tools */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono text-[#9b9183]">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-[#e6b86a] font-bold">{m1EvidenceCount}/5 Water Clues</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#c59b4c]" />
            <span className="text-[#cfc4b3]">{state.collectedEvidenceIds.length}/10 Evidence</span>
          </div>
          {onOpenFieldNotes && (
            <button
              onClick={() => { soundManager.playClick(); onOpenFieldNotes(); }}
              className="hud-btn-glass flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[#e6b86a] hover:text-white font-mono text-[11px] cursor-pointer transition-colors shadow-sm"
              title="Open Archaeological Field Notes Journal"
            >
              <FileText className="w-3.5 h-3.5 text-[#e6b86a]" />
              <span>Notes ({state.sessionMetadata.fieldNotes.length})</span>
            </button>
          )}
          <button
            onClick={onOpenEvidence}
            className="text-[#c59b4c] hover:text-[#e6b86a] hover:underline font-mono text-[11px] cursor-pointer hidden md:inline transition-colors"
          >
            Evidence Board →
          </button>
        </div>
      </div>

      {/* Main Game Screen Canvas Container (16:9 widescreen presentation) */}
      <div className="relative flex-1 w-full h-full min-h-[580px] overflow-hidden flex items-center justify-center bg-black">
        
        {/* VIEW 1: Photorealistic AAA Adventure Game 16:9 Screenshot View with Live Interactive HUD */}
        {viewMode === 'cinematic_aaa' && (
          <div className="relative w-full h-full aspect-[16/9] max-h-[calc(100vh-115px)] overflow-hidden shadow-2xl">
            {/* Ultra-Detailed Photorealistic AAA In-Game Render */}
            <img
              src={CINEMATIC_RENDER_URL}
              alt="Dholavira Archaeological Adventure AAA Game Scene"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
            />

            {/* Subtle Vignette & Atmospheric Sunbeams Overlay */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />

            {/* Subtle Interactive Beacon Marker on Reservoir in 3D Space */}
            <button
              onClick={() => handleInspectClue('m1_rock_cut_reservoir')}
              style={{ left: '56%', top: '63%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer pointer-events-auto z-20"
              title="Click to Examine Eastern Rock-Cut Reservoir"
            >
              {/* Subtle Glowing Pulse Rings */}
              <span className="absolute -inset-4 rounded-full bg-[#c97a3e]/30 animate-ping pointer-events-none" />
              <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border-2 border-[#ffd9a8] flex items-center justify-center text-[#ffd9a8] shadow-lg group-hover:scale-115 transition-transform">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
            </button>

            {/* Upgraded AAA Translucent Glass Game HUD Overlay */}
            <GameHUDOverlay
              collectedCount={m1EvidenceCount}
              totalRequired={5}
              nearbyClue={{
                id: 'm1_rock_cut_reservoir',
                name: 'Eastern Rock-Cut Reservoir',
                type: 'Hydraulic Monument',
                isCollected: state.collectedEvidenceIds.includes('m1_rock_cut_reservoir'),
              }}
              onInspectClue={handleInspectClue}
              onLaunchReconstruction={handleLaunchHydraulicMission}
              cameraMode={cameraMode}
              onSetCameraMode={setCameraMode}
              timeOfDay={timeOfDay}
              onSetTimeOfDay={setTimeOfDay}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetCamera={handleResetCamera}
              onQuickFocus={handleQuickFocus}
              isWaterFlowing={isWaterFlowing}
              onToggleWaterFlow={() => {
                const nextFlow = !isWaterFlowing;
                setIsWaterFlowing(nextFlow);
                if (nextFlow) soundManager.playWaterFlow();
              }}
              onMoveCommand={setVirtualMoveDirection}
              isMobileTouch={false}
              currentZone="reservoir"
              totalEvidenceCount={state.collectedEvidenceIds.length}
              archiveCount={state.unlockedKnowledgeIds.length}
              playerRank={state.player.title || 'Investigator'}
              fieldNotesCount={state.sessionMetadata.fieldNotes.length}
              onOpenFieldNotes={onOpenFieldNotes}
            />
          </div>
        )}

        {/* VIEW 2: Real-Time 3D Playable WebGL Camera Scene */}
        {viewMode === '3d_scene' && (
          <div className="relative w-full h-full min-h-[calc(100vh-115px)]">
            <Dholavira3DCanvas
              collectedEvidenceIds={state.collectedEvidenceIds}
              onInspectClue={handleInspectClue}
              onNearbyClueChange={setNearbyClue}
              cameraMode={cameraMode}
              timeOfDay={timeOfDay}
              zoomLevel={zoomLevel}
              cameraResetTrigger={cameraResetTrigger}
              quickFocusTarget={quickFocusTarget}
              isWaterFlowing={isWaterFlowing}
              virtualMoveDirection={virtualMoveDirection}
              onZoneChange={setCurrentZone}
              onOpenPause={onOpenPause}
              onCompleteMission={onCompleteMission}
            />

            <GameHUDOverlay
              collectedCount={m1EvidenceCount}
              totalRequired={5}
              nearbyClue={nearbyClue}
              onInspectClue={handleInspectClue}
              onLaunchReconstruction={handleLaunchHydraulicMission}
              cameraMode={cameraMode}
              onSetCameraMode={setCameraMode}
              timeOfDay={timeOfDay}
              onSetTimeOfDay={setTimeOfDay}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetCamera={handleResetCamera}
              onQuickFocus={handleQuickFocus}
              isWaterFlowing={isWaterFlowing}
              onToggleWaterFlow={() => {
                const nextFlow = !isWaterFlowing;
                setIsWaterFlowing(nextFlow);
                if (nextFlow) soundManager.playWaterFlow();
              }}
              onMoveCommand={setVirtualMoveDirection}
              isMobileTouch={false}
              currentZone={currentZone}
              totalEvidenceCount={state.collectedEvidenceIds.length}
              archiveCount={state.unlockedKnowledgeIds.length}
              playerRank={state.player.title || 'Investigator'}
              fieldNotesCount={state.sessionMetadata.fieldNotes.length}
              onOpenFieldNotes={onOpenFieldNotes}
              onOpenPause={onOpenPause}
              isMissionCompleted={state.completedMissionIds.includes('mission_1_water')}
            />
          </div>
        )}

        {/* VIEW 3: Cartographic Site Survey Plan */}
        {viewMode === 'cartographic_plan' && (
          <div className="p-3 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            <div className="lg:col-span-2 relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl stone-panel overflow-hidden border-2 border-[#c97a3e]/30 shadow-2xl bg-[#0e141f]">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 625" fill="none" preserveAspectRatio="none">
                <rect width="1000" height="625" fill="#0d131f" />
                
                {/* Manhar Nullah (North) */}
                <path d="M50 80 Q 250 110 500 70 T 950 90" stroke="#2563eb" strokeWidth="18" strokeLinecap="round" opacity="0.35" />
                <path d="M50 80 Q 250 110 500 70 T 950 90" stroke="#38bdf8" strokeWidth="4" strokeDasharray="12 8" opacity="0.6" />
                <text x="70" y="65" fill="#7dd3fc" fontSize="12" fontFamily="monospace" opacity="0.75">MANHAR SEASONAL STREAM (NORTH)</text>

                {/* Mansar Nullah (South) */}
                <path d="M50 560 Q 300 520 600 550 T 950 540" stroke="#2563eb" strokeWidth="18" strokeLinecap="round" opacity="0.35" />
                <path d="M50 560 Q 300 520 600 550 T 950 540" stroke="#38bdf8" strokeWidth="4" strokeDasharray="12 8" opacity="0.6" />
                <text x="70" y="585" fill="#7dd3fc" fontSize="12" fontFamily="monospace" opacity="0.75">MANSAR SEASONAL STREAM (SOUTH)</text>

                {/* Outer Fortification Wall */}
                <rect x="180" y="140" width="640" height="360" rx="16" stroke="#c97a3e" strokeWidth="6" strokeDasharray="16 8" fill="#141c29" opacity="0.6" />
                <text x="200" y="165" fill="#e6a86c" fontSize="11" fontFamily="Cinzel" letterSpacing="2">OUTER FORTIFICATION WALL (771m x 616m)</text>

                {/* Middle Town Enclosure */}
                <rect x="460" y="180" width="320" height="200" rx="10" stroke="#d4a373" strokeWidth="4" fill="#182333" opacity="0.7" />
                <text x="480" y="205" fill="#f5ebd9" fontSize="11" fontFamily="Cinzel">MIDDLE TOWN</text>

                {/* Citadel & Castle */}
                <rect x="240" y="220" width="220" height="240" rx="12" stroke="#e6a86c" strokeWidth="5" fill="#202c3e" opacity="0.85" />
                <text x="260" y="250" fill="#ffd9a8" fontSize="13" fontWeight="bold" fontFamily="Cinzel">CITADEL (CASTLE & BAILEY)</text>

                {/* Ceremonial Ground */}
                <rect x="250" y="170" width="200" height="40" rx="4" stroke="#c97a3e" strokeWidth="2" fill="#2a1f17" opacity="0.5" />
                <text x="270" y="195" fill="#ffd9a8" fontSize="10" fontFamily="Cinzel">CEREMONIAL GROUND (283m)</text>

                {/* Eastern Reservoir */}
                <rect x="470" y="390" width="310" height="90" rx="8" stroke="#38bdf8" strokeWidth="4" fill="#1e3a5f" opacity="0.75" />
                <text x="490" y="440" fill="#bae6fd" fontSize="12" fontWeight="bold" fontFamily="Cinzel">EASTERN ROCK-CUT RESERVOIR</text>
                <text x="490" y="458" fill="#7dd3fc" fontSize="9" fontFamily="monospace">73.4m x 29.3m x 10.6m Depth</text>
              </svg>

              {MAP_LOCATIONS.map(loc => {
                const isSelected = selectedLocation.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => { soundManager.playClick(); setSelectedLocation(loc); }}
                    style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-1 shadow-lg border-2 ${
                      isSelected ? 'bg-[#c97a3e] border-[#ffd9a8] text-white' : 'bg-[#18202d] border-stone-600 text-stone-300'
                    }`}>
                      {loc.icon === 'droplets' ? <Droplets className="w-5 h-5 text-sky-400" /> : <Compass className="w-5 h-5 text-[#ffd9a8]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="w-full stone-panel corner-bracket rounded-2xl p-5 border border-[#c59b4c]/30 shadow-xl space-y-4 text-[#eae1d2]">
              <div className="flex items-center justify-between pb-3 border-b border-[#c59b4c]/20">
                <span className="text-[11px] font-mono text-[#9b9183] uppercase tracking-wider">
                  SURVEY SECTOR DOSSIER
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#c59b4c]/15 text-[#e6b86a] border border-[#c59b4c]/30">
                  {selectedLocation.id === 'loc_reservoir' ? 'PRIMARY SECTOR' : 'EXPLORATION'}
                </span>
              </div>

              <div>
                <h3 className="font-archaeological font-bold text-xl text-[#f7efe4]">
                  {selectedLocation.name}
                </h3>
                <p className="text-xs font-mono text-[#c59b4c] mt-0.5">
                  {selectedLocation.tagline}
                </p>
              </div>

              <p className="text-xs text-[#cfc4b3] leading-relaxed">
                {selectedLocation.description}
              </p>

              <button
                onClick={() => {
                  if (selectedLocation.missionId) onSelectMission(selectedLocation.missionId);
                  else setViewMode('cinematic_aaa');
                }}
                className="hud-btn-bronze w-full py-3 px-4 rounded-xl font-archaeological font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ENTER 3D INVESTIGATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Clue Inspector Modal (Appears when player interacts with an archaeological clue) */}
      {inspectedEvidenceItem && (
        <ArchaeologicalInspectorModal
          evidence={inspectedEvidenceItem}
          isCollected={state.collectedEvidenceIds.includes(inspectedEvidenceItem.id)}
          onCollect={handleCollectEvidenceItem}
          onClose={() => setInspectedClueId(null)}
          onLaunchReconstruction={handleLaunchHydraulicMission}
          totalCollectedCount={m1EvidenceCount}
        />
      )}

    </div>
  );
};
