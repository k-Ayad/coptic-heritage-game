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
    description: 'Drag and drop the pieces to restore the icon to its original form.',
    instructions: 'Complete at least 3 different icon puzzles by dragging tiles to their correct positions.',
    scoringSystem: 'Complete 3 of 6 icon puzzles to pass',
    passingScore: 3,
    totalQuestions: 6
  },
  'monastery1': {
    id: 'monastery1',
    name: 'Match the Letter',
    description: 'Test your memory and learn Coptic letters by matching each letter with its name and pronunciation.',
    instructions: 'Tap cards to flip them. Find matching pairs of Coptic letters (SVG images) with their corresponding names and pronunciations. Match all pairs to complete the game.',
    scoringSystem: 'Match all 8 pairs of letters to pass',
    passingScore: 8,
    totalQuestions: 8
  },
  'hanging-church': {
    id: 'hanging-church',
    name: 'Match the Saint by Emoji',
    description: 'Match the Coptic saint using only emoji clues. Choose the correct saint to learn their story from the Synaxarium.',
    instructions: 'Look at the emoji clue and select the correct saint from three choices. Each correct answer reveals the saint\'s story from the Synaxarium.',
    scoringSystem: 'Answer 6 of 8 questions correctly to pass',
    passingScore: 6,
    totalQuestions: 8
  }
};
