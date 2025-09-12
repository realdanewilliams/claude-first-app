export interface Country {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  svgPath: string;
}

export interface Guess {
  country: string;
  distance: number;
  direction: string;
  isCorrect: boolean;
}

export type GameState = 'playing' | 'won' | 'lost';