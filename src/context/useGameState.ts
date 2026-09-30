import { useState, useEffect, useCallback } from 'react';
import { GameState, GameSettings, GameAnalytics, PlayerProfile, Difficulty, FieldNote, SessionMetadata, FieldNoteCategory } from '../types/game';
import { MISSIONS_DATABASE } from '../data/missions';
import { soundManager } from '../utils/audio';

const STORAGE_KEY = 'dholavira_game_state_v1';

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.8,
  difficulty: 'investigator',
  textSize: 'normal',
  highContrast: false,
};

const DEFAULT_ANALYTICS: GameAnalytics = {
  missionsStarted: [],
  missionsCompleted: [],
  puzzleAttempts: {},
  puzzleCompletionTimes: {},
  hintsUsed: {},
  evidenceDiscovered: [],
  knowledgeCardsRead: [],
  totalPlayTimeSeconds: 0,
};

const DEFAULT_PLAYER: PlayerProfile = {
  name: 'Devan / Archaeological Fellow',
  title: 'Junior Field Archaeologist',
  score: 120,
  badges: ['Initiate of Khadir Bet'],
};

const INITIAL_FIELD_NOTES: FieldNote[] = [
  {
    id: 'fn_init_1',
    timestamp: Date.now() - 3600000,
    sector: 'Khadir Bet Settlement Survey Base',
    coordinates: '23.88° N, 70.21° E',
    category: 'General',
    content: 'Expedition established between seasonal streams Manhar (North) and Mansar (South). Initiating systematic survey of rock-cut reservoirs and monumental stone fortifications.',
    starred: true,
  },
  {
    id: 'fn_init_2',
    timestamp: Date.now() - 1800000,
    sector: 'Eastern Rock-Cut Reservoir',
    coordinates: '23.88° N, 70.22° E',
    category: 'Hydraulics',
    content: 'Observed monumental dressed sandstone masonry steps descending over 7 meters into deep quarried bedrock. Feeder channel orientation suggests direct monsoon runoff harvesting.',
    starred: false,
  }
];

const DEFAULT_SESSION_METADATA: SessionMetadata = {
  sessionId: `EXP-DHV-${Date.now().toString(36).toUpperCase()}`,
  startedAt: Date.now(),
  lastActiveAt: Date.now(),
  fieldNotes: INITIAL_FIELD_NOTES,
  totalObservationsRecorded: 2,
  lastExploredSector: 'Eastern Rock-Cut Reservoir',
};

const INITIAL_STATE: GameState = {
  player: DEFAULT_PLAYER,
  currentScreen: 'start',
  activeMissionId: null,
  completedMissionIds: [],
  collectedEvidenceIds: [],
  unlockedKnowledgeIds: ['k_urban_planning', 'k_signboard_script'],
  settings: DEFAULT_SETTINGS,
  analytics: DEFAULT_ANALYTICS,
  sessionMetadata: DEFAULT_SESSION_METADATA,
  isPaused: false,
  activeModal: null,
};

