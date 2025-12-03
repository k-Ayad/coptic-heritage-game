export interface CopticLetter {
  letter: string;
  name: string;
  pronunciation: string;
  audioFile: string;
  svgPath: string;
}

export interface CopticWord {
  id: number;
  word: string;
  meaning: string;
  letters: CopticLetter[];
}

export const COPTIC_WORDS: CopticWord[] = [
  {
    id: 1,
    word: 'ΑΓΙΟΣ',
    meaning: 'Holy / Holy One',
    letters: [
      {
        letter: 'Α',
        name: 'Alpha',
        pronunciation: 'ah',
        audioFile: 'alpha.mp3',
        svgPath: 'alpha.svg'
      },
      {
        letter: 'Γ',
        name: 'Gamma',
        pronunciation: 'g',
        audioFile: 'gamma.mp3',
        svgPath: 'gamma.svg'
      },
      {
        letter: 'Ι',
        name: 'Iota',
        pronunciation: 'ee',
        audioFile: 'iota.mp3',
        svgPath: 'iota.svg'
      },
      {
        letter: 'Ο',
        name: 'Omicron',
        pronunciation: 'o',
        audioFile: 'omicron.mp3',
        svgPath: 'omicron.svg'
      },
      {
        letter: 'Σ',
        name: 'Sigma',
        pronunciation: 's',
        audioFile: 'sigma.mp3',
        svgPath: 'sigma.svg'
      }
    ]
  },
  {
    id: 2,
    word: 'ΚΥΡΙΕ ΕΛΕΗΣΟΝ',
    meaning: 'Lord, have mercy',
    letters: [
      {
        letter: 'Κ',
        name: 'Kappa',
        pronunciation: 'k',
        audioFile: 'kappa.mp3',
        svgPath: 'kappa.svg'
      },
      {
        letter: 'Υ',
        name: 'Upsilon',
        pronunciation: 'u',
        audioFile: 'upsilon.mp3',
        svgPath: 'upsilon.svg'
      },
      {
        letter: 'Ρ',
        name: 'Rho',
        pronunciation: 'r',
        audioFile: 'rho.mp3',
        svgPath: 'rho.svg'
      },
      {
        letter: 'Ι',
        name: 'Iota',
        pronunciation: 'ee',
        audioFile: 'iota.mp3',
        svgPath: 'iota.svg'
      },
      {
        letter: 'Ε',
        name: 'Epsilon',
        pronunciation: 'eh',
        audioFile: 'epsilon.mp3',
        svgPath: 'epsilon.svg'
      },
      {
        letter: 'Ε',
        name: 'Epsilon',
        pronunciation: 'eh',
        audioFile: 'epsilon.mp3',
        svgPath: 'epsilon.svg'
      },
      {
        letter: 'Λ',
        name: 'Lambda',
        pronunciation: 'l',
        audioFile: 'lambda.mp3',
        svgPath: 'lambda.svg'
      },
      {
        letter: 'Ε',
        name: 'Epsilon',
        pronunciation: 'eh',
        audioFile: 'epsilon.mp3',
        svgPath: 'epsilon.svg'
      },
      {
        letter: 'Η',
        name: 'Eta',
        pronunciation: 'ay',
        audioFile: 'eta.mp3',
        svgPath: 'eta.svg'
      },
      {
        letter: 'Σ',
        name: 'Sigma',
        pronunciation: 's',
        audioFile: 'sigma.mp3',
        svgPath: 'sigma.svg'
      },
      {
        letter: 'Ο',
        name: 'Omicron',
        pronunciation: 'o',
        audioFile: 'omicron.mp3',
        svgPath: 'omicron.svg'
      },
      {
        letter: 'Ν',
        name: 'Nu',
        pronunciation: 'n',
        audioFile: 'nu.mp3',
        svgPath: 'nu.svg'
      }
    ]
  }
];
