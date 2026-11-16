export type LevelId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface LevelMeta {
  id: LevelId;
  title: string;
  shortLabel: string;
  emoji: string;
}

export interface GiftItem {
  id: number;
  boxColor: string;
  ribbonColor: string;
  effectType:
    | 'hearts'
    | 'stars'
    | 'butterflies'
    | 'confetti'
    | 'sparkles'
    | 'prism'
    | 'firework'
    | 'aurora'
    | 'gold'
    | 'bloom';
  title: string;
  wish: string;
}

export interface ButterflyMessage {
  id: number;
  title: string;
  message: string;
  accent: string;
}

export interface StarWish {
  id: number;
  xPercent: number;
  yPercent: number;
  name: string;
  message: string;
}

export interface TreasureWish {
  id: number;
  iconName: string;
  title: string;
  wish: string;
  glowColor: string;
}

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  isSecret?: boolean;
}
