import React, { useState } from 'react';
import { DIALOGUES } from '../../data/dialogue';
import { DialogueBox } from '../common/DialogueBox';
import { Compass, MapPin, Wind, Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Props {
  onProceedToMap: () => void;
}

export const IntroCutscene: React.FC<Props> = ({ onProceedToMap }) => {
  const [dialogueDone, setDialogueDone] = useState(false);

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-b from-[#0e141f] via-[#141b27] to-[#090d14] text-[#f1ece1] overflow-hidden">
      
      {/* Background Archaeological Field Camp Aesthetic */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full object-cover" viewBox="0 0 1000 600" fill="none">
          {/* Desert Dunes / Salt Beds */}
          <path d="M0 450 Q 250 400 500 440 T 1000 420 L 1000 600 L 0 600 Z" fill="#182232" />
          <path d="M0 500 Q 350 470 700 520 T 1000 490 L 1000 600 L 0 600 Z" fill="#1f2c40" />
          {/* Excavation Grid Markers / Theodolites */}
          <line x1="200" y1="360" x2="200" y2="480" stroke="#c97a3e" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="450" y1="340" x2="450" y2="470" stroke="#c97a3e" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="750" y1="370" x2="750" y2="490" stroke="#c97a3e" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="200" cy="360" r="4" fill="#f4ba82" />
          <circle cx="450" cy="340" r="4" fill="#f4ba82" />
          <circle cx="750" cy="370" r="4" fill="#f4ba82" />
        </svg>
      </div>

      {/* Narrative Header */}
      <div className="relative z-10 max-w-4xl mx-auto w-full pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b2536] border border-[#c97a3e]/30 text-xs text-[#e6a86c] mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>Khadir Bet Island, Great Rann of Kutch (23°53′N 70°13′E)</span>
        </div>

        <h2 className="font-archaeological font-black text-2xl sm:text-4xl text-[#f5ebd9] tracking-wide">
          EXPEDITION LOG: ENTRY #01
        </h2>
        <p className="text-xs sm:text-sm text-[#a0907d] mt-1 font-mono">
          Archaeological Survey of India & International Serious-Game Research Field Unit
        </p>
      </div>

      {/* Narrative Context Card */}
      <div className="relative z-10 max-w-2xl mx-auto w-full my-6 p-6 rounded-2xl stone-panel border border-[#c97a3e]/30 space-y-4">
        <p className="text-xs sm:text-sm text-[#ded4c5] leading-relaxed">
          You step out beneath the twilight dusk across the vast salt plains of the Great Rann. Silhouetted against the amber horizon rise the colossal stone bastions and shadowed rock-cut reservoirs of <strong className="text-[#ffd9a8]">Dholavira</strong> (Kotada Timba).
        </p>
        <p className="text-xs sm:text-sm text-[#cfc2af] leading-relaxed">
          Over 4,500 years ago, Harappan architects erected massive stone fortifications, carved deep reservoirs into solid rock, and perfected high-temperature lapidary crafting. But decades of surface erosion have obscured the operational logic of their hydraulic network.
        </p>
        <div className="p-3 rounded-xl bg-[#0f1521]/80 border border-white/5 text-xs text-[#ffd9a8] flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-[#c97a3e] shrink-0" />
          <span>
            Your Directive: Collect physical clues, assemble empirical evidence, and reconstruct their water systems.
          </span>
        </div>
      </div>

      {/* Proceed Button (if dialogue finished or skipped) */}
      <div className="relative z-10 max-w-md mx-auto w-full pb-8 text-center">
        {dialogueDone ? (
          <button
            onClick={() => { soundManager.playClick(); onProceedToMap(); }}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#c97a3e] to-[#a85b24] hover:from-[#d9894d] hover:to-[#b8672e] text-white font-archaeological font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-950/60 transition-all cursor-pointer animate-pulse-slow"
          >
            <span>ENTER DHOLAVIRA CITY SURVEY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Active Dialogue Overlay */}
      {!dialogueDone && (
        <DialogueBox
          dialogues={DIALOGUES.intro_briefing}
          onComplete={() => setDialogueDone(true)}
        />
      )}

    </div>
  );
};
