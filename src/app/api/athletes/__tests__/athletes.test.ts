import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { verifyAthleteManagementPermission } from '@/lib/permissions';

// Mock the dependencies
vi.mock('next-auth');
vi.mock('@/lib/db');
vi.mock('@/lib/permissions');

const mockGetServerSession = vi.mocked(getServerSession);
const mockPrisma = {
  athlete: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
  userClub: {
    findUnique: vi.fn(),
  },
  gender: {
    findUnique: vi.fn(),
  },
  ageGroup: {
    findUnique: vi.fn(),
  },
} as any;
(vi.mocked(prisma).athlete as any) = mockPrisma.athlete;
(vi.mocked(prisma).userClub as any) = mockPrisma.userClub;
(vi.mocked(prisma).gender as any) = mockPrisma.gender;
(vi.mocked(prisma).ageGroup as any) = mockPrisma.ageGroup;

const mockVerifyAthleteManagementPermission = vi.mocked(
  verifyAthleteManagementPermission
);

// Mock Next.js request objects
const createMockRequest = (searchParams: Record<string, string> = {}) => {
  const url = new URL('http://localhost:3000/api/athletes');
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return {
    url: url.toString(),
  } as NextRequest;
};

const createMockPostRequest = (body: Record<string, unknown>) => {
  return {
    json: () => Promise.resolve(body),
  } as NextRequest;
};

