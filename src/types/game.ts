export type Difficulty = 'explorer' | 'investigator' | 'strategist';

export interface EvidenceItem {
  id: string;
  title: string;
  category: 'Water Management' | 'Craft & Technology' | 'Urban Planning' | 'Archaeological Evidence';
  location: string;
  description: string;
  archaeologicalNotes: string;
  source: string;
  missionId: string;
  verified: boolean;
  discoveredAt?: number;
  iconName?: string;
  details?: {
    material?: string;
    period?: string;
    excavationContext?: string;
    significance?: string;
  };
}

export interface KnowledgeCard {
  id: string;
  title: string;
  category: string;
  summary: string;
  fullText: string[];
  keyConcept: string;
  archaeologicalEvidence: string;
  sourceCitation: string;
  missionOrigin: string;
  imageAlt: string;
  unlocked: boolean;
  dateUnlocked?: number;
}

export interface Mission {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  theme: string;
  objective: string;
  story: string;
  locationId: string;
  status: 'locked' | 'available' | 'completed';
  requiredEvidenceIds: string[];
  totalEvidenceCount: number;
  unlockedKnowledgeId: string;
  hints: [string, string, string]; // 3 levels of hints
}

export interface MapLocation {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coordinates: { x: number; y: number }; // percentage on map
  status: 'locked' | 'available' | 'completed';
  missionId?: string;
  icon: string;
}

export interface DialogueSpeaker {
  name: string;
  role: string;
  avatarColor: string;
  avatarSvgType: 'archaeologist' | 'artisan' | 'assistant';
}

export interface DialogueNode {
  id: string;
  speaker: DialogueSpeaker;
  text: string;
  hintLevel?: number;
}

export interface PrePostQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceReference: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  difficulty: Difficulty;
  textSize: 'normal' | 'large';
  highContrast: boolean;
}

export interface GameAnalytics {
  missionsStarted: string[];
  missionsCompleted: string[];
  puzzleAttempts: Record<string, number>;
  puzzleCompletionTimes: Record<string, number>; // in seconds
  hintsUsed: Record<string, number>;
  evidenceDiscovered: string[];
  knowledgeCardsRead: string[];
  preTestScore?: number;
  postTestScore?: number;
  preTestCompletedAt?: number;
  postTestCompletedAt?: number;
  totalPlayTimeSeconds: number;
}

export interface PlayerProfile {
  name: string;
  title: string;
  score: number;
  badges: string[];
}

export type FieldNoteCategory = 'Hydraulics' | 'Masonry' | 'Stratigraphy' | 'Artifact' | 'General';

export interface FieldNote {
  id: string;
  timestamp: number;
  sector: string;
  coordinates?: string;
  category: FieldNoteCategory;
  content: string;
  starred?: boolean;
}

export interface SessionMetadata {
  sessionId: string;
  startedAt: number;
  lastActiveAt: number;
  fieldNotes: FieldNote[];
  totalObservationsRecorded: number;
  lastExploredSector?: string;
}

export interface GameState {
  player: PlayerProfile;
  currentScreen: 'start' | 'intro' | 'map' | 'mission' | 'knowledge' | 'evaluation';
  activeMissionId: string | null;
  completedMissionIds: string[];
  collectedEvidenceIds: string[];
  unlockedKnowledgeIds: string[];
  settings: GameSettings;
  analytics: GameAnalytics;
  sessionMetadata: SessionMetadata;
  isPaused: boolean;
  activeModal: 'evidence' | 'knowledge' | 'settings' | 'pause' | 'evaluation' | 'howToPlay' | 'fieldNotes' | null;
}
