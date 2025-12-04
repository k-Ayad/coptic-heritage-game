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
    title: 'St. Onophrios (Abu Nofer) next to a palm tree.',
    story: 'The icon is originally painted by “Ibrahim Al-Nasekh” in the 18th century, and it located in the Church of the Holy Virgin Mary Al Damshiriah in Old Cairo.',
    difficulty: 'easy',
    gridSize: 3
  },
  {
    id: 2,
    filename: 'icon2.jpg',
    title: 'The Icon of Christ and Abbot Mena',
    story: 'is a Coptic painting currently housed in the Louvre Museum in Paris. The icon is a wooden panel painting that was brought from the Monastery of Apollo in Bawit, Egypt.',
    difficulty: 'easy',
    gridSize: 3
  },
  {
    id: 3,
    filename: 'icon3.jpg',
    title: 'Abraham receiving Holy Communion from Melchizedek',
    story: 'who is standing before an altar giving a spoon from a chalice to Abraham drawn between the 11th and the 13th Centuries on the eastern wall of the central Sanctuary in the Church of the Holy Virgin Mary located at the Monastery of Al-Baramos, Wadi Al-Natrun.',
    difficulty: 'easy',
    gridSize: 3
  }
];
