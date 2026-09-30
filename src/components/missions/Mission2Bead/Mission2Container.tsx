import React, { useState } from 'react';
import { GameState } from '../../../types/game';
import { MISSIONS_DATABASE } from '../../../data/missions';
import { DIALOGUES } from '../../../data/dialogue';
import { DialogueBox } from '../../common/DialogueBox';
import { BeadInvestigationScene } from './BeadInvestigationScene';
import { BeadDrillingPuzzle } from './BeadDrillingPuzzle';
import { BeadExplanationView } from './BeadExplanationView';
import { soundManager } from '../../../utils/audio';

interface Props {
  state: GameState;
  onCollectEvidence: (id: string) => void;
  onCompleteMission: (missionId: string, durationSeconds: number) => void;
  onRecordPuzzleAttempt: (missionId: string) => void;
  onUseHint: (missionId: string) => void;
  onOpenEvidence: () => void;
  onOpenKnowledge: () => void;
  onReturnToMap: () => void;
}

export const Mission2Container: React.FC<Props> = ({
  state,
  onCollectEvidence,
  onCompleteMission,
  onRecordPuzzleAttempt,
  onUseHint,
  onOpenEvidence,
  onOpenKnowledge,
  onReturnToMap,
}) => {
  const mission = MISSIONS_DATABASE.mission_2_artisan;
  
  const [stage, setStage] = useState<'investigate' | 'puzzle' | 'explanation'>('investigate');
  const [showStartDialogue, setShowStartDialogue] = useState(true);
  const [showCompleteDialogue, setShowCompleteDialogue] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [hintLevel, setHintLevel] = useState<number>(0);

  const handleRequestHint = () => {
    if (hintLevel < 3) {
      setHintLevel(hintLevel + 1);
      onUseHint(mission.id);
    }
  };

  const handlePuzzleSuccess = () => {
    setStage('explanation');
    setShowCompleteDialogue(true);
  };

  const handleFinishMission = () => {
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    onCompleteMission(mission.id, elapsedSeconds);
    onReturnToMap();
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-3 py-4 sm:px-6 sm:py-6">
      
      {stage === 'investigate' && (
        <BeadInvestigationScene
          collectedEvidenceIds={state.collectedEvidenceIds}
          onCollectEvidence={onCollectEvidence}
          onProceedToCrafting={() => {
            soundManager.playClick();
            setStage('puzzle');
          }}
          onRequestHint={handleRequestHint}
          currentHintLevel={hintLevel}
          hints={mission.hints}
        />
      )}

      {stage === 'puzzle' && (
        <BeadDrillingPuzzle
          onSuccess={handlePuzzleSuccess}
          onRecordAttempt={() => onRecordPuzzleAttempt(mission.id)}
          onRequestHint={handleRequestHint}
          currentHintLevel={hintLevel}
          hints={mission.hints}
        />
      )}

      {stage === 'explanation' && (
        <BeadExplanationView
          onCompleteMission={handleFinishMission}
          onOpenEvidence={onOpenEvidence}
          onOpenKnowledge={onOpenKnowledge}
        />
      )}

      {/* Start Dialogue with Artisan Shridhar */}
      {showStartDialogue && stage === 'investigate' && (
        <DialogueBox
          dialogues={DIALOGUES.m2_start}
          onComplete={() => setShowStartDialogue(false)}
        />
      )}

      {/* Debrief Dialogue */}
      {showCompleteDialogue && (
        <DialogueBox
          dialogues={DIALOGUES.m2_completed}
          onComplete={() => setShowCompleteDialogue(false)}
        />
      )}

    </div>
  );
};
