export interface CopticLetter {
  id: string;
  name: string;
  pronunciation: string;
  svgPath: string;
}

export const COPTIC_LETTERS: CopticLetter[] = [
  { id: 'alpha', name: 'Alpha', pronunciation: '/ah/', svgPath: 'assets/coptic-letters/alpha.svg' },
  { id: 'epsilon', name: 'Ei', pronunciation: '/e/', svgPath: 'assets/coptic-letters/epsilon.svg' },
  { id: 'eta', name: 'Ita', pronunciation: '/ee/', svgPath: 'assets/coptic-letters/eta.svg' },
  { id: 'gamma', name: 'Gamma', pronunciation: '/g/', svgPath: 'assets/coptic-letters/gamma.svg' },
  { id: 'iota', name: 'Yota', pronunciation: '/y/', svgPath: 'assets/coptic-letters/iota.svg' },
  { id: 'kappa', name: 'Kappa', pronunciation: '/k/', svgPath: 'assets/coptic-letters/kappa.svg' },
  { id: 'lambda', name: 'Lamda', pronunciation: '/l/', svgPath: 'assets/coptic-letters/lambda.svg' },
  { id: 'nu', name: 'Ni', pronunciation: '/n/', svgPath: 'assets/coptic-letters/nu.svg' },
  { id: 'omicron', name: 'O', pronunciation: '/o/', svgPath: 'assets/coptic-letters/omicron.svg' },
  { id: 'rho', name: 'Ro', pronunciation: '/r/', svgPath: 'assets/coptic-letters/rho.svg' },
  { id: 'sigma', name: 'Sima', pronunciation: '/s/', svgPath: 'assets/coptic-letters/sigma.svg' },
  { id: 'upsilon', name: 'Upsilon', pronunciation: '/u/', svgPath: 'assets/coptic-letters/upsilon.svg' }
];