// Medal model types for competition awards and recognition

export interface Medal {
  id: string;
  position: number; // Position 1-12
  name: string; // Gold, Silver, Bronze
}

// Medal creation data (without id)
export interface MedalCreateData {
  position: number;
  name: string;
}

// Medal validation constants
export const MEDAL_POSITIONS = {
  GOLD: 1,
  SILVER: 2,
  BRONZE_FIRST: 3,
  BRONZE_LAST: 12,
  MIN_POSITION: 1,
  MAX_POSITION: 12,
} as const;

export const MEDAL_NAMES = {
  GOLD: 'Gold',
  SILVER: 'Silver',
  BRONZE: 'Bronze',
} as const;

// Type for medal position range
export type MedalPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// Type for medal names
export type MedalName = (typeof MEDAL_NAMES)[keyof typeof MEDAL_NAMES];
