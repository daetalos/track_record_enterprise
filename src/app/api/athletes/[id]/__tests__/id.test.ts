import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from '../route';
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
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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
const createMockRequest = () => ({}) as NextRequest;

const createMockPutRequest = (body: Record<string, unknown>) =>
  ({
    json: () => Promise.resolve(body),
  }) as NextRequest;

const createMockParams = (id: string) => ({ id });

describe('/api/athletes/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET endpoint', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);
      const request = createMockRequest();
      const params = createMockParams('athlete1');

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Authentication required' });
    });

    it('should return 404 when athlete not found', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      mockPrisma.athlete.findUnique.mockResolvedValue(null);
      const request = createMockRequest();
      const params = createMockParams('nonexistent');

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Athlete not found' });
    });

    it('should return 403 when user lacks permission', async () => {
      // Arrange
      const mockAthlete = {
        id: 'athlete1',
        firstName: 'John',
        lastName: 'Doe',
        clubId: 'club1',
        genderId: 'gender1',
        ageGroupId: 'agegroup1',
        club: { id: 'club1', name: 'Test Club' },
        gender: { id: 'gender1', name: 'Male', initial: 'M' },
        ageGroup: { id: 'agegroup1', name: '10-12 Years', ordinal: 1 },
      };

      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      mockPrisma.athlete.findUnique.mockResolvedValue(mockAthlete);
      // Mock userClub check to return null (no access)
      mockPrisma.userClub.findUnique.mockResolvedValue(null);
      const request = createMockRequest();
      const params = createMockParams('athlete1');

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(403);
      expect(data).toEqual({ error: 'Access denied to this athlete' });
    });

    it('should return athlete successfully', async () => {
      // Arrange
      const mockAthlete = {
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
      mockPrisma.athlete.findUnique.mockResolvedValue(mockAthlete);
      // Mock userClub check to return permission object
      mockPrisma.userClub.findUnique.mockResolvedValue({
        userId: 'user1',
        clubId: 'club1',
        role: 'ADMIN',
        isActive: true,
      });
      const request = createMockRequest();
      const params = createMockParams('athlete1');

      // Act
      const response = await GET(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.firstName).toBe('John');
      expect(data.data.lastName).toBe('Doe');
    });
  });

  describe('PUT endpoint', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);
      const request = createMockPutRequest({
        firstName: 'John',
        lastName: 'Doe',
      });
      const params = createMockParams('athlete1');

      // Act
      const response = await PUT(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Authentication required' });
    });

    it('should return 404 when athlete not found', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      mockPrisma.athlete.findUnique.mockResolvedValue(null);
      const request = createMockPutRequest({
        firstName: 'John',
        lastName: 'Doe',
      });
      const params = createMockParams('nonexistent');

      // Act
      const response = await PUT(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Athlete not found' });
    });

    it('should update athlete successfully', async () => {
      // Arrange
      const existingAthlete = {
        id: 'athlete1',
        firstName: 'John',
        lastName: 'Doe',
        clubId: 'club1',
        genderId: 'gender1',
        ageGroupId: 'agegroup1',
      };

      const updatedAthlete = {
        ...existingAthlete,
        firstName: 'Jane',
        gender: { id: 'gender1', name: 'Male', initial: 'M' },
        ageGroup: { id: 'agegroup1', name: '10-12 Years', clubId: 'club1' },
      };

      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      mockPrisma.athlete.findUnique.mockResolvedValue(existingAthlete);
      mockVerifyAthleteManagementPermission.mockResolvedValue({
        hasPermission: true,
      });
      // Mock the duplicate check - no duplicates found
      mockPrisma.athlete.findFirst.mockResolvedValue(null);
      mockPrisma.athlete.update.mockResolvedValue(updatedAthlete);

      const request = createMockPutRequest({
        firstName: 'Jane',
      });
      const params = createMockParams('athlete1');

      // Act
      const response = await PUT(request as NextRequest, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.firstName).toBe('Jane');
    });

    it('should return 400 for invalid input data', async () => {
      // Arrange
      const existingAthlete = {
        id: 'athlete1',
        firstName: 'John',
        lastName: 'Doe',
        clubId: 'club1',
        genderId: 'gender1',
        ageGroupId: 'agegroup1',
      };

      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      mockPrisma.athlete.findUnique.mockResolvedValue(existingAthlete);
      mockVerifyAthleteManagementPermission.mockResolvedValue({
        hasPermission: true,
      });

      const request = createMockPutRequest({
        firstName: '', // Invalid: empty string
      });
      const params = createMockParams('athlete1');

      // Act
      const response = await PUT(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });
  });

  describe('DELETE endpoint', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);
      const request = createMockRequest();
      const params = createMockParams('athlete1');

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Authentication required' });
    });

    it('should return 404 when athlete not found', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      mockPrisma.athlete.findUnique.mockResolvedValue(null);
      const request = createMockRequest();
      const params = createMockParams('nonexistent');

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Athlete not found' });
    });

    it('should delete athlete successfully', async () => {
      // Arrange
      const mockAthlete = {
        id: 'athlete1',
        firstName: 'John',
        lastName: 'Doe',
        clubId: 'club1',
        genderId: 'gender1',
        ageGroupId: 'agegroup1',
      };

      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
        selectedClubId: 'club1',
      });
      mockPrisma.athlete.findUnique.mockResolvedValue(mockAthlete);
      mockVerifyAthleteManagementPermission.mockResolvedValue({
        hasPermission: true,
      });
      mockPrisma.athlete.delete.mockResolvedValue(mockAthlete);

      const request = createMockRequest();
      const params = createMockParams('athlete1');

      // Act
      const response = await DELETE(request, { params });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        message: 'Athlete deleted successfully',
      });
    });
  });
});
