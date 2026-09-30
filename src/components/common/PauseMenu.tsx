import React from 'react';
import { 
  Play, 
  Layers, 
  BookOpen, 
  Sliders, 
  RotateCcw, 
  Map, 
  X, 
  BarChart2, 
  CheckCircle2,
  FileText 
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  onClose: () => void;
  onOpenEvidence: () => void;
  onOpenKnowledge: () => void;
  onOpenFieldNotes?: () => void;
  onOpenSettings: () => void;
  onOpenEvaluation: () => void;
  onRestartMission?: () => void;
  onReturnToMap: () => void;
  hasActiveMission: boolean;
}

export const PauseMenu: React.FC<Props> = ({
  onClose,
  onOpenEvidence,
  onOpenKnowledge,
  onOpenFieldNotes,
  onOpenSettings,
  onOpenEvaluation,
  onRestartMission,
  onReturnToMap,
  hasActiveMission,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="stone-panel corner-bracket w-full max-w-md rounded-2xl p-6 border border-[#c59b4c]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-4 text-[#eae1d2]">
        
        {/* Title */}
        <div className="flex items-center justify-between pb-3 border-b border-[#c59b4c]/20">
          <div>
            <h3 className="font-archaeological font-bold text-lg text-[#f7efe4] tracking-wide">
              EXPEDITION PAUSED
            </h3>
            <span className="text-[11px] font-mono text-[#9b9183]">Dholavira Archaeological Field Headquarters</span>
          </div>
          <button
            onClick={onClose}
            className="hud-btn-glass p-1.5 rounded-lg text-[#9b9183] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buttons List */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onClose}
            className="hud-btn-bronze w-full py-2.5 px-4 rounded-xl font-archaeological font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Play className="w-4 h-4 fill-[#e6b86a] text-[#e6b86a]" />
            <span>RESUME EXPEDITION</span>
          </button>

          <button
            onClick={() => { onClose(); onOpenEvidence(); }}
            className="hud-btn-glass w-full py-2 px-4 rounded-xl text-[#eae1d2] text-xs font-medium flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-[#c59b4c]" />
              <span>Evidence Board</span>
            </div>
            <span className="text-[10px] font-mono text-[#9b9183]">INSPECT</span>
          </button>

          <button
            onClick={() => { onClose(); onOpenKnowledge(); }}
            className="hud-btn-glass w-full py-2 px-4 rounded-xl text-[#eae1d2] text-xs font-medium flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-[#88b8cc]" />
              <span>Knowledge Archive</span>
            </div>
            <span className="text-[10px] font-mono text-[#9b9183]">CITATIONS</span>
          </button>

          {onOpenFieldNotes && (
            <button
              onClick={() => { onClose(); onOpenFieldNotes(); }}
              className="hud-btn-glass w-full py-2 px-4 rounded-xl text-[#eae1d2] text-xs font-medium flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#e6b86a]" />
                <span>Field Notes & Observations</span>
              </div>
              <span className="text-[10px] font-mono text-[#e6b86a] bg-[#c59b4c]/15 px-1.5 py-0.5 rounded border border-[#c59b4c]/25">JOURNAL</span>
            </button>
          )}

          <button
            onClick={() => { onClose(); onOpenSettings(); }}
            className="hud-btn-glass w-full py-2 px-4 rounded-xl text-[#eae1d2] text-xs font-medium flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-[#cfc4b3]" />
              <span>Settings & Difficulty</span>
            </div>
            <span className="text-[10px] font-mono text-[#9b9183]">CONFIG</span>
          </button>

          <button
            onClick={() => { onClose(); onOpenEvaluation(); }}
            className="hud-btn-glass w-full py-2 px-4 rounded-xl text-purple-200 text-xs font-medium flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <span>Evaluation & Learning Metrics</span>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">SIH 2026 JURY</span>
          </button>

          {hasActiveMission && onRestartMission && (
            <button
              onClick={() => { onClose(); onRestartMission(); }}
              className="hud-btn-glass w-full py-2 px-4 rounded-xl text-[#cfc4b3] text-xs font-medium flex items-center gap-2.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-[#c59b4c]" />
              <span>Restart Current Sector</span>
            </button>
          )}

          <button
            onClick={() => { onClose(); onReturnToMap(); }}
            className="hud-btn-glass w-full py-2 px-4 rounded-xl text-[#cfc4b3] text-xs font-medium flex items-center gap-2.5 cursor-pointer transition-colors"
          >
            <Map className="w-4 h-4 text-[#c59b4c]" />
            <span>Return to Dholavira City Map</span>
          </button>
        </div>

      </div>
    </div>
  );
};
