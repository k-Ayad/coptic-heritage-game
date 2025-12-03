export interface LiturgicalItem {
  id: string;
  name: string;
  asset: string;
  description: string;
  position: { x: number; y: number };
}

export const LITURGICAL_ITEMS: LiturgicalItem[] = [
  {
    id: 'chalice',
    name: 'Chalice',
    asset: 'assets/liturgy-items/chalice.png',
    description: 'The Chalice holds the Blood of Christ during the Divine Liturgy.',
    position: { x: 30, y: 40 }
  },
  {
    id: 'paten',
    name: 'Paten (Diskos)',
    asset: 'assets/liturgy-items/paten.png',
    description: 'The Paten carries the Lamb (Holy Body) during the Liturgy.',
    position: { x: 60, y: 40 }
  },
  {
    id: 'spoon',
    name: 'Liturgical Spoon',
    asset: 'assets/liturgy-items/spoon.png',
    description: 'The Spoon is used to give Holy Communion to the faithful.',
    position: { x: 20, y: 70 }
  },
  {
    id: 'prospharine',
    name: 'Prospharine',
    asset: 'assets/liturgy-items/prospharine.jpg',
    description: 'The Prospharine is the knife used to prepare the Holy Lamb.',
    position: { x: 50, y: 70 }
  },
  {
    id: 'censer',
    name: 'Censer',
    asset: 'assets/liturgy-items/censer.png',
    description: 'The Censer is used during incense prayers to honor God.',
    position: { x: 70, y: 70 }
  }
];
