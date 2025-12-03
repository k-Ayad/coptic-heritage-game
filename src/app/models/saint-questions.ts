export interface SaintQuestion {
  emoji: string;
  correct: string;
  choices: string[];
  description: string;
}

export const SAINT_QUESTIONS: SaintQuestion[] = [
  {
    emoji: '🦁',
    correct: 'Saint Mark',
    choices: ['Saint Mark', 'Saint Luke', 'Saint George'],
    description: 'Saint Mark the Apostle, founder of the Church of Alexandria, author of the Gospel of Mark, and companion of Saint Peter. His symbol is the lion, representing courage and the royal dignity of Christ.'
  },
  {
    emoji: '🐫🐫',
    correct: 'Saint Mina',
    choices: ['Saint Mina', 'Saint Anthony', 'Saint Pachomius'],
    description: 'Saint Mina of Egypt, a soldier martyr whose relics were carried by camels. He is known as the wonder-worker and patron saint of travelers. Two camels carried his body and stopped at the place where his monastery was built.'
  },
  {
    emoji: '⚔️',
    correct: 'Philopater Mercurius',
    choices: ['Philopater Mercurius', 'Saint George', 'Saint Theodore'],
    description: 'Saint Philopater Mercurius, also known as Abu Seifein (Father of Two Swords), was a Roman soldier who became a great martyr. He is depicted with two swords - one earthly and one heavenly given by an angel.'
  },
  {
    emoji: '🪮🧼',
    correct: 'Saint Verena',
    choices: ['Saint Verena', 'Saint Marina', 'Saint Barbara'],
    description: 'Saint Verena of Zurzach, known for her acts of charity and healing. She taught hygiene and cleanliness to the people, using combs and soap to care for the sick and poor. She is the patron saint of healthcare workers.'
  },
  {
    emoji: '🦷',
    correct: 'Saint Apollonia',
    choices: ['Saint Apollonia', 'Saint Catherine', 'Saint Demiana'],
    description: 'Saint Apollonia of Alexandria, a virgin martyr who had her teeth broken during persecution. She is the patron saint of dentists and those suffering from toothache. Her courage in the face of torture inspired many Christians.'
  },
  {
    emoji: '🧙🏻‍♂️',
    correct: 'Saint Cyprian',
    choices: ['Saint Cyprian', 'Saint Athanasius', 'Saint Cyril'],
    description: 'Saint Cyprian of Antioch was a former sorcerer and magician who converted to Christianity after witnessing the power of faith. He became a bishop and martyr, showing that no one is beyond redemption.'
  },
  {
    emoji: '👨‍⚕️',
    correct: 'Saint Luke',
    choices: ['Saint Luke', 'Saint Mark', 'Saint Matthew'],
    description: 'Saint Luke the Evangelist, the beloved physician and author of the Gospel of Luke and the Acts of the Apostles. He was a companion of Saint Paul and is the patron saint of physicians, surgeons, and artists.'
  },
  {
    emoji: '🐉',
    correct: 'Saint George',
    choices: ['Saint George', 'Saint Michael', 'Saint Mercurius'],
    description: 'Saint George the Roman soldier and martyr, famous for the legend of slaying the dragon. He represents courage, faith, and victory over evil. He is one of the most venerated saints in Christianity.'
  }
];
