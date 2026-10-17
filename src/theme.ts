export const colors = {
  ink: '#17382F',
  inkSoft: '#38564D',
  paper: '#F3F2E9',
  white: '#FFFFFF',
  line: '#D8DED3',
  leaf: '#DDE9D9',
  leafDeep: '#A8C8A4',
  coral: '#D95D45',
  coralPale: '#F7E2D9',
  yellow: '#E8C763',
  muted: '#79877E',
  danger: '#A33F30',
};

export const rarityColors = {
  common: '#477C55',
  uncommon: '#59799A',
  rare: '#AA633F',
  exotic: '#8A526A',
} as const;

export type Rarity = keyof typeof rarityColors;