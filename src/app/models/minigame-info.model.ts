export interface MiniGameInfo {
  name: string;
  description: string;
  instructions: string;
  scoringSystem: string;
  passingScore: number;
  totalQuestions: number;
}

export const MINIGAME_INFO: Record<string, MiniGameInfo> = {
  'church1': {
    name: 'Orthodox Liturgical Hymns Quiz',
    description: 'Test your knowledge of Orthodox liturgical hymns by identifying them from audio clips.',
    instructions: 'Listen to each hymn carefully and select the correct name from the options provided. You need to answer at least 3 out of 5 questions correctly to pass.',
    scoringSystem: 'Answer 3 or more hymns correctly to complete this mini-game',
    passingScore: 3,
    totalQuestions: 5
  },
  'school1': {
    name: 'Rebuild the Icon',
    description: 'Drag and drop the pieces to restore the icon to its original form.',
    instructions: 'Touch or click and drag the puzzle pieces to rearrange them. Complete at least 3 different icon puzzles to finish this mini-game.',
    scoringSystem: 'Complete the puzzle by arranging all pieces correctly',
    passingScore: 1,
    totalQuestions: 1
  },
  'monastery1': {
    name: 'Write It! — Trace the Coptic Letter',
    description: 'Learn to write Coptic letters by tracing them. Master the sacred alphabet used in Coptic liturgy and texts.',
    instructions: 'Tap a letter card to see its outline for 5 seconds, then draw it with your finger or mouse. Complete both words (ΑΓΙΟΣ and ΚΥΡΙΕ ΕΛΕΗΣΟΝ) by writing each letter correctly. You have 3 attempts per letter.',
    scoringSystem: 'Successfully trace all letters in both sacred words to complete this mini-game',
    passingScore: 2,
    totalQuestions: 2
  }
};
