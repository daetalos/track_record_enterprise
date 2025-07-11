// Medal validation and utility functions

import { MedalName, MEDAL_POSITIONS, MEDAL_NAMES } from '@/types/medal';

/**
 * Validates if a medal position is within the valid range (1-12)
 * @param position - Medal position to validate
 * @returns true if position is valid, false otherwise
 */
export function validateMedalPosition(position: number): boolean {
  return (
    Number.isInteger(position) &&
    position >= MEDAL_POSITIONS.MIN_POSITION &&
    position <= MEDAL_POSITIONS.MAX_POSITION
  );
}

/**
 * Gets the medal name based on position
 * Position 1 = Gold, Position 2 = Silver, Position 3-12 = Bronze
 * @param position - Medal position (1-12)
 * @returns Medal name (Gold, Silver, or Bronze)
 * @throws Error if position is invalid
 */
export function getMedalName(position: number): MedalName {
  if (!validateMedalPosition(position)) {
    throw new Error(
      `Invalid medal position: ${position}. Must be between 1-12.`
    );
  }

  if (position === MEDAL_POSITIONS.GOLD) {
    return MEDAL_NAMES.GOLD;
  }

  if (position === MEDAL_POSITIONS.SILVER) {
    return MEDAL_NAMES.SILVER;
  }

  // Positions 3-12 are Bronze
  return MEDAL_NAMES.BRONZE;
}

/**
 * Gets all medal positions in order with their names
 * @returns Array of medal objects with position and name
 */
export function getMedalsByPosition(): Array<{
  position: number;
  name: string;
}> {
  const medals: Array<{ position: number; name: string }> = [];

  for (
    let position = MEDAL_POSITIONS.MIN_POSITION;
    position <= MEDAL_POSITIONS.MAX_POSITION;
    position++
  ) {
    medals.push({
      position,
      name: getMedalName(position),
    });
  }

  return medals;
}

/**
 * Validates if a medal name is valid
 * @param name - Medal name to validate
 * @returns true if name is valid, false otherwise
 */
export function validateMedalName(name: unknown): name is MedalName {
  return (
    typeof name === 'string' &&
    Object.values(MEDAL_NAMES).includes(name as MedalName)
  );
}

/**
 * Gets the position(s) for a given medal name
 * @param name - Medal name (Gold, Silver, Bronze)
 * @returns Array of positions for the given name
 * @throws Error if name is invalid
 */
export function getPositionsForMedalName(name: string): number[] {
  if (!validateMedalName(name)) {
    throw new Error(
      `Invalid medal name: ${name}. Must be Gold, Silver, or Bronze.`
    );
  }

  switch (name as MedalName) {
    case MEDAL_NAMES.GOLD:
      return [MEDAL_POSITIONS.GOLD];
    case MEDAL_NAMES.SILVER:
      return [MEDAL_POSITIONS.SILVER];
    case MEDAL_NAMES.BRONZE:
      return Array.from(
        {
          length:
            MEDAL_POSITIONS.BRONZE_LAST - MEDAL_POSITIONS.BRONZE_FIRST + 1,
        },
        (_, i) => MEDAL_POSITIONS.BRONZE_FIRST + i
      );
    default:
      throw new Error(`Unexpected medal name: ${name}`);
  }
}

/**
 * Formats medal position for display (e.g., "1st - Gold", "2nd - Silver")
 * @param position - Medal position
 * @returns Formatted string for display
 */
export function formatMedalDisplay(position: number): string {
  if (!validateMedalPosition(position)) {
    throw new Error(`Invalid medal position: ${position}`);
  }

  const name = getMedalName(position);
  const ordinal = getOrdinalSuffix(position);

  return `${position}${ordinal} - ${name}`;
}

/**
 * Gets ordinal suffix for a number (st, nd, rd, th)
 * @param num - Number to get suffix for
 * @returns Ordinal suffix
 */
function getOrdinalSuffix(num: number): string {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th';
  }

  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
