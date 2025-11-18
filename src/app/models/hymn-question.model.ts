export interface HymnQuestion {
  id: number;
  audioFile: string;
  correctAnswer: string;
  options: string[];
}

export const HYMN_QUESTIONS: HymnQuestion[] = [
  {
    id: 1,
    audioFile: 'hymn1.mp3',
    correctAnswer: 'Agios O Theos',
    options: ['Agios O Theos', 'Tenen', 'O Kirios Meta Panton', 'Epooro']
  },
  {
    id: 2,
    audioFile: 'hymn3.mp3',
    correctAnswer: 'O Kirios Meta Panton',
    options: ['O Kirios Meta Panton', 'Epooro', 'Tenen', 'Pekethronos']
  },
  {
    id: 3,
    audioFile: 'hymn4.mp3',
    correctAnswer: 'Tai Shori',
    options: ['Tenen', 'O Kirios Meta Panton', 'Tai Shori', 'Agios O Theos']
  },
  {
    id: 4,
    audioFile: 'hymn2.mp3',
    correctAnswer: 'Tenen',
    options: ['Agios O Theos', 'Tenen', 'Pekethronos', 'Tai Shori']
  },
  {
    id: 5,
    audioFile: 'hymn5.mp3',
    correctAnswer: 'Pekethronos',
    options: ['Tai Shori', 'Pekethronos', 'Agios O Theos', 'Epooro']
  }
];
