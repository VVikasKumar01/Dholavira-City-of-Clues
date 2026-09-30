import React from 'react';
import { GameState } from '../../types/game';
import { MISSIONS_DATABASE } from '../../data/missions';
import archaeologistAvatar from '../../assets/images/dholavira_archaeologist_avatar_1790659225118.jpg';
import { 
  Compass, 
  BookOpen, 
  Layers, 
  Volume2, 
  VolumeX, 
  Menu, 
  Award,
  ChevronRight,
  Sparkles,
  FileText
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  state: GameState;
  onOpenMap: () => void;
  onOpenEvidence: () => void;
  onOpenKnowledge: () => void;
  onOpenFieldNotes?: () => void;
  onOpenPause: () => void;
  onToggleSound: () => void;
}

export const NavbarHUD: React.FC<Props> = ({
  state,
  onOpenMap,
  onOpenEvidence,
  onOpenKnowledge,
  onOpenFieldNotes,
  onOpenPause,
  onToggleSound,
}) => {
  const currentMission = state.activeMissionId ? MISSIONS_DATABASE[state.activeMissionId] : null;
  const isMissionScreen = state.currentScreen === 'mission' && currentMission;

  return (
    <header className="sticky top-0 z-40 w-full px-3 py-2 sm:px-6 sm:py-2.5 bg-[#060a12]/80 backdrop-blur-xl border-b border-[#c59b4c]/20 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Player Profile & Level */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMap}
            title="Return to Dholavira 3D World"
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-[#c59b4c]/40 shadow-md group-hover:scale-105 transition-transform bg-[#090d15]">
              <img
                src={archaeologistAvatar || '/images/dholavira_archaeologist_avatar_1790659225118.jpg'}
                alt="Archaeologist"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/dholavira_archaeologist_avatar_1790659225118.jpg';
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-archaeological font-bold text-xs tracking-wider text-[#e6b86a]">
                  DHOLAVIRA 3D
                </span>
                <span className="text-[10px] text-[#7d7467]">•</span>
                <span className="text-[10px] font-mono text-[#cfc4b3] bg-[#c59b4c]/12 px-1.5 py-0.2 rounded border border-[#c59b4c]/20">
                  {state.settings.difficulty.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-[#9b9183] truncate max-w-[150px]">
                {state.player.title}
              </p>
            </div>
          </button>
        </div>

        {/* Center: Active Mission Info (if in mission) */}
        {isMissionScreen ? (
          <div className="flex-1 max-w-lg mx-2 text-center hidden md:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#090d16]/75 border border-[#c59b4c]/25 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#c59b4c] animate-pulse shadow-[0_0_8px_rgba(197,155,76,0.5)]" />
              <span className="font-archaeological text-xs font-semibold tracking-wide text-[#eae1d2] truncate">
                MISSION #{currentMission.number}: {currentMission.title}
              </span>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs text-[#9b9183]">
            <span className="font-archaeological text-[#c59b4c] text-[11px] tracking-wider">EXCAVATION SECTOR</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#c59b4c]/60" />
            <span className="text-[#cfc4b3] font-medium">
              {state.currentScreen === 'map' ? 'Khādir Bet Settlement Survey' : 'Archaeological Headquarters'}
            </span>
          </div>
        )}

        {/* Right: Quick Tool Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Evidence Board Button */}
          <button
            onClick={onOpenEvidence}
            className="hud-btn-glass flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium cursor-pointer shadow-sm"
            title="Open Evidence Board"
          >
            <Layers className="w-3.5 h-3.5 text-[#c59b4c]" />
            <span className="hidden sm:inline font-mono text-[11px] text-[#cfc4b3]">EVIDENCE</span>
            <span className="font-mono text-[11px] bg-[#c59b4c]/15 text-[#e6b86a] px-1.5 py-0.5 rounded font-bold border border-[#c59b4c]/25">
              {state.collectedEvidenceIds.length}/10
            </span>
          </button>

          {/* Knowledge Archive Button */}
          <button
            onClick={onOpenKnowledge}
            className="hud-btn-glass flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium cursor-pointer shadow-sm"
            title="Open Knowledge Archive"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#88b8cc]" />
            <span className="hidden sm:inline font-mono text-[11px] text-[#cfc4b3]">ARCHIVE</span>
            <span className="font-mono text-[11px] bg-[#88b8cc]/12 text-[#cde4ee] px-1.5 py-0.5 rounded font-bold border border-[#88b8cc]/25">
              {state.unlockedKnowledgeIds.length}/4
            </span>
          </button>

          {/* Field Notes Journal Button */}
          {onOpenFieldNotes && (
            <button
              onClick={onOpenFieldNotes}
              className="hud-btn-glass flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium cursor-pointer shadow-sm"
              title="Open Field Notes & Observations Journal"
            >
              <FileText className="w-3.5 h-3.5 text-[#e6b86a]" />
              <span className="hidden sm:inline font-mono text-[11px] text-[#cfc4b3]">NOTES</span>
              <span className="font-mono text-[11px] bg-[#c59b4c]/15 text-[#e6b86a] px-1.5 py-0.5 rounded font-bold border border-[#c59b4c]/25">
                {state.sessionMetadata.fieldNotes.length}
              </span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="hud-btn-glass p-2 rounded-xl text-[#cfc4b3] hover:text-white transition-colors cursor-pointer"
            title={state.settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {state.settings.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#e6b86a]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#7d7467]" />
            )}
          </button>

          {/* Pause / Menu */}
          <button
            onClick={onOpenPause}
            className="p-2 rounded-xl bg-[#c59b4c]/15 hover:bg-[#c59b4c]/25 border border-[#c59b4c]/35 text-[#e6b86a] hover:text-[#f7efe4] transition-colors cursor-pointer"
            title="Game Menu"
          >
            <Menu className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
