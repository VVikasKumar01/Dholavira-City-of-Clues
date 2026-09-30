import React from 'react';
import { EvidenceItem } from '../../types/game';
import { 
  CheckCircle, 
  Layers, 
  MapPin, 
  BookOpen, 
  X, 
  Sparkles, 
  ArrowRight,
  Compass,
  Droplets,
  Award
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import reservoirConcept from '../../assets/images/dholavira_reservoir_concept_1790659215477.jpg';

// Image reference generated for Dholavira Reservoir Concept
const RESERVOIR_IMAGE_URL = reservoirConcept || '/images/dholavira_reservoir_concept_1790659215477.jpg';

interface Props {
  evidence: EvidenceItem;
  isCollected: boolean;
  onCollect: (id: string) => void;
  onClose: () => void;
  onLaunchReconstruction?: () => void;
  totalCollectedCount: number;
}

export const ArchaeologicalInspectorModal: React.FC<Props> = ({
  evidence,
  isCollected,
  onCollect,
  onClose,
  onLaunchReconstruction,
  totalCollectedCount,
}) => {
  const isReservoir = evidence.id === 'm1_rock_cut_reservoir';
  const readyForReconstruction = totalCollectedCount >= 5;

  const handleCollectEvidence = () => {
    soundManager.playClueDiscovered();
    onCollect(evidence.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="stone-panel corner-bracket relative max-w-2xl w-full max-h-[92vh] overflow-y-auto rounded-2xl border border-[#c59b4c]/35 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_30px_rgba(197,155,76,0.1)] text-[#eae1d2] p-5 sm:p-7 space-y-5"
      >
        {/* Warm Golden Focus Beam Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c59b4c] to-transparent pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#c59b4c]/20">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-[#9b9183]">
              <span className="text-[#e6b86a] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#c59b4c]/15 border border-[#c59b4c]/30">
                ARCHAEOLOGICAL FIELD DISCOVERY
              </span>
              <span aria-hidden="true" className="text-[#7d7467]">·</span>
              <span className="flex items-center gap-1 text-[#c59b4c]">
                <MapPin className="w-3.5 h-3.5" />
                {evidence.location}
              </span>
            </div>
            <h2 className="font-archaeological font-bold text-xl sm:text-2xl text-[#f7efe4] tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#e6b86a] shrink-0 animate-pulse" />
              <span>{evidence.title}</span>
            </h2>
          </div>

          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="hud-btn-glass p-2 rounded-xl text-[#9b9183] hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close inspection docket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Visual Spotlight */}
        {isReservoir && (
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] border border-[#c59b4c]/30 shadow-inner">
            <img
              src={RESERVOIR_IMAGE_URL}
              alt="Archaeological Reconstruction of Dholavira Eastern Rock-Cut Reservoir"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/dholavira_reservoir_concept_1790659215477.jpg';
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 text-xs text-[#e6b86a] flex items-center justify-between pointer-events-none font-mono">
              <span className="font-archaeological font-semibold text-[#f7efe4]">
                EASTERN ROCK-CUT RESERVOIR COMPLEX (73.4m × 29.3m)
              </span>
              <span className="text-[11px] bg-black/70 px-2 py-0.5 rounded border border-[#c59b4c]/30 text-[#cfc4b3]">
                Stratum IV · Mature Harappan
              </span>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-mono text-[#9b9183] uppercase tracking-wider mb-1">
              Field Description & Structural Analysis
            </h3>
            <p className="text-sm text-[#cfc4b3] leading-relaxed">
              {evidence.description}
            </p>
          </div>

          {/* Excavation Field Notes */}
          <div className="p-4 rounded-xl hud-panel-subtle border border-[#c59b4c]/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-[#c59b4c] font-mono font-semibold">
              <Compass className="w-4 h-4 text-[#c59b4c]" />
              <span>Excavation Survey Notes:</span>
            </div>
            <p className="text-xs text-[#eae1d2] leading-relaxed italic">
              "{evidence.archaeologicalNotes}"
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#9b9183]">
              <BookOpen className="w-3.5 h-3.5 text-[#c59b4c]" />
              <span>Citation: {evidence.source}</span>
            </div>
          </div>

          {/* Metadata Specifications */}
          {evidence.details && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/50 border border-[#c59b4c]/15">
                <span className="text-[#9b9183] block text-[10px] uppercase font-mono">Masonry & Material</span>
                <span className="text-[#e6b86a] font-medium">{evidence.details.material}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-[#c59b4c]/15">
                <span className="text-[#9b9183] block text-[10px] uppercase font-mono">Chronological Period</span>
                <span className="text-[#cfc4b3] font-medium">{evidence.details.period}</span>
              </div>
              <div className="sm:col-span-2 p-3 rounded-xl bg-black/50 border border-[#c59b4c]/15">
                <span className="text-[#9b9183] block text-[10px] uppercase font-mono">Hydraulic Significance</span>
                <span className="text-[#88b8cc] font-medium">{evidence.details.significance}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="pt-3 border-t border-[#c59b4c]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#9b9183]">
            <Droplets className="w-4 h-4 text-teal-400" />
            <span>Water Network Clues: <strong className="text-[#e6b86a]">{totalCollectedCount}/5 required</strong></span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {isCollected ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/35 text-emerald-300 text-xs font-mono">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>CATALOGUED IN EVIDENCE BOARD</span>
              </div>
            ) : (
              <button
                onClick={handleCollectEvidence}
                className="hud-btn-bronze w-full sm:w-auto px-5 py-2.5 rounded-xl font-archaeological font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Layers className="w-4 h-4" />
                <span>CATALOGUE EVIDENCE (+1)</span>
              </button>
            )}

            {onLaunchReconstruction && readyForReconstruction && (
              <button
                onClick={() => { soundManager.playClick(); onClose(); onLaunchReconstruction(); }}
                className="hud-btn-bronze w-full sm:w-auto px-5 py-2.5 rounded-xl font-archaeological font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                <span>RECONSTRUCT HYDRAULIC FLOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
