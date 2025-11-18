export interface MiniGameResult {
  placeId: string;
  placeName: string;
  passed: boolean;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface MiniGameState {
  currentGame: string | null;
  results: MiniGameResult[];
  resumePosition: { x: number; y: number } | null;
}

export const DEFAULT_MINIGAME_STATE: MiniGameState = {
  currentGame: null,
  results: [],
  resumePosition: null
};