describe('/api/athletes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET endpoint', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);
      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Authentication required' });
    });

    it('should return 401 when session has no user ID', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: '' },
        selectedClubId: null,
      });
      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Authentication required' });
    });

    it('should return 403 when user lacks permission', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      // Mock userClub check to return null (no access)
      mockPrisma.userClub.findUnique.mockResolvedValue(null);
      const request = createMockRequest({ clubId: 'club1' });

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(403);
      expect(data).toEqual({ error: 'Access denied to this club' });
    });

    it('should return 400 when no club ID provided', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: null,
      });
      const request = createMockRequest();

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Club ID is required',
      });
    });

    it('should return athletes for the specified club', async () => {
      // Arrange
      const mockAthletes = [
        {
          id: 'athlete1',
          firstName: 'John',
          lastName: 'Doe',
          clubId: 'club1',
          genderId: 'gender1',
          ageGroupId: 'agegroup1',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          gender: { id: 'gender1', name: 'Male', initial: 'M' },
          ageGroup: { id: 'agegroup1', name: '10-12 Years', clubId: 'club1' },
        },
        {
          id: 'athlete2',
          firstName: 'Jane',
          lastName: 'Smith',
          clubId: 'club1',
          genderId: 'gender2',
          ageGroupId: 'agegroup2',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          gender: { id: 'gender2', name: 'Female', initial: 'F' },
          ageGroup: { id: 'agegroup2', name: '13-15 Years', clubId: 'club1' },
        },
      ];

      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      // Mock userClub check to return valid access
      mockPrisma.userClub.findUnique.mockResolvedValue({
        userId: 'user1',
        clubId: 'club1',
        role: 'MEMBER',
        isActive: true,
      });
      mockPrisma.athlete.findMany.mockResolvedValue(mockAthletes);
      mockPrisma.athlete.count.mockResolvedValue(2);
      const request = createMockRequest({ clubId: 'club1' });

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.athletes).toHaveLength(2);
      expect(data.data.athletes[0].firstName).toBe('John');
      expect(data.data.athletes[1].firstName).toBe('Jane');
      expect(data.data.total).toBe(2);
    });

    it('should filter athletes by search query', async () => {
      // Arrange
      const mockAthletes = [
        {
          id: 'athlete1',
          firstName: 'John',
          lastName: 'Doe',
          clubId: 'club1',
          genderId: 'gender1',
          ageGroupId: 'agegroup1',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          gender: { id: 'gender1', name: 'Male', initial: 'M' },
          ageGroup: { id: 'agegroup1', name: '10-12 Years', clubId: 'club1' },
        },
      ];

      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      // Mock userClub check to return valid access
      mockPrisma.userClub.findUnique.mockResolvedValue({
        userId: 'user1',
        clubId: 'club1',
        role: 'MEMBER',
        isActive: true,
      });
      mockPrisma.athlete.findMany.mockResolvedValue(mockAthletes);
      mockPrisma.athlete.count.mockResolvedValue(1);
      const request = createMockRequest({ clubId: 'club1', query: 'John' });

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(200);
      expect(mockPrisma.athlete.findMany).toHaveBeenCalledWith({
        where: {
          clubId: 'club1',
          OR: [
            { firstName: { contains: 'John', mode: 'insensitive' } },
            { lastName: { contains: 'John', mode: 'insensitive' } },
          ],
        },
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        take: 50,
        skip: 0,
        include: {
          club: {
            select: {
              id: true,
              name: true,
            },
          },
          gender: {
            select: {
              id: true,
              name: true,
              initial: true,
            },
          },
          ageGroup: {
            select: {
              id: true,
              name: true,
              ordinal: true,
            },
          },
        },
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      // Mock userClub check to return valid access
      mockPrisma.userClub.findUnique.mockResolvedValue({
        userId: 'user1',
        clubId: 'club1',
        role: 'MEMBER',
        isActive: true,
      });
      mockPrisma.athlete.findMany.mockRejectedValue(
        new Error('Database connection failed')
      );
      const request = createMockRequest({ clubId: 'club1' });

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Failed to fetch athletes',
      });
    });
  });

  describe('POST endpoint', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);
      const request = createMockPostRequest({
        firstName: 'John',
        lastName: 'Doe',
        genderId: 'gender1',
        clubId: 'club1',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Authentication required' });
    });

    it('should return 403 when user lacks permission', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      mockVerifyAthleteManagementPermission.mockResolvedValue({
        hasPermission: false,
        error: 'Access denied',
      });
      const request = createMockPostRequest({
        firstName: 'John',
        lastName: 'Doe',
        genderId: 'gender1',
        clubId: 'club1',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(403);
      expect(data).toEqual({ error: 'Access denied' });
    });

    it('should return 400 for invalid input data', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      const request = createMockPostRequest({
        firstName: '', // Invalid: empty string
        lastName: 'Doe',
        genderId: 'gender1',
        clubId: 'club1',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('should create athlete successfully', async () => {
      // Arrange
      const newAthlete = {
        id: 'athlete1',
        firstName: 'John',
        lastName: 'Doe',
        clubId: 'club1',
        genderId: 'gender1',
        ageGroupId: 'agegroup1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        club: { id: 'club1', name: 'Test Club' },
        gender: { id: 'gender1', name: 'Male', initial: 'M' },
        ageGroup: { id: 'agegroup1', name: '10-12 Years', ordinal: 1 },
      };

      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      mockVerifyAthleteManagementPermission.mockResolvedValue({
        hasPermission: true,
      });
      // Mock all the validation checks
      mockPrisma.athlete.findFirst.mockResolvedValue(null); // No duplicate
      mockPrisma.gender.findUnique.mockResolvedValue({
        id: 'gender1',
        name: 'Male',
        initial: 'M',
      });
      mockPrisma.ageGroup.findUnique.mockResolvedValue({
        id: 'agegroup1',
        name: '10-12 Years',
        clubId: 'club1',
        ordinal: 1,
      });
      mockPrisma.athlete.create.mockResolvedValue(newAthlete);
      const request = createMockPostRequest({
        firstName: 'John',
        lastName: 'Doe',
        genderId: 'gender1',
        clubId: 'club1',
        ageGroupId: 'agegroup1',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.firstName).toBe('John');
      expect(data.data.lastName).toBe('Doe');
      expect(data.message).toBe('Athlete created successfully');
    });

    it('should handle duplicate athlete error', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      mockVerifyAthleteManagementPermission.mockResolvedValue({
        hasPermission: true,
      });
      // Mock existing athlete found (duplicate)
      mockPrisma.athlete.findFirst.mockResolvedValue({
        id: 'existing',
        firstName: 'John',
        lastName: 'Doe',
        clubId: 'club1',
      });
      const request = createMockPostRequest({
        firstName: 'John',
        lastName: 'Doe',
        genderId: 'gender1',
        clubId: 'club1',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(409);
      expect(data).toEqual({
        error: 'Athlete with this name already exists in this club',
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      mockVerifyAthleteManagementPermission.mockResolvedValue({
        hasPermission: true,
      });
      // Mock the validation steps to pass, but create to fail
      mockPrisma.athlete.findFirst.mockResolvedValue(null);
      mockPrisma.gender.findUnique.mockResolvedValue({
        id: 'gender1',
        name: 'Male',
        initial: 'M',
      });
      mockPrisma.athlete.create.mockRejectedValue(
        new Error('Database connection failed')
      );
      const request = createMockPostRequest({
        firstName: 'John',
        lastName: 'Doe',
        genderId: 'gender1',
        clubId: 'club1',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Failed to create athlete',
      });
    });
  });
});
