import React, { useState } from 'react';
import { EvidenceItem } from '../../types/game';
import { EVIDENCE_DATABASE } from '../../data/evidence';
import { EvidenceCardItem } from './EvidenceCardItem';
import { 
  X, 
  Layers, 
  Filter, 
  CheckCircle, 
  Sparkles, 
  Search,
  BookOpen
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  collectedEvidenceIds: string[];
  activeMissionId: string | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<Props> = ({
  collectedEvidenceIds,
  activeMissionId,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'water' | 'craft'>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  const collectedItems = collectedEvidenceIds
    .map(id => EVIDENCE_DATABASE[id])
    .filter(Boolean);

  const filteredItems = collectedItems.filter(item => {
    if (filter === 'water') return item.category === 'Water Management';
    if (filter === 'craft') return item.category === 'Craft & Technology';
    return true;
  });

  const totalPossibleEvidence = Object.keys(EVIDENCE_DATABASE).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="stone-panel corner-bracket w-full max-w-5xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden border border-[#c59b4c]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#c59b4c]/20 flex items-center justify-between bg-[#060a12]/75 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7a5420] to-[#251808] border border-[#c59b4c]/50 flex items-center justify-center text-[#e6b86a] shadow-[0_0_12px_rgba(197,155,76,0.25)]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-archaeological font-bold text-lg text-[#f7efe4] tracking-wide">
                  ARCHAEOLOGICAL EVIDENCE BOARD
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  EMPIRICAL CORPUS
                </span>
              </div>
              <p className="text-xs text-[#9b9183]">
                Field artifacts, stratified architectural features & published Harappan citations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-mono text-[#9b9183] uppercase tracking-wider block">
                EVIDENCE FOUND
              </span>
              <span className="font-mono text-base font-bold text-[#e6b86a]">
                {collectedEvidenceIds.length} <span className="text-[#7d7467] text-xs">/ {totalPossibleEvidence}</span>
              </span>
            </div>

            <button
              onClick={onClose}
              className="hud-btn-glass p-2 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#060a12]/90 border-b border-[#c59b4c]/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#c59b4c]" />
            <span className="text-[#9b9183] font-medium">Filter Category:</span>
            <button
              onClick={() => { soundManager.playClick(); setFilter('all'); }}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#7a5420] text-[#f7efe4] font-semibold border border-[#e6b86a]/40 shadow-sm'
                  : 'hud-btn-glass text-[#cfc4b3]'
              }`}
            >
              All Clues ({collectedItems.length})
            </button>
            <button
              onClick={() => { soundManager.playClick(); setFilter('water'); }}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                filter === 'water'
                  ? 'bg-[#7a5420] text-[#f7efe4] font-semibold border border-[#e6b86a]/40 shadow-sm'
                  : 'hud-btn-glass text-[#cfc4b3]'
              }`}
            >
              Water System
            </button>
            <button
              onClick={() => { soundManager.playClick(); setFilter('craft'); }}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                filter === 'craft'
                  ? 'bg-[#7a5420] text-[#f7efe4] font-semibold border border-[#e6b86a]/40 shadow-sm'
                  : 'hud-btn-glass text-[#cfc4b3]'
              }`}
            >
              Craft & Beads
            </button>
          </div>

          <div className="text-[11px] text-[#7d7467] italic font-mono">
            *Click any clue card to expand stratigraphy and published literature.
          </div>
        </div>

        {/* Board Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#04070c]/70 bg-sandstone-pattern">
          {filteredItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#c97a3e]/20 rounded-2xl">
              <Layers className="w-12 h-12 text-[#c97a3e]/40 mb-3" />
              <h4 className="font-archaeological font-bold text-base text-[#e6a86c]">
                No Clues Found in This Sector Yet
              </h4>
              <p className="text-xs text-[#a0907d] max-w-sm mt-1">
                Explore the excavation sites, inspect stone ruins, and speak with archaeological guides to collect empirical evidence.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(evidence => (
                <EvidenceCardItem
                  key={evidence.id}
                  evidence={evidence}
                  onInspect={() => setSelectedEvidence(evidence)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3 sm:p-4 bg-[#0a0f16] border-t border-[#d4a373]/15 flex items-center justify-between text-xs text-[#8e7a68]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#c97a3e]" />
            <span>Archaeological Grounding: ASI Reports, Bisht (2015), Singh et al. (2020), Prabhakar (2016).</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#c97a3e] hover:bg-[#b56b32] text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Back to Investigation
          </button>
        </div>

      </div>
    </div>
  );
};
