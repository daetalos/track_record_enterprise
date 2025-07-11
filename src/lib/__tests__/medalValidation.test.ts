// Medal validation function tests

import { describe, it, expect } from 'vitest';
import {
  validateMedalPosition,
  getMedalName,
  getMedalsByPosition,
  validateMedalName,
  getPositionsForMedalName,
  formatMedalDisplay,
} from '../medalValidation';
import { MEDAL_NAMES } from '@/types/medal';

describe('medalValidation', () => {
  describe('validateMedalPosition', () => {
    it('should return true for valid positions 1-12', () => {
      for (let position = 1; position <= 12; position++) {
        expect(validateMedalPosition(position)).toBe(true);
      }
    });

    it('should return false for positions below 1', () => {
      expect(validateMedalPosition(0)).toBe(false);
      expect(validateMedalPosition(-1)).toBe(false);
      expect(validateMedalPosition(-10)).toBe(false);
    });

    it('should return false for positions above 12', () => {
      expect(validateMedalPosition(13)).toBe(false);
      expect(validateMedalPosition(20)).toBe(false);
      expect(validateMedalPosition(100)).toBe(false);
    });

    it('should return false for non-integer values', () => {
      expect(validateMedalPosition(1.5)).toBe(false);
      expect(validateMedalPosition(3.14)).toBe(false);
      expect(validateMedalPosition(NaN)).toBe(false);
      expect(validateMedalPosition(Infinity)).toBe(false);
    });

    it('should return false for non-numeric values', () => {
      expect(validateMedalPosition('1' as any)).toBe(false);
      expect(validateMedalPosition(null as any)).toBe(false);
      expect(validateMedalPosition(undefined as any)).toBe(false);
      expect(validateMedalPosition({} as any)).toBe(false);
    });
  });

  describe('getMedalName', () => {
    it('should return Gold for position 1', () => {
      expect(getMedalName(1)).toBe(MEDAL_NAMES.GOLD);
    });

    it('should return Silver for position 2', () => {
      expect(getMedalName(2)).toBe(MEDAL_NAMES.SILVER);
    });

    it('should return Bronze for positions 3-12', () => {
      for (let position = 3; position <= 12; position++) {
        expect(getMedalName(position)).toBe(MEDAL_NAMES.BRONZE);
      }
    });

    it('should throw error for invalid positions', () => {
      const invalidPositions = [0, -1, 13, 20, 1.5, NaN];

      invalidPositions.forEach(position => {
        expect(() => getMedalName(position)).toThrow(
          `Invalid medal position: ${position}. Must be between 1-12.`
        );
      });
    });
  });

  describe('getMedalsByPosition', () => {
    it('should return all 12 medal positions with correct names', () => {
      const medals = getMedalsByPosition();

      expect(medals).toHaveLength(12);

      // Check each position has correct name
      expect(medals[0]).toEqual({ position: 1, name: MEDAL_NAMES.GOLD });
      expect(medals[1]).toEqual({ position: 2, name: MEDAL_NAMES.SILVER });

      // Positions 3-12 should all be Bronze
      for (let i = 2; i < 12; i++) {
        expect(medals[i]).toEqual({
          position: i + 1,
          name: MEDAL_NAMES.BRONZE,
        });
      }
    });

    it('should return medals in ascending order by position', () => {
      const medals = getMedalsByPosition();

      for (let i = 0; i < medals.length; i++) {
        expect(medals[i].position).toBe(i + 1);
      }
    });
  });

  describe('validateMedalName', () => {
    it('should return true for valid medal names', () => {
      expect(validateMedalName(MEDAL_NAMES.GOLD)).toBe(true);
      expect(validateMedalName(MEDAL_NAMES.SILVER)).toBe(true);
      expect(validateMedalName(MEDAL_NAMES.BRONZE)).toBe(true);
    });

    it('should return false for invalid medal names', () => {
      expect(validateMedalName('Platinum')).toBe(false);
      expect(validateMedalName('Diamond')).toBe(false);
      expect(validateMedalName('')).toBe(false);
      expect(validateMedalName('gold')).toBe(false); // case sensitive
      expect(validateMedalName('GOLD')).toBe(false); // case sensitive
    });

    it('should return false for non-string values', () => {
      expect(validateMedalName(1 as any)).toBe(false);
      expect(validateMedalName(null as any)).toBe(false);
      expect(validateMedalName(undefined as any)).toBe(false);
      expect(validateMedalName({} as any)).toBe(false);
    });
  });

  describe('getPositionsForMedalName', () => {
    it('should return [1] for Gold', () => {
      const positions = getPositionsForMedalName(MEDAL_NAMES.GOLD);
      expect(positions).toEqual([1]);
    });

    it('should return [2] for Silver', () => {
      const positions = getPositionsForMedalName(MEDAL_NAMES.SILVER);
      expect(positions).toEqual([2]);
    });

    it('should return [3,4,5,6,7,8,9,10,11,12] for Bronze', () => {
      const positions = getPositionsForMedalName(MEDAL_NAMES.BRONZE);
      expect(positions).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });

    it('should throw error for invalid medal names', () => {
      const invalidNames = ['Platinum', 'Diamond', '', 'gold', 'GOLD'];

      invalidNames.forEach(name => {
        expect(() => getPositionsForMedalName(name)).toThrow(
          `Invalid medal name: ${name}. Must be Gold, Silver, or Bronze.`
        );
      });
    });
  });

  describe('formatMedalDisplay', () => {
    it('should format position 1 as "1st - Gold"', () => {
      expect(formatMedalDisplay(1)).toBe('1st - Gold');
    });

    it('should format position 2 as "2nd - Silver"', () => {
      expect(formatMedalDisplay(2)).toBe('2nd - Silver');
    });

    it('should format position 3 as "3rd - Bronze"', () => {
      expect(formatMedalDisplay(3)).toBe('3rd - Bronze');
    });

    it('should format positions 4-12 with correct ordinals and Bronze', () => {
      const expectedFormats = [
        '4th - Bronze',
        '5th - Bronze',
        '6th - Bronze',
        '7th - Bronze',
        '8th - Bronze',
        '9th - Bronze',
        '10th - Bronze',
        '11th - Bronze',
        '12th - Bronze',
      ];

      for (let position = 4; position <= 12; position++) {
        expect(formatMedalDisplay(position)).toBe(
          expectedFormats[position - 4]
        );
      }
    });

    it('should throw error for invalid positions', () => {
      const invalidPositions = [0, -1, 13, 20, 1.5, NaN];

      invalidPositions.forEach(position => {
        expect(() => formatMedalDisplay(position)).toThrow(
          `Invalid medal position: ${position}`
        );
      });
    });
  });

  describe('Edge cases and integration', () => {
    it('should handle all valid positions consistently across functions', () => {
      for (let position = 1; position <= 12; position++) {
        // Position should be valid
        expect(validateMedalPosition(position)).toBe(true);

        // Should get a medal name
        const medalName = getMedalName(position);
        expect(medalName).toBeDefined();

        // Medal name should be valid
        expect(validateMedalName(medalName)).toBe(true);

        // Should format correctly
        const formatted = formatMedalDisplay(position);
        expect(formatted).toContain(medalName);
        expect(formatted).toContain(position.toString());
      }
    });

    it('should maintain consistency between getMedalsByPosition and individual functions', () => {
      const allMedals = getMedalsByPosition();

      allMedals.forEach((medal, index) => {
        const position = index + 1;

        // Position should match
        expect(medal.position).toBe(position);

        // Name should match getMedalName
        expect(medal.name).toBe(getMedalName(position));

        // Name should be valid
        expect(validateMedalName(medal.name)).toBe(true);
      });
    });

    it('should handle Bronze positions correctly in getPositionsForMedalName', () => {
      const bronzePositions = getPositionsForMedalName(MEDAL_NAMES.BRONZE);

      // Should have 10 Bronze positions (3-12)
      expect(bronzePositions).toHaveLength(10);

      // Each Bronze position should return Bronze name
      bronzePositions.forEach(position => {
        expect(getMedalName(position)).toBe(MEDAL_NAMES.BRONZE);
      });
    });
  });
});
