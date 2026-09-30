import React, { useState } from 'react';
import { KnowledgeCard } from '../../types/game';
import { KNOWLEDGE_DATABASE } from '../../data/knowledge';
import { 
  X, 
  BookOpen, 
  Lock, 
  CheckCircle, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  unlockedKnowledgeIds: string[];
  onClose: () => void;
  onReadCard?: (cardId: string) => void;
}

export const KnowledgeArchiveModal: React.FC<Props> = ({
  unlockedKnowledgeIds,
  onClose,
  onReadCard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCardId, setActiveCardId] = useState<string>('k_water_engineering');

  const categories = ['All', 'Water Management', 'Craft & Technology', 'Urban Planning', 'Archaeological Evidence'];

  const allCards = Object.values(KNOWLEDGE_DATABASE);

  const filteredCards = allCards.filter(card => {
    if (selectedCategory === 'All') return true;
    return card.category === selectedCategory;
  });

  const activeCard = KNOWLEDGE_DATABASE[activeCardId] || filteredCards[0];
  const isUnlocked = unlockedKnowledgeIds.includes(activeCard?.id);

  const handleSelectCard = (card: KnowledgeCard) => {
    soundManager.playClick();
    setActiveCardId(card.id);
    if (unlockedKnowledgeIds.includes(card.id) && onReadCard) {
      onReadCard(card.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="stone-panel corner-bracket w-full max-w-5xl h-[88vh] rounded-2xl flex flex-col overflow-hidden border border-[#c59b4c]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#c59b4c]/20 flex items-center justify-between bg-[#060a12]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7a5420] to-[#251808] border border-[#c59b4c]/50 flex items-center justify-center text-[#e6b86a] shadow-[0_0_12px_rgba(197,155,76,0.25)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-archaeological font-bold text-lg text-[#f7efe4] tracking-wide">
                DHOLAVIRA KNOWLEDGE ARCHIVE
              </h3>
              <p className="text-xs text-[#9b9183]">
                Permanent repository of reconstructed Harappan systems, verified evidence, and academic sources.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-mono text-[#9b9183] uppercase tracking-wider block">
                CARDS UNLOCKED
              </span>
              <span className="font-mono text-base font-bold text-[#e6b86a]">
                {unlockedKnowledgeIds.length} <span className="text-[#7d7467] text-xs">/ {allCards.length}</span>
              </span>
            </div>

            <button
              onClick={onClose}
              className="hud-btn-glass p-2 rounded-xl text-[#9b9183] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-4 sm:px-6 py-2 bg-[#060a12]/90 border-b border-[#c59b4c]/15 flex items-center gap-2 overflow-x-auto text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { soundManager.playClick(); setSelectedCategory(cat); }}
              className={`px-3 py-1 rounded-lg font-mono text-xs whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#7a5420] text-[#f7efe4] font-semibold border border-[#e6b86a]/40 shadow-sm'
                  : 'hud-btn-glass text-[#cfc4b3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Master Detail Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#04070c]/70 bg-sandstone-pattern">
          
          {/* Left Cards List */}
          <div className="w-full md:w-80 border-r border-[#c59b4c]/15 bg-[#060a12]/80 overflow-y-auto p-3 space-y-2.5">
            {filteredCards.map(card => {
              const unlocked = unlockedKnowledgeIds.includes(card.id);
              const isSelected = card.id === activeCardId;

              return (
                <div
                  key={card.id}
                  onClick={() => handleSelectCard(card)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-500/60 shadow-md'
                      : unlocked
                      ? 'bg-[#141b27]/70 border-[#38bdf8]/20 hover:border-[#38bdf8]/40'
                      : 'bg-[#0f141d]/40 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono uppercase text-[#e6a86c]">
                      {card.category}
                    </span>
                    {unlocked ? (
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-500 font-mono flex items-center gap-0.5">
                        <Lock className="w-3 h-3" /> LOCKED
                      </span>
                    )}
                  </div>

                  <h4 className="font-archaeological font-bold text-xs text-[#f1ece1] line-clamp-2">
                    {card.title}
                  </h4>

                  <p className="text-[11px] text-[#9b8b7a] line-clamp-2 mt-1">
                    {unlocked ? card.summary : 'Complete mission investigation and reconstruction to unlock this card.'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Card Viewer */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#0b1018]/80">
            {activeCard && isUnlocked ? (
              <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Header info */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-500/30">
                      {activeCard.category}
                    </span>
                    <span className="text-xs text-[#a0907d] font-mono">
                      Origin: {activeCard.missionOrigin}
                    </span>
                  </div>

                  <h2 className="font-archaeological font-extrabold text-2xl text-[#f5ebd9] leading-tight">
                    {activeCard.title}
                  </h2>
                </div>

                {/* Key Concept Box */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 to-[#182333]/40 border border-sky-500/30">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400 block mb-1">
                    ★ Key Archaeological Concept:
                  </span>
                  <p className="text-sm font-medium text-[#ffd9a8] leading-relaxed">
                    {activeCard.keyConcept}
                  </p>
                </div>

                {/* Archaeological Evidence */}
                <div className="p-4 rounded-xl bg-[#121926] border border-[#d4a373]/20">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#e6a86c] block mb-1">
                    Direct Archaeological Evidence at Dholavira:
                  </span>
                  <p className="text-xs text-[#cfc2af] leading-relaxed">
                    {activeCard.archaeologicalEvidence}
                  </p>
                </div>

                {/* Full Explanation Paragraphs */}
                <div className="space-y-3.5 text-xs sm:text-sm text-[#ded4c5] leading-relaxed">
                  {activeCard.fullText.map((p, idx) => (
                    <p key={idx} className="bg-[#101722]/40 p-3 rounded-lg border border-white/5">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Source Citation */}
                <div className="pt-4 border-t border-sky-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs bg-sky-950/20 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="font-mono text-[10px] text-[#a0907d] uppercase block">
                        Source Reference:
                      </span>
                      <span className="text-[#f1ece1] font-serif italic">
                        {activeCard.sourceCitation}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                    Peer-Reviewed Citation
                  </span>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-white/10 flex items-center justify-center text-stone-500 mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="font-archaeological font-bold text-xl text-[#e6a86c]">
                  Knowledge Card Locked
                </h3>
                <p className="text-xs text-[#a0907d] max-w-md mt-2 leading-relaxed">
                  To decipher and archive this entry, you must explore Dholavira's ruins, gather verified clues on the Evidence Board, and physically reconstruct the system puzzle.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0f16] border-t border-white/10 flex items-center justify-between text-xs text-[#8e7a68]">
          <span>SIH 2026 Serious-Game Prototype • Pedagogy grounded in Mortara et al. (2014)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close Archive
          </button>
        </div>

      </div>
    </div>
  );
};
