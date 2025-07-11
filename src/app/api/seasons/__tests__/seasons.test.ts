import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET, POST } from '../route';
import { prisma } from '@/lib/db';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/db', () => ({
  prisma: {
    season: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    userClub: {
      findFirst: vi.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as any;
const mockPrisma = prisma as any;

describe('/api/seasons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET endpoint', () => {
    it('should return all seasons for authenticated user', async () => {
      // Mock authentication
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      // Mock database response
      const mockSeasons = [
        {
          id: 'season1',
          name: 'Track & Field',
          description: 'Outdoor track season',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { disciplines: 5 },
        },
        {
          id: 'season2',
          name: 'Indoors',
          description: 'Indoor track season',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { disciplines: 3 },
        },
      ];

      mockPrisma.season.findMany.mockResolvedValue(mockSeasons);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.data[0].name).toBe('Track & Field');
      expect(data.data[1].name).toBe('Indoors');
      expect(mockPrisma.season.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { disciplines: true },
          },
        },
      });
    });

    it('should return 401 for unauthenticated users', async () => {
      // Mock no authentication
      mockGetServerSession.mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
      expect(mockPrisma.season.findMany).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      // Mock authentication
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      // Mock database error
      mockPrisma.season.findMany.mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch seasons');
    });
  });

  describe('POST endpoint', () => {
    const validSeasonData = {
      name: 'Cross Country',
      description: 'Cross country season',
    };

    it('should create season for admin user', async () => {
      // Mock authentication with admin role
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        id: 'userclub1',
        userId: 'user1',
        clubId: 'club1',
        role: 'ADMIN',
        isActive: true,
      });

      // Mock no existing season
      mockPrisma.season.findUnique.mockResolvedValue(null);

      // Mock creation success
      const mockCreatedSeason = {
        id: 'season3',
        ...validSeasonData,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { disciplines: 0 },
      };

      mockPrisma.season.create.mockResolvedValue(mockCreatedSeason);

      const request = new NextRequest('http://localhost/api/seasons', {
        method: 'POST',
        body: JSON.stringify(validSeasonData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Cross Country');
      expect(data.data.description).toBe('Cross country season');
      expect(data.message).toBe('Season created successfully');
      expect(mockPrisma.season.create).toHaveBeenCalledWith({
        data: validSeasonData,
        include: {
          _count: {
            select: { disciplines: true },
          },
        },
      });
    });

    it('should create season for owner user', async () => {
      // Mock authentication with owner role
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        id: 'userclub1',
        userId: 'user1',
        clubId: 'club1',
        role: 'OWNER',
        isActive: true,
      });

      mockPrisma.season.findUnique.mockResolvedValue(null);

      const mockCreatedSeason = {
        id: 'season3',
        ...validSeasonData,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { disciplines: 0 },
      };

      mockPrisma.season.create.mockResolvedValue(mockCreatedSeason);

      const request = new NextRequest('http://localhost/api/seasons', {
        method: 'POST',
        body: JSON.stringify(validSeasonData),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it('should return 401 for unauthenticated users', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/seasons', {
        method: 'POST',
        body: JSON.stringify(validSeasonData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
      expect(mockPrisma.season.create).not.toHaveBeenCalled();
    });

    it('should return 403 for member users', async () => {
      // Mock authentication with member role (insufficient)
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue(null); // No admin/owner role found

      const request = new NextRequest('http://localhost/api/seasons', {
        method: 'POST',
        body: JSON.stringify(validSeasonData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe(
        'Insufficient permissions - Admin or Owner role required'
      );
      expect(mockPrisma.season.create).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid data', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      const invalidData = {
        name: '', // Invalid: empty name
        description: 'Test description',
      };

      const request = new NextRequest('http://localhost/api/seasons', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
      expect(mockPrisma.season.create).not.toHaveBeenCalled();
    });

    it('should return 409 for duplicate season name', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      // Mock existing season
      mockPrisma.season.findUnique.mockResolvedValue({
        id: 'existing-season',
        name: 'Cross Country',
      });

      const request = new NextRequest('http://localhost/api/seasons', {
        method: 'POST',
        body: JSON.stringify(validSeasonData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe('Season with this name already exists');
      expect(mockPrisma.season.create).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      mockPrisma.season.findUnique.mockResolvedValue(null);

      // Mock database error
      mockPrisma.season.create.mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest('http://localhost/api/seasons', {
        method: 'POST',
        body: JSON.stringify(validSeasonData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create season');
    });

    it('should validate season name length limits', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      const longNameData = {
        name: 'A'.repeat(65), // Exceeds 64 character limit
        description: 'Test description',
      };

      const request = new NextRequest('http://localhost/api/seasons', {
        method: 'POST',
        body: JSON.stringify(longNameData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details[0].message).toContain('64 characters or less');
    });

    it('should handle optional description field', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      mockPrisma.season.findUnique.mockResolvedValue(null);

      const dataWithoutDescription = {
        name: 'Test Season',
      };

      const mockCreatedSeason = {
        id: 'season3',
        name: 'Test Season',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { disciplines: 0 },
      };

      mockPrisma.season.create.mockResolvedValue(mockCreatedSeason);

      const request = new NextRequest('http://localhost/api/seasons', {
        method: 'POST',
        body: JSON.stringify(dataWithoutDescription),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(mockPrisma.season.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Season',
          description: undefined,
        },
        include: {
          _count: {
            select: { disciplines: true },
          },
        },
      });
    });
  });
});
