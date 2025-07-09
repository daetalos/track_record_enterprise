import { describe, expect, it } from 'vitest';
import type { NextRequest } from 'next/server';
import { extractClubIdFromRequest, requiresClubAuth } from '../clubAuth';

// Mock request helper
const createMockRequest = (url: string): NextRequest => {
  const request = new Request(url) as NextRequest;
  // Mock the nextUrl property since it's not available in Node.js Request
  Object.defineProperty(request, 'nextUrl', {
    value: new URL(url),
    writable: false,
  });
  return request;
};

describe('Club Authorization Middleware', () => {
  describe('extractClubIdFromRequest', () => {
    it('should extract club ID from URL path', () => {
      const request = createMockRequest(
        'http://localhost/api/clubs/club-123/athletes'
      );
      const clubId = extractClubIdFromRequest(request);
      expect(clubId).toBe('club-123');
    });

    it('should extract club ID from query parameters', () => {
      const request = createMockRequest(
        'http://localhost/api/athletes?clubId=club-456'
      );
      const clubId = extractClubIdFromRequest(request);
      expect(clubId).toBe('club-456');
    });

    it('should return null when select endpoint is used', () => {
      const request = createMockRequest('http://localhost/api/clubs/select');
      const clubId = extractClubIdFromRequest(request);
      expect(clubId).toBeNull();
    });

    it('should return null when no club ID is found', () => {
      const request = createMockRequest('http://localhost/api/athletes');
      const clubId = extractClubIdFromRequest(request);
      expect(clubId).toBeNull();
    });
  });

  describe('requiresClubAuth', () => {
    it('should require club auth for athlete routes', () => {
      expect(requiresClubAuth('/api/athletes')).toBe(true);
      expect(requiresClubAuth('/api/athletes/123')).toBe(true);
    });

    it('should require club auth for performance routes', () => {
      expect(requiresClubAuth('/api/performances')).toBe(true);
      expect(requiresClubAuth('/api/performances/456')).toBe(true);
    });

    it('should require club auth for records routes', () => {
      expect(requiresClubAuth('/api/records')).toBe(true);
    });

    it('should require club auth for events routes', () => {
      expect(requiresClubAuth('/api/events')).toBe(true);
    });

    it('should require club auth for dashboard routes', () => {
      expect(requiresClubAuth('/api/dashboard')).toBe(true);
    });

    it('should not require club auth for auth routes', () => {
      expect(requiresClubAuth('/api/auth/signin')).toBe(false);
      expect(requiresClubAuth('/api/auth/callback')).toBe(false);
    });

    it('should not require club auth for health routes', () => {
      expect(requiresClubAuth('/api/health')).toBe(false);
    });

    it('should not require club auth for club management routes', () => {
      expect(requiresClubAuth('/api/clubs')).toBe(false);
      expect(requiresClubAuth('/api/clubs/select')).toBe(false);
    });

    it('should not require club auth for unknown API routes', () => {
      expect(requiresClubAuth('/api/unknown')).toBe(false);
    });
  });
});
