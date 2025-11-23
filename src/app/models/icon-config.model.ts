export interface IconConfig {
  id: number;
  filename: string;
  title: string;
  story: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gridSize: number; // 3 for 3x3, 4 for 4x4
}

export const ICON_CONFIGS: IconConfig[] = [
  {
    id: 1,
    filename: 'icon.jpg',
    title: 'The Holy Family in Egypt',
    story: 'This ancient Coptic icon depicts the Holy Family\'s journey to Egypt, a cornerstone of Egyptian Christian heritage and faith.',
    difficulty: 'easy',
    gridSize: 3
  },
  {
    id: 2,
    filename: 'icon2.jpg',
    title: 'St. Mark the Evangelist',
    story: 'St. Mark brought Christianity to Egypt in the 1st century AD, founding the Coptic Church and establishing the See of Alexandria.',
    difficulty: 'easy',
    gridSize: 3
  },
  {
    id: 3,
    filename: 'icon3.jpg',
    title: 'The Coptic Cross',
    story: 'The Coptic Cross symbolizes the unity of the Egyptian Church, combining ancient Egyptian and Christian symbolism in its unique design.',
    difficulty: 'easy',
    gridSize: 3
  }
];
