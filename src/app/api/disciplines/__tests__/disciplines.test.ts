import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET, POST } from '../route';
import { prisma } from '@/lib/db';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/db', () => ({
  prisma: {
    discipline: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    season: {
      findUnique: vi.fn(),
    },
    userClub: {
      findFirst: vi.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as any;
const mockPrisma = prisma as any;

describe('/api/disciplines', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET endpoint', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/disciplines');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return all disciplines when authenticated', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      const mockDisciplines = [
        {
          id: 'discipline-1',
          name: '100m',
          seasonId: 'season-1',
          isTimed: true,
          isMeasured: false,
          isSmallerBetter: true,
          teamSize: null,
          season: { id: 'season-1', name: 'Track & Field', description: null },
        },
        {
          id: 'discipline-2',
          name: 'Shot Put',
          seasonId: 'season-1',
          isTimed: false,
          isMeasured: true,
          isSmallerBetter: false,
          teamSize: null,
          season: { id: 'season-1', name: 'Track & Field', description: null },
        },
      ];

      mockPrisma.discipline.findMany.mockResolvedValue(mockDisciplines);

      const request = new NextRequest('http://localhost:3000/api/disciplines');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockDisciplines);
      expect(mockPrisma.discipline.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          season: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        orderBy: [
          {
            season: {
              name: 'asc',
            },
          },
          {
            name: 'asc',
          },
        ],
      });
    });

    it('should filter disciplines by season when season parameter provided', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      const mockDisciplines = [
        {
          id: 'discipline-1',
          name: '100m',
          seasonId: 'season-1',
          season: { id: 'season-1', name: 'Track & Field', description: null },
        },
      ];

      mockPrisma.discipline.findMany.mockResolvedValue(mockDisciplines);

      const request = new NextRequest(
        'http://localhost:3000/api/disciplines?season=season-1'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.discipline.findMany).toHaveBeenCalledWith({
        where: { seasonId: 'season-1' },
        include: {
          season: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        orderBy: [
          {
            season: {
              name: 'asc',
            },
          },
          {
            name: 'asc',
          },
        ],
      });
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.discipline.findMany.mockRejectedValue(
        new Error('Database connection failed')
      );

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const request = new NextRequest('http://localhost:3000/api/disciplines');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch disciplines');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching disciplines:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('POST endpoint', () => {
    const validDisciplineData = {
      seasonId: 'season-1',
      name: '100m Sprint',
      description: 'Individual timed sprint event',
      isTimed: true,
      isMeasured: false,
      teamSize: null,
    };

    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/disciplines', {
        method: 'POST',
        body: JSON.stringify(validDisciplineData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 403 when user lacks admin/owner permissions', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/disciplines', {
        method: 'POST',
        body: JSON.stringify(validDisciplineData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe(
        'Insufficient permissions - Admin or Owner role required'
      );
    });

    it('should create timed discipline successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      mockPrisma.season.findUnique.mockResolvedValue({
        id: 'season-1',
        name: 'Track & Field',
      } as any);

      mockPrisma.discipline.findUnique.mockResolvedValue(null); // No duplicate

      const createdDiscipline = {
        id: 'discipline-1',
        ...validDisciplineData,
        isSmallerBetter: true, // Auto-set for timed events
        season: { id: 'season-1', name: 'Track & Field', description: null },
      };

      mockPrisma.discipline.create.mockResolvedValue(createdDiscipline);

      const request = new NextRequest('http://localhost:3000/api/disciplines', {
        method: 'POST',
        body: JSON.stringify(validDisciplineData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(createdDiscipline);
      expect(data.message).toBe('Discipline created successfully');
      expect(mockPrisma.discipline.create).toHaveBeenCalledWith({
        data: {
          seasonId: 'season-1',
          name: '100m Sprint',
          description: 'Individual timed sprint event',
          isTimed: true,
          isMeasured: false,
          isSmallerBetter: true,
          teamSize: null,
        },
        include: {
          season: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });
    });

    it('should create measured discipline successfully', async () => {
      const measuredDisciplineData = {
        seasonId: 'season-1',
        name: 'Shot Put',
        description: 'Individual measured throwing event',
        isTimed: false,
        isMeasured: true,
        teamSize: null,
      };

      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      mockPrisma.season.findUnique.mockResolvedValue({
        id: 'season-1',
        name: 'Track & Field',
      } as any);

      mockPrisma.discipline.findUnique.mockResolvedValue(null);

      const createdDiscipline = {
        id: 'discipline-2',
        ...measuredDisciplineData,
        isSmallerBetter: false, // Auto-set for measured events
        season: { id: 'season-1', name: 'Track & Field', description: null },
      };

      mockPrisma.discipline.create.mockResolvedValue(createdDiscipline);

      const request = new NextRequest('http://localhost:3000/api/disciplines', {
        method: 'POST',
        body: JSON.stringify(measuredDisciplineData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(mockPrisma.discipline.create).toHaveBeenCalledWith({
        data: {
          seasonId: 'season-1',
          name: 'Shot Put',
          description: 'Individual measured throwing event',
          isTimed: false,
          isMeasured: true,
          isSmallerBetter: false,
          teamSize: null,
        },
        include: {
          season: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });
    });

    it('should create team discipline with valid team size', async () => {
      const teamDisciplineData = {
        seasonId: 'season-1',
        name: '4x100m Relay',
        description: 'Team relay race',
        isTimed: true,
        isMeasured: false,
        teamSize: 4,
      };

      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      mockPrisma.season.findUnique.mockResolvedValue({
        id: 'season-1',
        name: 'Track & Field',
      } as any);

      mockPrisma.discipline.findUnique.mockResolvedValue(null);

      const createdDiscipline = {
        id: 'discipline-3',
        ...teamDisciplineData,
        isSmallerBetter: true,
        season: { id: 'season-1', name: 'Track & Field', description: null },
      };

      mockPrisma.discipline.create.mockResolvedValue(createdDiscipline);

      const request = new NextRequest('http://localhost:3000/api/disciplines', {
        method: 'POST',
        body: JSON.stringify(teamDisciplineData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.teamSize).toBe(4);
    });

    it('should return 400 for validation errors - missing required fields', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      const invalidData = {
        name: '100m',
        // Missing seasonId, isTimed, isMeasured
      };

      const request = new NextRequest('http://localhost:3000/api/disciplines', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('should return 400 for business rule violation - both timed and measured', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      const invalidData = {
        seasonId: 'season-1',
        name: 'Invalid Event',
        isTimed: true,
        isMeasured: true, // Both true - violates business rule
      };

      const request = new NextRequest('http://localhost:3000/api/disciplines', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('should return 400 for business rule violation - neither timed nor measured', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      const invalidData = {
        seasonId: 'season-1',
        name: 'Invalid Event',
        isTimed: false,
        isMeasured: false, // Both false - violates business rule
      };

      const request = new NextRequest('http://localhost:3000/api/disciplines', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('should return 400 for invalid season ID', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      mockPrisma.season.findUnique.mockResolvedValue(null); // Season not found

      const request = new NextRequest('http://localhost:3000/api/disciplines', {
        method: 'POST',
        body: JSON.stringify(validDisciplineData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid season ID');
    });

    it('should return 409 for duplicate discipline name in same season', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      mockPrisma.season.findUnique.mockResolvedValue({
        id: 'season-1',
        name: 'Track & Field',
      } as any);

      mockPrisma.discipline.findUnique.mockResolvedValue({
        id: 'existing-discipline',
        name: '100m Sprint',
      } as any); // Duplicate found

      const request = new NextRequest('http://localhost:3000/api/disciplines', {
        method: 'POST',
        body: JSON.stringify(validDisciplineData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe(
        'Discipline "100m Sprint" already exists in Track & Field season'
      );
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      mockPrisma.season.findUnique.mockRejectedValue(
        new Error('Database connection failed')
      );

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const request = new NextRequest('http://localhost:3000/api/disciplines', {
        method: 'POST',
        body: JSON.stringify(validDisciplineData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create discipline');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error creating discipline:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
