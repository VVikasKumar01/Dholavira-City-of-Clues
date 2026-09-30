/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStateManager } from './context/useGameState';
import { NavbarHUD } from './components/common/NavbarHUD';
import { StartScreen } from './components/screens/StartScreen';
import { IntroCutscene } from './components/screens/IntroCutscene';
import { CityMapView } from './components/screens/CityMapView';
import { HowToPlayModal } from './components/screens/HowToPlayModal';
import { Mission1Container } from './components/missions/Mission1Water/Mission1Container';
import { Mission2Container } from './components/missions/Mission2Bead/Mission2Container';
import { EvidenceModal } from './components/common/EvidenceModal';
import { KnowledgeArchiveModal } from './components/common/KnowledgeArchiveModal';
import { SettingsModal } from './components/common/SettingsModal';
import { PauseMenu } from './components/common/PauseMenu';
import { EvaluationModal } from './components/common/EvaluationModal';
import { FieldNotesModal } from './components/common/FieldNotesModal';

export default function App() {
  const {
    state,
    setScreen,
    startNewGame,
    openMission,
    returnToMap,
    collectEvidence,
    completeMission,
    recordPuzzleAttempt,
    useHint,
    recordKnowledgeRead,
    recordPreTestScore,
    recordPostTestScore,
    setDifficulty,
    toggleSound,
    setTextSize,
    openModal,
    closeModal,
    togglePause,
    addFieldNote,
    updateFieldNote,
    deleteFieldNote,
    toggleStarFieldNote,
    resetAllProgress,
  } = useGameStateManager();

  const isStartScreen = state.currentScreen === 'start';
  const hasSaveGame = state.completedMissionIds.length > 0 || state.collectedEvidenceIds.length > 0;

  return (
    <div
      className={`min-h-screen bg-[#0b0f17] text-[#f1ece1] flex flex-col font-sans transition-all ${
        state.settings.textSize === 'large' ? 'text-base' : 'text-sm'
      }`}
    >
      {/* Top Navbar HUD (visible except on title screen) */}
      {!isStartScreen && (
        <NavbarHUD
          state={state}
          onOpenMap={returnToMap}
          onOpenEvidence={() => openModal('evidence')}
          onOpenKnowledge={() => openModal('knowledge')}
          onOpenFieldNotes={() => openModal('fieldNotes')}
          onOpenPause={togglePause}
          onToggleSound={toggleSound}
        />
      )}

      {/* Main Screen Router */}
      <main className="flex-1 flex flex-col">
        {state.currentScreen === 'start' && (
          <StartScreen
            hasSaveGame={hasSaveGame}
            onStartNew={startNewGame}
            onContinue={returnToMap}
            onOpenKnowledge={() => openModal('knowledge')}
            onOpenHowToPlay={() => openModal('howToPlay')}
            onOpenEvaluation={() => openModal('evaluation')}
          />
        )}

        {state.currentScreen === 'intro' && (
          <IntroCutscene onProceedToMap={returnToMap} />
        )}

        {state.currentScreen === 'map' && (
          <CityMapView
            state={state}
            onSelectMission={openMission}
            onOpenKnowledge={() => openModal('knowledge')}
            onOpenEvidence={() => openModal('evidence')}
            onOpenFieldNotes={() => openModal('fieldNotes')}
            onCollectEvidence={collectEvidence}
          />
        )}

        {state.currentScreen === 'mission' && (
          <>
            {state.activeMissionId === 'mission_1_water' && (
              <Mission1Container
                state={state}
                onCollectEvidence={collectEvidence}
                onCompleteMission={completeMission}
                onRecordPuzzleAttempt={recordPuzzleAttempt}
                onUseHint={useHint}
                onOpenEvidence={() => openModal('evidence')}
                onOpenKnowledge={() => openModal('knowledge')}
                onReturnToMap={returnToMap}
              />
            )}

            {state.activeMissionId === 'mission_2_artisan' && (
              <Mission2Container
                state={state}
                onCollectEvidence={collectEvidence}
                onCompleteMission={completeMission}
                onRecordPuzzleAttempt={recordPuzzleAttempt}
                onUseHint={useHint}
                onOpenEvidence={() => openModal('evidence')}
                onOpenKnowledge={() => openModal('knowledge')}
                onReturnToMap={returnToMap}
              />
            )}
          </>
        )}
      </main>

      {/* Modals & Overlays */}
      {state.activeModal === 'evidence' && (
        <EvidenceModal
          collectedEvidenceIds={state.collectedEvidenceIds}
          activeMissionId={state.activeMissionId}
          onClose={closeModal}
        />
      )}

      {state.activeModal === 'knowledge' && (
        <KnowledgeArchiveModal
          unlockedKnowledgeIds={state.unlockedKnowledgeIds}
          onClose={closeModal}
          onReadCard={recordKnowledgeRead}
        />
      )}

      {state.activeModal === 'settings' && (
        <SettingsModal
          settings={state.settings}
          onClose={closeModal}
          onDifficultyChange={setDifficulty}
          onToggleSound={toggleSound}
          onTextSizeChange={setTextSize}
          onResetProgress={resetAllProgress}
        />
      )}

      {state.activeModal === 'howToPlay' && (
        <HowToPlayModal onClose={closeModal} />
      )}

      {state.activeModal === 'evaluation' && (
        <EvaluationModal
          analytics={state.analytics}
          onClose={closeModal}
          onSavePreTestScore={recordPreTestScore}
          onSavePostTestScore={recordPostTestScore}
        />
      )}

      {state.activeModal === 'pause' && (
        <PauseMenu
          onClose={closeModal}
          onOpenEvidence={() => openModal('evidence')}
          onOpenKnowledge={() => openModal('knowledge')}
          onOpenFieldNotes={() => openModal('fieldNotes')}
          onOpenSettings={() => openModal('settings')}
          onOpenEvaluation={() => openModal('evaluation')}
          onReturnToMap={returnToMap}
          hasActiveMission={!!state.activeMissionId}
        />
      )}

      {state.activeModal === 'fieldNotes' && (
        <FieldNotesModal
          sessionMetadata={state.sessionMetadata}
          activeSector={state.sessionMetadata.lastExploredSector || 'Eastern Rock-Cut Reservoir'}
          onClose={closeModal}
          onAddNote={addFieldNote}
          onUpdateNote={updateFieldNote}
          onDeleteNote={deleteFieldNote}
          onToggleStar={toggleStarFieldNote}
        />
      )}
    </div>
  );
}
