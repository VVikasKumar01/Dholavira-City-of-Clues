import React, { useEffect, useState } from 'react';
import { 
  Droplets, 
  Layers, 
  RotateCcw, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Music, 
  Navigation, 
  BookOpen, 
  FileText, 
  Keyboard, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { soundManager, CityZone } from '../../utils/audio';

export type CameraMode = 'third_person' | 'isometric' | 'drone';
export type TimeOfDay = 'golden' | 'noon' | 'twilight';

interface ClueNearby {
  id: string;
  name: string;
  type: string;
  isCollected: boolean;
}

interface Props {
  collectedCount: number;
  totalRequired: number;
  nearbyClue: ClueNearby | null;
  onInspectClue: (clueId: string) => void;
  onLaunchReconstruction: () => void;
  cameraMode: CameraMode;
  onSetCameraMode: (mode: CameraMode) => void;
  timeOfDay: TimeOfDay;
  onSetTimeOfDay: (tod: TimeOfDay) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetCamera: () => void;
  onQuickFocus: (target: 'reservoir' | 'bund' | 'citadel' | 'player') => void;
  isWaterFlowing: boolean;
  onToggleWaterFlow: () => void;
  onMoveCommand: (dir: 'forward' | 'backward' | 'left' | 'right' | 'stop') => void;
  isMobileTouch: boolean;
  currentZone?: CityZone;
  totalEvidenceCount?: number;
  archiveCount?: number;
  playerRank?: string;
  fieldNotesCount?: number;
  onOpenFieldNotes?: () => void;
  onOpenPause?: () => void;
  isMissionCompleted?: boolean;
}

export const GameHUDOverlay: React.FC<Props> = ({
  collectedCount,
  totalRequired,
  nearbyClue,
  onInspectClue,
  onLaunchReconstruction,
  cameraMode,
  onSetCameraMode,
  timeOfDay,
  onSetTimeOfDay,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  isWaterFlowing,
  onToggleWaterFlow,
  currentZone = 'reservoir',
  totalEvidenceCount = 0,
  archiveCount = 2,
  playerRank = 'Investigator',
  fieldNotesCount = 0,
  onOpenFieldNotes,
  onOpenPause,
  isMissionCompleted = false,
}) => {
  const isMissionReady = collectedCount >= totalRequired;
  const [showControlsModal, setShowControlsModal] = useState(false);

  // Key listeners for N (Notes), T (Test Water), H (Help/Controls), Escape (Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'n' || e.key === 'N') {
        if (onOpenFieldNotes) onOpenFieldNotes();
      }
      if (e.key === 't' || e.key === 'T') {
        if (isMissionReady) {
          soundManager.playClick();
          onLaunchReconstruction();
        }
      }
      if (e.key === 'h' || e.key === 'H') {
        soundManager.playClick();
        setShowControlsModal(prev => !prev);
      }
      if (e.key === 'Escape') {
        if (showControlsModal) {
          setShowControlsModal(false);
        } else if (onOpenPause) {
          onOpenPause();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenFieldNotes, onOpenPause, isMissionReady, onLaunchReconstruction, showControlsModal]);

  const getZoneAudioInfo = (zone: CityZone) => {
    switch (zone) {
      case 'reservoir':
        return 'Reservoir Waters · Bamboo Flute';
      case 'citadel':
        return 'Citadel Acropolis · Bronze Temple Bells';
      case 'stream_bund':
        return 'Manhar Gorge · Howling Wind & Falcons';
      case 'middle_town':
        return 'Artisan Lapidary Quarter · Plucked Strings';
      default:
        return 'Desert Outskirts · Sandstone Ruins';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none z-10 font-sans">
      
      {/* TOP ZONE: Dark Translucent Obsidian Glass Status Bar */}
      <div className="flex items-start justify-between gap-3 w-full max-w-7xl mx-auto">
        
        {/* Top-Left: Game Title, Player Rank, Sector & Mission Objective */}
        <div className="space-y-2 pointer-events-auto">
          
          {/* Main Archaeological Identifier Strip */}
          <div className="hud-panel inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl corner-bracket text-xs">
            <span className="font-archaeological font-bold tracking-wider text-[#e6b86a] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c59b4c] shadow-[0_0_8px_rgba(197,155,76,0.6)]" />
              DHOLAVIRA 3D
            </span>
            <span className="text-[#c59b4c]/25">|</span>
            <span className="font-mono text-[11px] text-[#cfc4b3] tracking-wide">
              {playerRank}
            </span>
            <span className="text-[#c59b4c]/25">|</span>
            <span className="text-[#9b9183] text-[11px] hidden sm:inline">
              Excavation Sector: <span className="text-[#eae1d2] font-medium">Khādir Bet Settlement Survey</span>
            </span>
          </div>

          {/* Dark Cinematic Mission Objective Widget */}
          <div className="hud-panel p-3.5 rounded-xl max-w-sm text-xs corner-bracket">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#eae1d2] font-medium tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#c59b4c] animate-pulse shadow-[0_0_8px_rgba(197,155,76,0.6)]" />
                <span>Mission: Restore Hydraulic Network</span>
              </div>
              <span className="font-mono text-[11px] text-[#e6b86a] font-bold shrink-0 bg-[#c59b4c]/12 px-2 py-0.5 rounded border border-[#c59b4c]/25">
                {collectedCount}/{totalRequired} Water Clues
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1.5">
              <span className="text-[11px] text-[#cfc4b3] font-medium truncate flex items-center gap-1">
                <span className="text-[#9b9183]">Target:</span> Eastern Rock-Cut Reservoir
              </span>
              {isMissionReady && (
                <button
                  onClick={() => { soundManager.playClick(); onLaunchReconstruction(); }}
                  className="hud-btn-bronze px-3 py-1 rounded-lg font-archaeological font-bold text-[11px] tracking-wider flex items-center gap-1.5 cursor-pointer transition-all animate-pulse shrink-0"
                  title="Test Reconstructed Water Flow [T]"
                >
                  <Droplets className="w-3.5 h-3.5 fill-[#e6b86a] text-[#e6b86a]" />
                  <span>TEST WATER FLOW</span>
                  <kbd className="px-1 py-0.2 rounded bg-black/60 text-[9px] font-mono text-[#e6b86a] border border-[#c59b4c]/30">T</kbd>
                </button>
              )}
            </div>

            {/* Subtle Burnished Bronze Progress Bar */}
            <div className="mt-2.5 h-1.5 rounded-full bg-[#0a0e16] border border-[#c59b4c]/20 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#7a5420] via-[#c59b4c] to-[#e6b86a] transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(197,155,76,0.4)]"
                style={{ width: `${Math.min(100, (collectedCount / totalRequired) * 100)}%` }}
              />
            </div>
          </div>

        </div>

        {/* Top-Right: Evidence Counter, Archive, Controls & Compact Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Evidence Counter */}
          <div className="hud-panel-subtle flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono">
            <Layers className="w-3.5 h-3.5 text-[#c59b4c]" />
            <span className="text-[#9b9183] hidden sm:inline">Evidence</span>
            <span className="text-[#eae1d2] font-bold">{totalEvidenceCount}/10</span>
          </div>

          {/* Archive Counter */}
          <div className="hud-panel-subtle flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5 text-[#88b8cc]" />
            <span className="text-[#9b9183] hidden sm:inline">Archive</span>
            <span className="text-[#cde4ee] font-bold">{archiveCount}/4</span>
          </div>

          {/* Controls Help Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowControlsModal(true);
            }}
            className="hud-btn-glass flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer"
            title="View Game Controls [H]"
          >
            <Keyboard className="w-3.5 h-3.5 text-[#c59b4c]" />
            <span className="hidden sm:inline">CONTROLS</span>
          </button>

          {/* Field Notes HUD Trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              if (onOpenFieldNotes) onOpenFieldNotes();
            }}
            className="hud-btn-glass flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer group"
            title="Open Archaeological Field Notes Journal [N]"
          >
            <FileText className="w-3.5 h-3.5 text-[#e6b86a] group-hover:scale-110 transition-transform" />
            <span className="text-[#9b9183] hidden md:inline">Field Notes</span>
            <span className="text-[#eae1d2] font-bold">{fieldNotesCount}</span>
            <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-black/50 border border-[#c59b4c]/25 text-[9px] text-[#e6b86a] ml-0.5">N</kbd>
          </button>

          {/* Zoom & Camera Reset */}
          <div className="hud-panel-subtle flex items-center gap-1 p-1 rounded-xl">
            <button
              onClick={() => { soundManager.playClick(); onZoomIn(); }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#cfc4b3] hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { soundManager.playClick(); onZoomOut(); }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#cfc4b3] hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { soundManager.playClick(); onResetCamera(); }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#cfc4b3] hover:text-white cursor-pointer"
              title="Reset Camera"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* CENTER ZONE: Contextual In-World Archaeological Interaction Prompt */}
      {nearbyClue ? (
        <div className="pointer-events-auto self-center my-auto animate-in zoom-in-95 duration-150">
          <div className="hud-panel corner-bracket flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#c59b4c]/40 text-[#eae1d2]">
            {/* Glowing Archaeological Diamond Glyphs */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7a5420] to-[#251808] border border-[#c59b4c]/50 flex items-center justify-center text-[#e6b86a] shadow-[0_0_12px_rgba(197,155,76,0.35)] animate-pulse">
              <Sparkles className="w-4 h-4 text-[#e6b86a]" />
            </div>

            <div className="pr-2">
              <span className="text-[10px] font-mono uppercase text-[#c59b4c] block leading-none mb-0.5 tracking-wider">
                {nearbyClue.type}
              </span>
              <h2 className="font-archaeological font-bold text-sm text-[#f7efe4] tracking-wide">
                {nearbyClue.name}
              </h2>
            </div>

            <button
              onClick={() => { soundManager.playClick(); onInspectClue(nearbyClue.id); }}
              className="hud-btn-bronze px-3.5 py-1.5 rounded-lg font-archaeological font-bold text-xs tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Examine Clue</span>
              <kbd className="px-1.5 py-0.2 rounded bg-black/60 border border-[#c59b4c]/30 font-mono text-[10px] font-bold text-[#e6b86a]">
                E
              </kbd>
            </button>
          </div>
        </div>
      ) : (
        <div />
      )}

      {/* BOTTOM ZONE: Minimap Compass, Sector Quick Jumps & Navigation */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 w-full max-w-7xl mx-auto">
        
        {/* Bottom Left: Authentic Archaeological Compass Radar & Soundscape */}
        <div className="hud-panel corner-bracket pointer-events-auto flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs">
          
          {/* Compass Rose */}
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-full bg-black/70 border border-[#c59b4c]/40 flex items-center justify-center shadow-inner">
              <Navigation className="w-3.5 h-3.5 text-[#e6b86a] transform -rotate-45" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#c59b4c] block uppercase tracking-wider font-semibold">
                KHĀDIR BET 23.88° N
              </span>
              <span className="font-mono text-[11px] text-[#cfc4b3] flex items-center gap-1">
                <Music className="w-3 h-3 text-[#88b8cc] animate-pulse" />
                <span className="truncate max-w-[180px]">{getZoneAudioInfo(currentZone)}</span>
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-white/10 hidden md:block" />

          {/* Water Channel Simulation Status */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleWaterFlow();
            }}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer transition-colors ${
              isWaterFlowing
                ? 'bg-teal-950/50 border-teal-400/60 text-teal-200 animate-pulse shadow-[0_0_12px_rgba(20,184,166,0.25)]'
                : 'bg-black/50 border-[#c59b4c]/20 text-[#9b9183] hover:text-[#eae1d2]'
            }`}
            title="Toggle Water Channel Flow Simulation"
          >
            <Droplets className="w-3.5 h-3.5 text-teal-400" />
            <span>Water Flow: {isWaterFlowing ? 'ACTIVE' : 'IDLE'}</span>
          </button>

        </div>

        {/* Bottom Center: Minimalist Exploration Controls Banner */}
        <div className="hud-panel-subtle pointer-events-auto hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[11px] font-mono text-[#9b9183]">
          <span>Controls: <kbd className="px-1 py-0.2 rounded bg-black/50 border border-white/10 text-[#eae1d2]">WASD</kbd> Move · <kbd className="px-1 py-0.2 rounded bg-black/50 border border-white/10 text-[#eae1d2]">Right Drag</kbd> Orbit · <kbd className="px-1 py-0.2 rounded bg-black/50 border border-white/10 text-[#eae1d2]">Click</kbd> Target · <kbd className="px-1 py-0.2 rounded bg-black/50 border border-white/10 text-[#eae1d2]">N</kbd> Notes</span>
        </div>

        {/* Bottom Right: Compact Camera Mode Navigation Switcher */}
        <div className="hud-panel-subtle pointer-events-auto flex items-center gap-1 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => { soundManager.playClick(); onSetCameraMode('third_person'); }}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              cameraMode === 'third_person' 
                ? 'bg-[#7a5420] text-[#f7efe4] font-semibold shadow-sm border border-[#e6b86a]/40' 
                : 'text-[#9b9183] hover:text-[#eae1d2]'
            }`}
            title="Third-Person Explorer Camera"
          >
            EXPLORER
          </button>
          <button
            onClick={() => { soundManager.playClick(); onSetCameraMode('isometric'); }}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              cameraMode === 'isometric' 
                ? 'bg-[#7a5420] text-[#f7efe4] font-semibold shadow-sm border border-[#e6b86a]/40' 
                : 'text-[#9b9183] hover:text-[#eae1d2]'
            }`}
            title="Elevated Isometric Tactical Camera"
          >
            ISOMETRIC
          </button>
          <button
            onClick={() => { soundManager.playClick(); onSetCameraMode('drone'); }}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              cameraMode === 'drone' 
                ? 'bg-[#7a5420] text-[#f7efe4] font-semibold shadow-sm border border-[#e6b86a]/40' 
                : 'text-[#9b9183] hover:text-[#eae1d2]'
            }`}
            title="Aerial Drone Survey View"
          >
            DRONE
          </button>
        </div>

      </div>

      {/* Controls Reference Card Modal */}
      {showControlsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md pointer-events-auto animate-in fade-in duration-150">
          <div className="stone-panel corner-bracket w-full max-w-sm rounded-2xl p-5 border border-[#c59b4c]/40 space-y-4 text-[#eae1d2]">
            <div className="flex items-center justify-between pb-3 border-b border-[#c59b4c]/20">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#e6b86a]" />
                <h3 className="font-archaeological font-bold text-sm tracking-wide text-[#e6b86a]">
                  GAME CONTROLS
                </h3>
              </div>
              <button
                onClick={() => setShowControlsModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-black/60 border border-[#c59b4c]/15">
                <span className="text-[#9b9183]">Move Character</span>
                <span className="text-[#e6b86a] font-bold">W A S D / Arrow Keys</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-black/60 border border-[#c59b4c]/15">
                <span className="text-[#9b9183]">Look / Camera Orbit</span>
                <span className="text-[#e6b86a] font-bold">Mouse / Pointer Lock</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-black/60 border border-[#c59b4c]/15">
                <span className="text-[#9b9183]">Sprint</span>
                <span className="text-[#e6b86a] font-bold">Shift</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-black/60 border border-[#c59b4c]/15">
                <span className="text-[#9b9183]">Jump</span>
                <span className="text-[#e6b86a] font-bold">Space</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-black/60 border border-[#c59b4c]/15">
                <span className="text-[#9b9183]">Examine Clue</span>
                <span className="text-[#c59b4c] font-bold">E</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-black/60 border border-[#c59b4c]/15">
                <span className="text-[#9b9183]">Test Water Flow</span>
                <span className="text-teal-300 font-bold">T</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-black/60 border border-[#c59b4c]/15">
                <span className="text-[#9b9183]">Field Notes</span>
                <span className="text-[#e6b86a] font-bold">N</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-black/60 border border-[#c59b4c]/15">
                <span className="text-[#9b9183]">Pause Menu</span>
                <span className="text-[#cfc4b3] font-bold">Esc</span>
              </div>
            </div>

            <button
              onClick={() => setShowControlsModal(false)}
              className="hud-btn-bronze w-full py-2 rounded-xl font-archaeological font-bold text-xs tracking-wider transition-colors cursor-pointer"
            >
              RESUME GAME
            </button>
          </div>
        </div>
      )}

      {/* Mission Complete Overlay (Hydraulic Network Restored!) */}
      {isMissionCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md pointer-events-auto animate-in zoom-in-95 duration-300">
          <div className="stone-panel corner-bracket w-full max-w-lg rounded-2xl p-6 sm:p-8 border border-[#c59b4c]/40 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#7a5420] to-[#251808] border border-[#c59b4c]/60 flex items-center justify-center shadow-lg shadow-black/80 animate-pulse">
              <CheckCircle2 className="w-8 h-8 text-[#e6b86a]" />
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#c59b4c] block mb-1">
                MISSION 01 COMPLETE
              </span>
              <h2 className="font-archaeological font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#e6b86a] via-[#f7efe4] to-[#c59b4c] tracking-wide">
                Hydraulic Network Restored!
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#cfc4b3] leading-relaxed max-w-md mx-auto">
              Monsoon floodwaters successfully impounded at the <strong className="text-[#eae1d2]">Manhar Check-Dam</strong>, filtered of silt in the <strong className="text-[#eae1d2]">Desilting Basin</strong>, and channeled through cut-stone masonry into the <strong className="text-[#eae1d2]">Great Eastern Rock-Cut Reservoir</strong>!
            </p>

            <div className="p-3 rounded-xl bg-black/60 border border-[#c59b4c]/25 flex items-center justify-around text-xs font-mono">
              <div>
                <span className="text-[#9b9183] block text-[10px]">SCORE REWARD</span>
                <span className="text-[#e6b86a] font-bold text-sm">+250 PTS</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-[#9b9183] block text-[10px]">NEW BADGE</span>
                <span className="text-[#cfc4b3] font-bold text-sm">Hydraulic Master</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-[#9b9183] block text-[10px]">KNOWLEDGE</span>
                <span className="text-[#88b8cc] font-bold text-sm">Water Systems</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onLaunchReconstruction();
                }}
                className="hud-btn-bronze flex-1 py-3 rounded-xl font-archaeological font-bold text-xs tracking-wider cursor-pointer"
              >
                FLOW ANALYSIS LAB
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
