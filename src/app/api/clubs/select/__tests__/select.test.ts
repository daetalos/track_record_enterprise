import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../route';
import { getSessionWithClub } from '@/lib/auth-utils';
import { userHasClubAccess } from '@/lib/db';

// Mock the dependencies
vi.mock('@/lib/auth-utils');
vi.mock('@/lib/db');

const mockGetSessionWithClub = vi.mocked(getSessionWithClub);
const mockUserHasClubAccess = vi.mocked(userHasClubAccess);

// Helper function to create mock request
const createMockRequest = (body: Record<string, unknown>): NextRequest => {
  const json = vi.fn().mockResolvedValue(body);
  return {
    json,
  } as unknown as NextRequest;
};

describe('/api/clubs/select POST endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when user is not authenticated', async () => {
    // Arrange
    mockGetSessionWithClub.mockResolvedValue(null);
    const request = createMockRequest({ clubId: 'club1' });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data).toEqual({
      success: false,
      error: 'Authentication required',
    });
  });

  it('should return 401 when session has no user ID', async () => {
    // Arrange
    mockGetSessionWithClub.mockResolvedValue({
      user: { id: '', name: null, email: null, image: null },
      selectedClubId: null,
      expires: '2025-01-01',
    });
    const request = createMockRequest({ clubId: 'club1' });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data).toEqual({
      success: false,
      error: 'Authentication required',
    });
  });

  it('should return 400 when request body is invalid JSON', async () => {
    // Arrange
    const mockSession = {
      user: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
      },
      selectedClubId: null,
      expires: '2025-01-01',
    };

    mockGetSessionWithClub.mockResolvedValue(mockSession);

    const request = {
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as unknown as NextRequest;

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Invalid request body',
    });
  });

  it('should return 400 when clubId is missing', async () => {
    // Arrange
    const mockSession = {
      user: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
      },
      selectedClubId: null,
      expires: '2025-01-01',
    };

    mockGetSessionWithClub.mockResolvedValue(mockSession);
    const request = createMockRequest({});

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Club ID is required and must be a string',
    });
  });

  it('should return 400 when clubId is not a string', async () => {
    // Arrange
    const mockSession = {
      user: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
      },
      selectedClubId: null,
      expires: '2025-01-01',
    };

    mockGetSessionWithClub.mockResolvedValue(mockSession);
    const request = createMockRequest({ clubId: 123 });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: 'Club ID is required and must be a string',
    });
  });

  it('should return 403 when user does not have access to club', async () => {
    // Arrange
    const mockSession = {
      user: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
      },
      selectedClubId: null,
      expires: '2025-01-01',
    };

    mockGetSessionWithClub.mockResolvedValue(mockSession);
    mockUserHasClubAccess.mockResolvedValue(false);
    const request = createMockRequest({ clubId: 'club1' });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(403);
    expect(data).toEqual({
      success: false,
      error: 'Access denied to the specified club',
    });
    expect(mockUserHasClubAccess).toHaveBeenCalledWith('user1', 'club1');
  });

  it('should return 200 when club selection is successful', async () => {
    // Arrange
    const mockSession = {
      user: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
      },
      selectedClubId: 'oldclub',
      expires: '2025-01-01',
    };

    mockGetSessionWithClub.mockResolvedValue(mockSession);
    mockUserHasClubAccess.mockResolvedValue(true);
    const request = createMockRequest({ clubId: 'club1' });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      message: 'Club selection processed successfully',
    });
    expect(mockUserHasClubAccess).toHaveBeenCalledWith('user1', 'club1');
  });

  it('should return 500 when database error occurs during access check', async () => {
    // Arrange
    const mockSession = {
      user: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
      },
      selectedClubId: null,
      expires: '2025-01-01',
    };

    mockGetSessionWithClub.mockResolvedValue(mockSession);
    mockUserHasClubAccess.mockRejectedValue(
      new Error('Database connection failed')
    );
    const request = createMockRequest({ clubId: 'club1' });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: 'Failed to select club',
    });
  });

  it('should return 500 when session retrieval fails', async () => {
    // Arrange
    mockGetSessionWithClub.mockRejectedValue(new Error('Session error'));
    const request = createMockRequest({ clubId: 'club1' });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: 'Failed to select club',
    });
  });
});
