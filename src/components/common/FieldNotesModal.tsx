import React, { useState } from 'react';
import { FieldNote, SessionMetadata, FieldNoteCategory } from '../../types/game';
import { 
  FileText, 
  X, 
  Plus, 
  Star, 
  Trash2, 
  Edit3, 
  Check, 
  Copy, 
  MapPin, 
  Compass, 
  Calendar, 
  Sparkles,
  Search,
  Filter,
  Droplets,
  Layers,
  Tag,
  Share2
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  sessionMetadata: SessionMetadata;
  activeSector?: string;
  onClose: () => void;
  onAddNote: (note: {
    sector: string;
    coordinates?: string;
    category: FieldNoteCategory;
    content: string;
    starred?: boolean;
  }) => void;
  onUpdateNote: (id: string, content: string, category?: FieldNoteCategory) => void;
  onDeleteNote: (id: string) => void;
  onToggleStar: (id: string) => void;
}

const CATEGORIES: FieldNoteCategory[] = [
  'Hydraulics', 
  'Masonry', 
  'Stratigraphy', 
  'Artifact', 
  'General'
];

const QUICK_OBSERVATIONS: { category: FieldNoteCategory; label: string; text: string }[] = [
  {
    category: 'Hydraulics',
    label: 'Lime Plaster Water-Tight Joint',
    text: 'Identified lime-gypsum plaster sealant packed between dressed sandstone blocks to prevent seepage in reservoir basin.'
  },
  {
    category: 'Hydraulics',
    label: 'Settling Basin Silt Trap',
    text: 'Siltation chamber inlet shows gravel sediment accumulation, indicating effective debris filtration prior to main reservoir storage.'
  },
  {
    category: 'Masonry',
    label: 'Chiseled Bedrock Quarry Trace',
    text: 'Deep horizontal tool gouges visible along eastern scarp; reservoir was excavated directly out of underlying sandstone bedrock.'
  },
  {
    category: 'Stratigraphy',
    label: 'Monsoon Runoff Spillway',
    text: 'Cascade step series exhibits water-worn polish on limestone slabs, confirming high-velocity seasonal monsoon overflow discharge.'
  },
  {
    category: 'Artifact',
    label: 'Steatite Inscription Fragment',
    text: 'Uncovered weathered sign-symbol carving resembling Harappan script glyphs on fallen gateway ashlar lintel.'
  }
];