export function useGameStateManager() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          sessionMetadata: parsed.sessionMetadata ? {
            ...DEFAULT_SESSION_METADATA,
            ...parsed.sessionMetadata,
            fieldNotes: parsed.sessionMetadata.fieldNotes || DEFAULT_SESSION_METADATA.fieldNotes,
          } : DEFAULT_SESSION_METADATA,
          isPaused: false,
          activeModal: null,
        };
      }
    } catch {
      // Fallback if localStorage is disabled or corrupt
    }
    return INITIAL_STATE;
  });

  // Sync sound settings to sound manager
  useEffect(() => {
    soundManager.setMuted(!state.settings.soundEnabled);
  }, [state.settings.soundEnabled]);

  // Persist to LocalStorage
  useEffect(() => {
    try {
      const dataToSave = {
        player: state.player,
        completedMissionIds: state.completedMissionIds,
        collectedEvidenceIds: state.collectedEvidenceIds,
        unlockedKnowledgeIds: state.unlockedKnowledgeIds,
        settings: state.settings,
        analytics: state.analytics,
        sessionMetadata: state.sessionMetadata,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [
    state.player,
    state.completedMissionIds,
    state.collectedEvidenceIds,
    state.unlockedKnowledgeIds,
    state.settings,
    state.analytics,
    state.sessionMetadata,
  ]);

  // Actions
  const setScreen = useCallback((screen: GameState['currentScreen']) => {
    soundManager.playClick();
    setState(prev => ({ ...prev, currentScreen: screen }));
  }, []);

  const startNewGame = useCallback(() => {
    soundManager.playClick();
    setState(prev => ({
      ...prev,
      currentScreen: 'map',
      activeMissionId: 'mission_1_water',
      activeModal: null,
      isPaused: false
    }));
  }, []);

  const restartMission = useCallback((missionId: string = 'mission_1_water') => {
    soundManager.playClick();
    setState(prev => ({
      ...prev,
      currentScreen: 'map',
      activeMissionId: missionId,
      collectedEvidenceIds: prev.collectedEvidenceIds.filter(
        id => !(MISSIONS_DATABASE[missionId]?.requiredEvidenceIds || []).includes(id)
      ),
      activeModal: null,
      isPaused: false
    }));
  }, []);

  const openMission = useCallback((missionId: string) => {
    soundManager.playClick();
    setState(prev => {
      const missionsStarted = prev.analytics.missionsStarted.includes(missionId)
        ? prev.analytics.missionsStarted
        : [...prev.analytics.missionsStarted, missionId];

      return {
        ...prev,
        currentScreen: 'mission',
        activeMissionId: missionId,
        activeModal: null,
        analytics: {
          ...prev.analytics,
          missionsStarted,
        }
      };
    });
  }, []);

  const returnToMap = useCallback(() => {
    soundManager.playClick();
    setState(prev => ({
      ...prev,
      currentScreen: 'map',
      activeMissionId: null,
      activeModal: null,
      isPaused: false
    }));
  }, []);

  const collectEvidence = useCallback((evidenceId: string) => {
    setState(prev => {
      if (prev.collectedEvidenceIds.includes(evidenceId)) return prev;
      soundManager.playClueDiscovered();
      const updatedEvidence = [...prev.collectedEvidenceIds, evidenceId];
      const updatedAnalyticsEvidence = prev.analytics.evidenceDiscovered.includes(evidenceId)
        ? prev.analytics.evidenceDiscovered
        : [...prev.analytics.evidenceDiscovered, evidenceId];

      // Add score
      const newScore = prev.player.score + 50;

      return {
        ...prev,
        collectedEvidenceIds: updatedEvidence,
        player: {
          ...prev.player,
          score: newScore,
        },
        analytics: {
          ...prev.analytics,
          evidenceDiscovered: updatedAnalyticsEvidence,
        }
      };
    });
  }, []);

  const completeMission = useCallback((missionId: string, durationSeconds: number) => {
    soundManager.playSuccess();
    setState(prev => {
      const mission = MISSIONS_DATABASE[missionId];
      const completedMissionIds = prev.completedMissionIds.includes(missionId)
        ? prev.completedMissionIds
        : [...prev.completedMissionIds, missionId];

      const unlockedKnowledgeIds = mission && !prev.unlockedKnowledgeIds.includes(mission.unlockedKnowledgeId)
        ? [...prev.unlockedKnowledgeIds, mission.unlockedKnowledgeId]
        : prev.unlockedKnowledgeIds;

      // Assign badges
      const badges = [...prev.player.badges];
      let newTitle = prev.player.title;
      if (missionId === 'mission_1_water' && !badges.includes('Hydraulic Master')) {
        badges.push('Hydraulic Master');
        newTitle = 'Water System Specialist';
      }
      if (missionId === 'mission_2_artisan' && !badges.includes('Lapidary Virtuoso')) {
        badges.push('Lapidary Virtuoso');
        newTitle = 'Harappan Master Investigator';
      }

      return {
        ...prev,
        completedMissionIds,
        unlockedKnowledgeIds,
        player: {
          ...prev.player,
          score: prev.player.score + 250,
          title: newTitle,
          badges,
        },
        analytics: {
          ...prev.analytics,
          missionsCompleted: prev.analytics.missionsCompleted.includes(missionId)
            ? prev.analytics.missionsCompleted
            : [...prev.analytics.missionsCompleted, missionId],
          puzzleCompletionTimes: {
            ...prev.analytics.puzzleCompletionTimes,
            [missionId]: durationSeconds,
          }
        }
      };
    });
  }, []);

  const recordPuzzleAttempt = useCallback((missionId: string) => {
    setState(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        puzzleAttempts: {
          ...prev.analytics.puzzleAttempts,
          [missionId]: (prev.analytics.puzzleAttempts[missionId] || 0) + 1,
        }
      }
    }));
  }, []);

  const useHint = useCallback((missionId: string) => {
    soundManager.playClick();
    setState(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        hintsUsed: {
          ...prev.analytics.hintsUsed,
          [missionId]: (prev.analytics.hintsUsed[missionId] || 0) + 1,
        }
      }
    }));
  }, []);

  const recordKnowledgeRead = useCallback((cardId: string) => {
    setState(prev => {
      if (prev.analytics.knowledgeCardsRead.includes(cardId)) return prev;
      return {
        ...prev,
        analytics: {
          ...prev.analytics,
          knowledgeCardsRead: [...prev.analytics.knowledgeCardsRead, cardId]
        }
      };
    });
  }, []);

  const recordPreTestScore = useCallback((score: number) => {
    setState(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        preTestScore: score,
        preTestCompletedAt: Date.now()
      }
    }));
  }, []);

  const recordPostTestScore = useCallback((score: number) => {
    setState(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        postTestScore: score,
        postTestCompletedAt: Date.now()
      }
    }));
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    soundManager.playClick();
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        difficulty
      }
    }));
  }, []);

  const toggleSound = useCallback(() => {
    setState(prev => {
      const nextSound = !prev.settings.soundEnabled;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          soundEnabled: nextSound,
        }
      };
    });
  }, []);

  const setTextSize = useCallback((textSize: 'normal' | 'large') => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        textSize
      }
    }));
  }, []);

  const openModal = useCallback((modal: GameState['activeModal']) => {
    soundManager.playClick();
    setState(prev => ({ ...prev, activeModal: modal }));
  }, []);

  const closeModal = useCallback(() => {
    soundManager.playClick();
    setState(prev => ({ ...prev, activeModal: null, isPaused: false }));
  }, []);

  const togglePause = useCallback(() => {
    soundManager.playClick();
    setState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
      activeModal: !prev.isPaused ? 'pause' : null,
    }));
  }, []);

  // Field Notes Actions for Session Metadata
  const addFieldNote = useCallback((note: {
    sector: string;
    coordinates?: string;
    category: FieldNoteCategory;
    content: string;
    starred?: boolean;
  }) => {
    soundManager.playClick();
    setState(prev => {
      const newNote: FieldNote = {
        id: `fn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        sector: note.sector,
        coordinates: note.coordinates || '23.88° N, 70.21° E',
        category: note.category,
        content: note.content.trim(),
        starred: note.starred || false,
      };

      const updatedNotes = [newNote, ...prev.sessionMetadata.fieldNotes];
      const updatedMetadata: SessionMetadata = {
        ...prev.sessionMetadata,
        lastActiveAt: Date.now(),
        fieldNotes: updatedNotes,
        totalObservationsRecorded: prev.sessionMetadata.totalObservationsRecorded + 1,
        lastExploredSector: note.sector,
      };

      return {
        ...prev,
        sessionMetadata: updatedMetadata,
      };
    });
  }, []);

  const updateFieldNote = useCallback((id: string, content: string, category?: FieldNoteCategory) => {
    soundManager.playClick();
    setState(prev => {
      const updatedNotes = prev.sessionMetadata.fieldNotes.map(n => {
        if (n.id === id) {
          return {
            ...n,
            content: content.trim(),
            ...(category ? { category } : {}),
            timestamp: Date.now(),
          };
        }
        return n;
      });

      return {
        ...prev,
        sessionMetadata: {
          ...prev.sessionMetadata,
          lastActiveAt: Date.now(),
          fieldNotes: updatedNotes,
        },
      };
    });
  }, []);

  const deleteFieldNote = useCallback((id: string) => {
    soundManager.playClick();
    setState(prev => {
      const updatedNotes = prev.sessionMetadata.fieldNotes.filter(n => n.id !== id);
      return {
        ...prev,
        sessionMetadata: {
          ...prev.sessionMetadata,
          lastActiveAt: Date.now(),
          fieldNotes: updatedNotes,
        },
      };
    });
  }, []);

  const toggleStarFieldNote = useCallback((id: string) => {
    soundManager.playClick();
    setState(prev => {
      const updatedNotes = prev.sessionMetadata.fieldNotes.map(n => 
        n.id === id ? { ...n, starred: !n.starred } : n
      );
      return {
        ...prev,
        sessionMetadata: {
          ...prev.sessionMetadata,
          fieldNotes: updatedNotes,
        },
      };
    });
  }, []);

  const updateCurrentSector = useCallback((sector: string) => {
    setState(prev => ({
      ...prev,
      sessionMetadata: {
        ...prev.sessionMetadata,
        lastExploredSector: sector,
        lastActiveAt: Date.now(),
      }
    }));
  }, []);

  const resetAllProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignored
    }
    setState(INITIAL_STATE);
  }, []);

  return {
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
    restartMission,
    addFieldNote,
    updateFieldNote,
    deleteFieldNote,
    toggleStarFieldNote,
    updateCurrentSector,
    resetAllProgress,
  };
}
