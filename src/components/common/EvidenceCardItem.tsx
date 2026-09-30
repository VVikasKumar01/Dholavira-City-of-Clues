import React, { useState } from 'react';
import { EvidenceItem } from '../../types/game';
import { BookOpen, CheckCircle, MapPin, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  evidence: EvidenceItem;
  onInspect?: () => void;
  compact?: boolean;
}

export const EvidenceCardItem: React.FC<Props> = ({ evidence, onInspect, compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    setExpanded(!expanded);
  };

  return (
    <div
      onClick={onInspect}
      className={`hud-panel corner-bracket rounded-xl p-4 transition-all duration-300 hover:scale-[1.01] hover:border-[#c59b4c]/60 cursor-pointer relative group flex flex-col justify-between hover:shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_16px_rgba(197,155,76,0.12)] ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      {/* Top badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-[#c59b4c]/12 text-[#e6b86a] border border-[#c59b4c]/25">
            {evidence.category}
          </span>
          {evidence.verified && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
              <CheckCircle className="w-3 h-3" />
              SOURCE-LINKED
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-archaeological font-bold text-base text-[#f7efe4] group-hover:text-[#e6b86a] transition-colors leading-snug">
          {evidence.title}
        </h4>

        {/* Location tag */}
        <div className="flex items-center gap-1.5 text-xs text-[#9b9183] mt-1.5 mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-[#c59b4c]" />
          <span className="line-clamp-1">{evidence.location}</span>
        </div>

        {/* Short description */}
        <p className="text-xs text-[#cfc4b3] leading-relaxed mb-3">
          {evidence.description}
        </p>
      </div>

      {/* Expanded details or bottom source snippet */}
      <div className="pt-2 border-t border-[#c59b4c]/15">
        {expanded && (
          <div className="space-y-2 mb-3 text-xs bg-black/60 p-3 rounded-lg border border-[#c59b4c]/20 text-[#cfc4b3]">
            <div>
              <span className="text-[#e6b86a] font-semibold block text-[11px] uppercase tracking-wide font-mono">
                Archaeological Excavation Notes:
              </span>
              <p className="mt-0.5 leading-relaxed text-[#eae1d2]">{evidence.archaeologicalNotes}</p>
            </div>
            {evidence.details?.material && (
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#c59b4c]/10">
                <div>
                  <span className="text-[#9b9183] font-mono text-[10px]">Material:</span>
                  <p className="text-[#cfc4b3]">{evidence.details.material}</p>
                </div>
                <div>
                  <span className="text-[#9b9183] font-mono text-[10px]">Period:</span>
                  <p className="text-[#cfc4b3]">{evidence.details.period || 'Mature Harappan'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-[#9b9183]">
          <div className="flex items-center gap-1.5 line-clamp-1 italic text-[10.5px]">
            <BookOpen className="w-3 h-3 text-[#c59b4c] shrink-0" />
            <span className="truncate">{evidence.source}</span>
          </div>

          <button
            onClick={toggleExpand}
            className="flex items-center gap-0.5 text-[#e6b86a] hover:text-[#f7efe4] text-[10px] font-mono tracking-wider ml-2 shrink-0 underline transition-colors"
          >
            {expanded ? (
              <>LESS <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>DETAILS <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
