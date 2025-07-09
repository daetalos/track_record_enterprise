import { describe, expect, it } from 'vitest';
import { withClubFilter, getClubFromHeaders, getUserFromHeaders } from '../db';

describe('Club Filtering Utilities', () => {
  describe('withClubFilter', () => {
    it('should return club filter when club ID is provided', () => {
      const filter = withClubFilter('club-123');
      expect(filter).toEqual({ clubId: 'club-123' });
    });

    it('should return never-matches filter when club ID is null', () => {
      const filter = withClubFilter(null);
      expect(filter).toEqual({ id: 'never-matches' });
    });

    it('should return never-matches filter when club ID is undefined', () => {
      const filter = withClubFilter(undefined as unknown as null);
      expect(filter).toEqual({ id: 'never-matches' });
    });
  });

  describe('getClubFromHeaders', () => {
    it('should return club ID from headers', () => {
      const headers = new Headers();
      headers.set('x-club-id', 'club-123');

      const clubId = getClubFromHeaders(headers);
      expect(clubId).toBe('club-123');
    });

    it('should return null when no club ID in headers', () => {
      const headers = new Headers();

      const clubId = getClubFromHeaders(headers);
      expect(clubId).toBeNull();
    });

    it('should return null when club ID header is empty', () => {
      const headers = new Headers();
      headers.set('x-club-id', '');

      const clubId = getClubFromHeaders(headers);
      expect(clubId).toBeNull(); // Empty string is treated as falsy and returns null
    });
  });

  describe('getUserFromHeaders', () => {
    it('should return user ID from headers', () => {
      const headers = new Headers();
      headers.set('x-user-id', 'user-456');

      const userId = getUserFromHeaders(headers);
      expect(userId).toBe('user-456');
    });

    it('should return null when no user ID in headers', () => {
      const headers = new Headers();

      const userId = getUserFromHeaders(headers);
      expect(userId).toBeNull();
    });
  });
});
