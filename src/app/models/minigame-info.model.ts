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
  },
  'school1': {
    id: 'school1',
    name: 'Rebuild the Icon',
    description: 'Drag and drop the pieces to restore the icon. Complete the puzzle to learn the story behind this sacred image.',
    instructions: 'Touch or click and drag the puzzle pieces to rearrange them. Place each piece in its correct position to restore the complete icon.',
    scoringSystem: 'Complete the puzzle by arranging all pieces correctly',
    passingScore: 1,
    totalQuestions: 1
  }
  // Add more mini-games here as they are developed
};
