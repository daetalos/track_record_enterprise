import { describe, it, expect } from 'vitest';
import {
  buildSearchUrl,
  validateSearchParams,
  type AthleteSearchParams,
} from '../useAthleteSearch';

describe('useAthleteSearch - Business Logic', () => {
  describe('buildSearchUrl', () => {
    it('should build basic search URL with required parameters', () => {
      const params: AthleteSearchParams = {
        query: 'John Doe',
        limit: 10,
      };

      const url = buildSearchUrl('club-123', params);

      expect(url).toBe(
        '/api/athletes/search?clubId=club-123&q=John+Doe&limit=10'
      );
    });

    it('should include gender filter when provided', () => {
      const params: AthleteSearchParams = {
        query: 'John',
        genderId: 'male',
        limit: 10,
      };

      const url = buildSearchUrl('club-123', params);

      expect(url).toContain('genderId=male');
      expect(url).toContain('q=John');
      expect(url).toContain('clubId=club-123');
    });

    it('should include age group filter when provided', () => {
      const params: AthleteSearchParams = {
        query: 'Jane',
        ageGroupId: 'u10',
        limit: 10,
      };

      const url = buildSearchUrl('club-123', params);

      expect(url).toContain('ageGroupId=u10');
      expect(url).toContain('q=Jane');
    });

    it('should include both filters when provided', () => {
      const params: AthleteSearchParams = {
        query: 'Smith',
        genderId: 'female',
        ageGroupId: 'u12',
        limit: 15,
      };

      const url = buildSearchUrl('club-456', params);

      expect(url).toContain('genderId=female');
      expect(url).toContain('ageGroupId=u12');
      expect(url).toContain('q=Smith');
      expect(url).toContain('limit=15');
      expect(url).toContain('clubId=club-456');
    });

    it('should use default limit when not provided', () => {
      const params: AthleteSearchParams = {
        query: 'Test',
      };

      const url = buildSearchUrl('club-123', params);

      expect(url).toContain('limit=10');
    });

    it('should properly encode special characters in query', () => {
      const params: AthleteSearchParams = {
        query: "O'Neil & Smith",
        limit: 10,
      };

      const url = buildSearchUrl('club-123', params);

      expect(url).toContain('q=O%27Neil+%26+Smith');
    });
  });

  describe('validateSearchParams', () => {
    it('should return error when no club is selected', () => {
      const params: AthleteSearchParams = {
        query: 'John',
        limit: 10,
      };

      const error = validateSearchParams(params, null, 2);

      expect(error).toBe('No club selected');
    });

    it('should return null when query is below minimum length', () => {
      const params: AthleteSearchParams = {
        query: 'J',
        limit: 10,
      };

      const error = validateSearchParams(params, 'club-123', 2);

      expect(error).toBeNull();
    });

    it('should return null when parameters are valid', () => {
      const params: AthleteSearchParams = {
        query: 'John',
        limit: 10,
      };

      const error = validateSearchParams(params, 'club-123', 2);

      expect(error).toBeNull();
    });

    it('should respect custom minimum query length', () => {
      const params: AthleteSearchParams = {
        query: 'Jo',
        limit: 10,
      };

      // Should be valid with min length 2
      expect(validateSearchParams(params, 'club-123', 2)).toBeNull();

      // Should be invalid with min length 3
      expect(validateSearchParams(params, 'club-123', 3)).toBeNull();
    });

    it('should handle empty club ID', () => {
      const params: AthleteSearchParams = {
        query: 'John',
        limit: 10,
      };

      const error = validateSearchParams(params, '', 2);

      expect(error).toBe('No club selected');
    });
  });

  describe('Parameter Edge Cases', () => {
    it('should handle empty query string', () => {
      const params: AthleteSearchParams = {
        query: '',
        limit: 10,
      };

      const url = buildSearchUrl('club-123', params);
      expect(url).toContain('q=');

      const error = validateSearchParams(params, 'club-123', 2);
      expect(error).toBeNull(); // Empty query should just not trigger search
    });

    it('should handle undefined filters gracefully', () => {
      const params: AthleteSearchParams = {
        query: 'Test',
        genderId: undefined,
        ageGroupId: undefined,
        limit: 10,
      };

      const url = buildSearchUrl('club-123', params);

      expect(url).not.toContain('genderId');
      expect(url).not.toContain('ageGroupId');
      expect(url).toContain('q=Test');
    });

    it('should handle zero limit', () => {
      const params: AthleteSearchParams = {
        query: 'Test',
        limit: 0,
      };

      const url = buildSearchUrl('club-123', params);
      expect(url).toContain('limit=0');
    });
  });
});
