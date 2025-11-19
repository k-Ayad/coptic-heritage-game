export interface MiniGameInfo {
  id: string;
  name: string;
  description: string;
  instructions: string;
  scoringSystem: string;
  passingScore: number;
  totalQuestions: number;
}

export const MINIGAME_INFO: Record<string, MiniGameInfo> = {
  'church1': {
    id: 'church1',
    name: 'Orthodox Liturgical Hymns Quiz',
    description: 'Test your knowledge of Orthodox liturgical hymns by listening to audio clips and identifying the correct hymn names.',
    instructions: 'Listen to each hymn carefully and select the correct name from the multiple choice options.',
    scoringSystem: 'Guess 3 of 5 hymns correctly to pass',
    passingScore: 3,
    totalQuestions: 5
  }
  // Add more mini-games here as they are developed
};
