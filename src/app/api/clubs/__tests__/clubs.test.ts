import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { getSessionWithClub } from '@/lib/auth-utils';
import { getUserClubs } from '@/lib/db';

// Mock the dependencies
vi.mock('@/lib/auth-utils');
vi.mock('@/lib/db');

const mockGetSessionWithClub = vi.mocked(getSessionWithClub);
const mockGetUserClubs = vi.mocked(getUserClubs);

describe('/api/clubs GET endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when user is not authenticated', async () => {
    // Arrange
    mockGetSessionWithClub.mockResolvedValue(null);

    // Act
    const response = await GET();
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data).toEqual({
      success: false,
      error: 'Authentication required',
      data: [],
    });
  });

  it('should return 401 when session has no user ID', async () => {
    // Arrange
    mockGetSessionWithClub.mockResolvedValue({
      user: { id: '', name: null, email: null, image: null },
      selectedClubId: null,
      expires: '2025-01-01',
    });

    // Act
    const response = await GET();
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data).toEqual({
      success: false,
      error: 'Authentication required',
      data: [],
    });
  });

  it('should return user clubs when authenticated', async () => {
    // Arrange
    const mockSession = {
      user: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
      },
      selectedClubId: 'club1',
      expires: '2025-01-01',
    };

    const mockUserClubs = [
      {
        id: 'userclub1',
        userId: 'user1',
        clubId: 'club1',
        role: 'MEMBER' as const,
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        club: {
          id: 'club1',
          name: 'Test Club',
          description: 'Test club description',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      },
      {
        id: 'userclub2',
        userId: 'user1',
        clubId: 'club2',
        role: 'ADMIN' as const,
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        club: {
          id: 'club2',
          name: 'Admin Club',
          description: 'Admin club description',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      },
    ];

    // Expected response after JSON serialization
    const expectedSerializedData = [
      {
        id: 'userclub1',
        userId: 'user1',
        clubId: 'club1',
        role: 'MEMBER',
        isActive: true,
        joinedAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        club: {
          id: 'club1',
          name: 'Test Club',
          description: 'Test club description',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      },
      {
        id: 'userclub2',
        userId: 'user1',
        clubId: 'club2',
        role: 'ADMIN',
        isActive: true,
        joinedAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        club: {
          id: 'club2',
          name: 'Admin Club',
          description: 'Admin club description',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      },
    ];

    mockGetSessionWithClub.mockResolvedValue(mockSession);
    mockGetUserClubs.mockResolvedValue(mockUserClubs);

    // Act
    const response = await GET();
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: expectedSerializedData,
      selectedClubId: 'club1',
    });
    expect(mockGetUserClubs).toHaveBeenCalledWith('user1');
  });

  it('should return empty array when user has no clubs', async () => {
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
    mockGetUserClubs.mockResolvedValue([]);

    // Act
    const response = await GET();
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: [],
      selectedClubId: null,
    });
  });

  it('should return 500 when database error occurs', async () => {
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
    mockGetUserClubs.mockRejectedValue(new Error('Database connection failed'));

    // Act
    const response = await GET();
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: 'Failed to fetch clubs',
      data: [],
    });
  });

  it('should return 500 when session retrieval fails', async () => {
    // Arrange
    mockGetSessionWithClub.mockRejectedValue(new Error('Session error'));

    // Act
    const response = await GET();
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: 'Failed to fetch clubs',
      data: [],
    });
  });
});