export const FieldNotesModal: React.FC<Props> = ({
  sessionMetadata,
  activeSector = 'Eastern Rock-Cut Reservoir',
  onClose,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onToggleStar,
}) => {
  const [newContent, setNewContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FieldNoteCategory>('Hydraulics');
  const [sectorInput, setSectorInput] = useState(activeSector);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  const handleSaveNewNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onAddNote({
      sector: sectorInput.trim() || activeSector,
      coordinates: '23.88° N, 70.21° E',
      category: selectedCategory,
      content: newContent,
      starred: false,
    });

    setNewContent('');
  };

  const handleStartEdit = (note: FieldNote) => {
    soundManager.playClick();
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string) => {
    if (!editContent.trim()) return;
    onUpdateNote(id, editContent);
    setEditingNoteId(null);
    setEditContent('');
  };

  const handleExportSessionLog = () => {
    soundManager.playClick();
    const logHeader = `# DHOLAVIRA ARCHAEOLOGICAL SURVEY — FIELD OBSERVATION DOSSIER\nSession ID: ${sessionMetadata.sessionId}\nSurvey Date: ${new Date(sessionMetadata.startedAt).toLocaleString()}\nActive Excavation Sector: ${sessionMetadata.lastExploredSector || activeSector}\nTotal Recorded Observations: ${sessionMetadata.totalObservationsRecorded}\n\n---\n\n`;
    
    const notesBody = sessionMetadata.fieldNotes.map((n, idx) => {
      const dateStr = new Date(n.timestamp).toLocaleTimeString();
      return `### Observation #${idx + 1} [${n.category.toUpperCase()}] ${n.starred ? '★ STARRED' : ''}\n- Sector: ${n.sector} (${n.coordinates || '23.88° N, 70.21° E'})\n- Time: ${dateStr}\n- Notes: ${n.content}\n`;
    }).join('\n');

    const fullDossier = logHeader + notesBody;
    navigator.clipboard.writeText(fullDossier);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  // Filter notes
  const filteredNotes = sessionMetadata.fieldNotes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || note.category === filterCategory;
    const matchesStar = !onlyStarred || note.starred;
    return matchesSearch && matchesCategory && matchesStar;
  });

  const getCategoryColor = (cat: FieldNoteCategory) => {
    switch (cat) {
      case 'Hydraulics': return 'text-sky-400 bg-sky-950/60 border-sky-600/40';
      case 'Masonry': return 'text-amber-400 bg-amber-950/60 border-amber-600/40';
      case 'Stratigraphy': return 'text-emerald-400 bg-emerald-950/60 border-emerald-600/40';
      case 'Artifact': return 'text-purple-400 bg-purple-950/60 border-purple-600/40';
      default: return 'text-stone-300 bg-stone-900 border-stone-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="stone-panel corner-bracket relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-[#c59b4c]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-[#eae1d2]">
        
        {/* Top Header / Field Docket Title */}
        <div className="flex items-center justify-between p-4 sm:px-6 bg-[#060a12]/85 border-b border-[#c59b4c]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7a5420] to-[#251808] border border-[#c59b4c]/50 flex items-center justify-center text-[#e6b86a] shadow-[0_0_12px_rgba(197,155,76,0.25)]">
              <FileText className="w-5 h-5 text-[#e6b86a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-archaeological font-bold text-base sm:text-lg text-[#f7efe4] tracking-wide">
                  FIELD NOTES & OBSERVATIONS
                </h2>
                <span className="font-mono text-[10px] bg-black/50 text-[#c59b4c] px-2 py-0.5 rounded border border-[#c59b4c]/25">
                  {sessionMetadata.sessionId}
                </span>
              </div>
              <p className="text-xs text-[#9b9183] flex items-center gap-2">
                <span>Sector: <span className="text-[#cfc4b3]">{activeSector}</span></span>
                <span>•</span>
                <span className="font-mono text-[11px] text-[#e6b86a]">23.88° N, 70.21° E</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSessionLog}
              className="hud-btn-glass flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer"
              title="Export Field Dossier to Clipboard"
            >
              {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#e6b86a]" />}
              <span className="hidden sm:inline">{copiedToast ? 'COPIED!' : 'EXPORT DOSSIER'}</span>
            </button>
            <button
              onClick={onClose}
              className="hud-btn-glass p-2 rounded-lg text-[#9b9183] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Columns (New Note Entry & Existing Notes Log) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-6 bg-[#04070c]/80 bg-sandstone-pattern">
          
          {/* Left Column: Jot Down New Observation Form (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-4 rounded-xl hud-panel border border-[#c59b4c]/25 shadow-md">
              <h3 className="font-archaeological font-bold text-xs uppercase tracking-wider text-[#e6b86a] mb-3 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-[#c59b4c]" />
                <span>Log New In-Field Observation</span>
              </h3>

              <form onSubmit={handleSaveNewNote} className="space-y-3">
                {/* Sector location tag input */}
                <div>
                  <label className="block text-[11px] font-mono text-[#9b9183] mb-1">
                    Excavation Sector / Feature
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#c59b4c] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={sectorInput}
                      onChange={e => setSectorInput(e.target.value)}
                      placeholder="e.g. Eastern Rock-Cut Reservoir"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-black/60 border border-[#c59b4c]/20 text-[#eae1d2] focus:outline-none focus:border-[#c59b4c] transition-colors"
                    />
                  </div>
                </div>

                {/* Category selector pills */}
                <div>
                  <label className="block text-[11px] font-mono text-[#9b9183] mb-1.5">
                    Archaeological Focus Area
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { soundManager.playClick(); setSelectedCategory(cat); }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-[#7a5420] text-[#f7efe4] font-bold border-[#e6b86a]/40 shadow-sm'
                            : 'hud-btn-glass text-[#cfc4b3]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Freeform Note Textarea */}
                <div>
                  <label className="block text-[11px] font-mono text-[#a0907d] mb-1">
                    Archaeological Observations & Technical Hypotheses
                  </label>
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder="Describe stone dressing, joint binders, water marks, sluice mechanics, or soil stratification..."
                    className="w-full p-3 text-xs rounded-lg bg-black/60 border border-white/15 text-stone-200 focus:outline-none focus:border-[#ffd9a8] transition-colors resize-none placeholder-stone-500 font-sans"
                  />
                  <div className="flex justify-between items-center text-[10px] font-mono text-stone-500 mt-0.5">
                    <span>Press record to store into session metadata</span>
                    <span>{newContent.length} chars</span>
                  </div>
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  disabled={!newContent.trim()}
                  className="hud-btn-bronze w-full py-2 px-4 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed font-archaeological font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>RECORD FIELD NOTE</span>
                </button>
              </form>
            </div>

            {/* Quick-Prompt Suggestions (Archaeological Templates) */}
            <div className="hud-panel-subtle p-3.5 rounded-xl border border-[#c59b4c]/20">
              <span className="text-[11px] font-mono text-[#e6b86a] uppercase tracking-wider block mb-2 font-semibold">
                Quick Observation Starters
              </span>
              <div className="space-y-1.5">
                {QUICK_OBSERVATIONS.map((obs, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedCategory(obs.category);
                      setNewContent(prev => prev ? `${prev} ${obs.text}` : obs.text);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-black/40 hover:bg-black/70 border border-[#c59b4c]/10 hover:border-[#c59b4c]/40 transition-all text-[11px] text-[#cfc4b3] hover:text-[#f7efe4] cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-[#c59b4c] mb-0.5">
                      <span>{obs.label}</span>
                      <span className="text-[#9b9183] group-hover:text-[#cfc4b3]">+ Insert</span>
                    </div>
                    <p className="line-clamp-1 text-[#9b9183] group-hover:text-[#eae1d2]">
                      {obs.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Observation Log & Session Metadata Dossier (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            
            {/* Search & Filter Toolbar */}
            <div className="p-3 rounded-xl hud-panel-subtle border border-[#c59b4c]/20 flex flex-wrap items-center justify-between gap-2.5">
              
              {/* Search input */}
              <div className="relative flex-1 min-w-[160px]">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter observations..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-black/50 border border-white/10 text-stone-200 focus:outline-none focus:border-[#c97a3e]"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-mono">
                {['All', ...CATEGORIES].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { soundManager.playClick(); setFilterCategory(cat); }}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-[#c97a3e]/25 text-[#ffd9a8] border border-[#c97a3e]/50 font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                <button
                  onClick={() => { soundManager.playClick(); setOnlyStarred(p => !p); }}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    onlyStarred
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50'
                      : 'text-stone-500 hover:text-stone-300'
                  }`}
                  title="Show only starred observations"
                >
                  <Star className={`w-3.5 h-3.5 ${onlyStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>

            </div>

            {/* List of Saved Field Notes */}
            <div className="flex-1 space-y-2.5 min-h-[300px]">
              {filteredNotes.length === 0 ? (
                <div className="h-64 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-6 text-stone-500">
                  <FileText className="w-8 h-8 mb-2 text-stone-600" />
                  <p className="text-sm font-medium text-stone-400">No matching observations found</p>
                  <p className="text-xs text-stone-600 mt-1 max-w-xs">
                    Write down notes on stone jointing, sluice steps, or excavation layers to document your Khadir Bet findings.
                  </p>
                </div>
              ) : (
                filteredNotes.map(note => {
                  const isEditing = editingNoteId === note.id;
                  const dateStr = new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={note.id}
                      className="p-3.5 rounded-xl bg-[#141b27]/80 hover:bg-[#161e2b] border border-white/10 hover:border-[#c97a3e]/30 transition-all shadow-sm group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getCategoryColor(note.category)}`}>
                            {note.category}
                          </span>
                          <span className="text-xs font-medium text-stone-300 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#c97a3e]" />
                            <span>{note.sector}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-stone-500">
                          <span className="font-mono text-[10px] text-stone-400">
                            {dateStr}
                          </span>
                          <button
                            onClick={() => onToggleStar(note.id)}
                            className="p-1 text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
                            title={note.starred ? 'Unstar' : 'Star observation'}
                          >
                            <Star className={`w-3.5 h-3.5 ${note.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleStartEdit(note)}
                            className="p-1 text-stone-400 hover:text-sky-400 transition-colors cursor-pointer"
                            title="Edit Note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteNote(note.id)}
                            className="p-1 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete Note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content view / edit mode */}
                      {isEditing ? (
                        <div className="space-y-2 mt-2">
                          <textarea
                            rows={3}
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            className="w-full p-2.5 text-xs rounded-lg bg-black/60 border border-sky-500/50 text-stone-100 focus:outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-2.5 py-1 rounded bg-black/40 text-stone-400 hover:text-white text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(note.id)}
                              className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-stone-200 leading-relaxed font-sans pl-0.5">
                          {note.content}
                        </p>
                      )}

                      {note.coordinates && (
                        <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-stone-500">
                          <span>Survey Grid: {note.coordinates}</span>
                          <span className="text-[#a0907d]">Field Observation Log</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Session Metadata Summary Banner */}
            <div className="p-3 rounded-xl bg-black/60 border border-[#c97a3e]/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#a0907d]">
              <div className="flex items-center gap-4">
                <span>Session Observations: <strong className="text-[#ffd9a8]">{sessionMetadata.totalObservationsRecorded}</strong></span>
                <span>Active Notes: <strong className="text-sky-300">{sessionMetadata.fieldNotes.length}</strong></span>
              </div>
              <span className="text-[11px] text-stone-500">
                Auto-saved in Session Metadata
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
