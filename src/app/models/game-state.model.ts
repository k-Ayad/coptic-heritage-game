export interface GameState {
  completedPlaces: string[];
  currentLevel: number;
  score: number;
  lastPlayedDate: string;
}

export const DEFAULT_GAME_STATE: GameState = {
  completedPlaces: [],
  currentLevel: 1,
  score: 0,
  lastPlayedDate: new Date().toISOString()
};
