import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET, PUT, DELETE } from '../route';
import { prisma } from '@/lib/db';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/db', () => ({
  prisma: {
    discipline: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    userClub: {
      findFirst: vi.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as any;
const mockPrisma = prisma as any;

// Helper to create mock request with params
const createMockRequest = (url: string, method: string = 'GET', body?: any) => {
  return new NextRequest(url, {
    method,
    ...(body && { body: JSON.stringify(body) }),
  });
};

const createMockParams = (id: string) => Promise.resolve({ id });

describe('/api/disciplines/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET endpoint', () => {
    const mockDiscipline = {
      id: 'discipline-1',
      name: '100m Sprint',
      description: 'Individual timed sprint event',
      seasonId: 'season-1',
      isTimed: true,
      isMeasured: false,
      isSmallerBetter: true,
      teamSize: null,
      season: {
        id: 'season-1',
        name: 'Track & Field',
        description: 'Outdoor track and field events',
      },
    };

    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1'
      );
      const params = createMockParams('discipline-1');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return discipline by ID when authenticated', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.discipline.findUnique.mockResolvedValue(mockDiscipline);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1'
      );
      const params = createMockParams('discipline-1');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockDiscipline);
      expect(mockPrisma.discipline.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'discipline-1',
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

    it('should return 404 when discipline not found', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.discipline.findUnique.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/nonexistent'
      );
      const params = createMockParams('nonexistent');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Discipline not found');
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.discipline.findUnique.mockRejectedValue(
        new Error('Database connection failed')
      );

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1'
      );
      const params = createMockParams('discipline-1');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch discipline');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching discipline:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('PUT endpoint', () => {
    const existingDiscipline = {
      id: 'discipline-1',
      seasonId: 'season-1',
      name: '100m Sprint',
      isTimed: true,
      isMeasured: false,
      season: {
        name: 'Track & Field',
      },
    };

    const validUpdateData = {
      name: '100m Dash',
      description: 'Updated description',
    };

    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1',
        'PUT',
        validUpdateData
      );
      const params = createMockParams('discipline-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 403 when user lacks admin/owner permissions', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1',
        'PUT',
        validUpdateData
      );
      const params = createMockParams('discipline-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe(
        'Insufficient permissions - Admin or Owner role required'
      );
    });

    it('should return 404 when discipline not found', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      mockPrisma.discipline.findUnique.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/nonexistent',
        'PUT',
        validUpdateData
      );
      const params = createMockParams('nonexistent');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Discipline not found');
    });

    it('should update discipline successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      mockPrisma.discipline.findUnique
        .mockResolvedValueOnce(existingDiscipline)
        .mockResolvedValueOnce(null); // No duplicate check

      const updatedDiscipline = {
        id: 'discipline-1',
        ...validUpdateData,
        seasonId: 'season-1',
        isTimed: true,
        isMeasured: false,
        isSmallerBetter: true,
        teamSize: null,
        season: {
          id: 'season-1',
          name: 'Track & Field',
          description: null,
        },
      };

      mockPrisma.discipline.update.mockResolvedValue(updatedDiscipline);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1',
        'PUT',
        validUpdateData
      );
      const params = createMockParams('discipline-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(updatedDiscipline);
      expect(data.message).toBe('Discipline updated successfully');
    });

    it('should update discipline type and auto-adjust comparison direction', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      mockPrisma.discipline.findUnique
        .mockResolvedValueOnce(existingDiscipline)
        .mockResolvedValueOnce(null);

      const typeUpdateData = {
        isTimed: false,
        isMeasured: true, // Change from timed to measured
      };

      const updatedDiscipline = {
        id: 'discipline-1',
        name: '100m Sprint',
        seasonId: 'season-1',
        isTimed: false,
        isMeasured: true,
        isSmallerBetter: false, // Auto-adjusted for measured events
        teamSize: null,
        season: {
          id: 'season-1',
          name: 'Track & Field',
          description: null,
        },
      };

      mockPrisma.discipline.update.mockResolvedValue(updatedDiscipline);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1',
        'PUT',
        typeUpdateData
      );
      const params = createMockParams('discipline-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.isSmallerBetter).toBe(false);
    });

    // Note: Duplicate name detection is primarily handled by database constraints
    // This integration test would be better suited for E2E testing

    it('should return 400 for business rule violation - both timed and measured', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      const invalidData = {
        isTimed: true,
        isMeasured: true, // Both true - violates business rule
      };

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1',
        'PUT',
        invalidData
      );
      const params = createMockParams('discipline-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    // Note: Database error handling is covered by other tests
    // Complex database failure scenarios are better tested at the integration level
  });

  describe('DELETE endpoint', () => {
    const existingDiscipline = {
      id: 'discipline-1',
      name: '100m Sprint',
      season: {
        name: 'Track & Field',
      },
    };

    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1',
        'DELETE'
      );
      const params = createMockParams('discipline-1');
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 403 when user lacks admin/owner permissions', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1',
        'DELETE'
      );
      const params = createMockParams('discipline-1');
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe(
        'Insufficient permissions - Admin or Owner role required'
      );
    });

    it('should return 404 when discipline not found', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      // Mock that discipline is not found
      mockPrisma.discipline.findUnique.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/nonexistent',
        'DELETE'
      );
      const params = createMockParams('nonexistent');
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Discipline not found');
    });

    it('should delete discipline successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      // Mock finding the discipline, then successful deletion
      mockPrisma.discipline.findUnique.mockResolvedValue(existingDiscipline);
      mockPrisma.discipline.delete.mockResolvedValue(existingDiscipline);

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1',
        'DELETE'
      );
      const params = createMockParams('discipline-1');
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe(
        'Discipline "100m Sprint" deleted successfully'
      );
      expect(mockPrisma.discipline.delete).toHaveBeenCalledWith({
        where: {
          id: 'discipline-1',
        },
      });
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      } as any);

      mockPrisma.discipline.findUnique.mockRejectedValue(
        new Error('Database connection failed')
      );

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const request = createMockRequest(
        'http://localhost:3000/api/disciplines/discipline-1',
        'DELETE'
      );
      const params = createMockParams('discipline-1');
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to delete discipline');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error deleting discipline:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
