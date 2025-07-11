// Performance API individual operations tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET, PUT, DELETE } from '../route';
import { prisma } from '@/lib/db';
import {
  validatePerformanceData,
  checkDuplicatePerformance,
  PerformanceUpdateSchema,
} from '@/lib/performanceValidation';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/db', () => ({
  prisma: {
    userClub: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/performanceValidation', () => ({
  PerformanceUpdateSchema: {
    safeParse: vi.fn(),
  },
  validatePerformanceData: vi.fn(),
  checkDuplicatePerformance: vi.fn(),
}));

const mockGetServerSession = getServerSession as any;
const mockPrisma = prisma as any;
const mockValidatePerformanceData = validatePerformanceData as any;
const mockCheckDuplicatePerformance = checkDuplicatePerformance as any;
const mockPerformanceUpdateSchema = PerformanceUpdateSchema as any;

// Helper to create mock request with params
const createMockRequest = (url: string, method: string = 'GET', body?: any) => {
  return new NextRequest(url, {
    method,
    ...(body && { body: JSON.stringify(body) }),
  });
};

const createMockParams = (id: string) => Promise.resolve({ id });

describe('/api/performances/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET endpoint', () => {
    const mockPerformance = {
      id: 'perf-1',
      athleteId: 'athlete-1',
      disciplineId: 'discipline-1',
      ageGroupId: 'age-group-1',
      genderId: 'gender-1',
      medalId: 'medal-1',
      timeSeconds: 12.5,
      distanceMeters: null,
      date: '2024-01-15T00:00:00.000Z',
      eventDetails: 'School Championships',
      isPersonalBest: true,
      isClubRecord: false,
      athlete: {
        id: 'athlete-1',
        firstName: 'John',
        lastName: 'Doe',
        clubId: 'club-1',
        club: {
          id: 'club-1',
          name: 'Athletics Club',
        },
      },
      discipline: {
        id: 'discipline-1',
        name: '100m Sprint',
        isTimed: true,
        isMeasured: false,
        teamSize: null,
        season: {
          id: 'season-1',
          name: 'Track & Field',
        },
      },
      ageGroup: {
        id: 'age-group-1',
        name: 'U18',
        ordinal: 18,
      },
      gender: {
        id: 'gender-1',
        name: 'Male',
        initial: 'M',
      },
      medal: {
        id: 'medal-1',
        position: 1,
        name: 'Gold',
      },
    };

    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1'
      );
      const params = createMockParams('perf-1');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return performance by ID when authenticated', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      // Mock performance query
      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(mockPerformance),
      };

      mockPrisma.userClub.findUnique.mockResolvedValue({
        role: 'MEMBER',
        isActive: true,
      });

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1'
      );
      const params = createMockParams('perf-1');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockPerformance);
    });

    it('should return 404 when performance not found', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(null),
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances/nonexistent'
      );
      const params = createMockParams('nonexistent');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Performance not found');
    });

    it('should return 403 when user has no access to club', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(mockPerformance),
      };

      mockPrisma.userClub.findUnique.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1'
      );
      const params = createMockParams('perf-1');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Access denied to this performance');
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi
          .fn()
          .mockRejectedValue(new Error('Database connection failed')),
      };

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1'
      );
      const params = createMockParams('perf-1');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch performance');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching performance:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('PUT endpoint', () => {
    const existingPerformance = {
      id: 'perf-1',
      athleteId: 'athlete-1',
      disciplineId: 'discipline-1',
      ageGroupId: 'age-group-1',
      genderId: 'gender-1',
      medalId: 'medal-1',
      timeSeconds: 12.5,
      date: new Date('2024-01-15T00:00:00.000Z'),
      eventDetails: 'School Championships',
      athlete: {
        id: 'athlete-1',
        clubId: 'club-1',
        firstName: 'John',
        lastName: 'Doe',
      },
    };

    const validUpdateData = {
      timeSeconds: 12.3,
      medalId: 'medal-2',
      eventDetails: 'Updated Championships',
    };

    beforeEach(() => {
      // Reset the mock for each test
      mockPerformanceUpdateSchema.safeParse.mockReturnValue({
        success: true,
        data: validUpdateData,
      });
    });

    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'PUT',
        validUpdateData
      );
      const params = createMockParams('perf-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 400 for validation errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      mockPerformanceUpdateSchema.safeParse.mockReturnValue({
        success: false,
        error: {
          issues: [
            {
              path: ['timeSeconds'],
              message: 'Time must be a positive number',
            },
          ],
        },
      });

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'PUT',
        { timeSeconds: -1 }
      );
      const params = createMockParams('perf-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('should return 404 when performance not found', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(null),
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances/nonexistent',
        'PUT',
        validUpdateData
      );
      const params = createMockParams('nonexistent');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Performance not found');
    });

    it('should return 403 when user has no access to club', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(existingPerformance),
      };

      mockPrisma.userClub.findUnique.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'PUT',
        validUpdateData
      );
      const params = createMockParams('perf-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Access denied to this performance');
    });

    it('should return 400 for performance validation errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(existingPerformance),
      };

      mockPrisma.userClub.findUnique.mockResolvedValue({
        role: 'MEMBER',
        isActive: true,
      });

      mockValidatePerformanceData.mockResolvedValue({
        isValid: false,
        errors: ['Invalid time value for this discipline'],
        warnings: [],
      });

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'PUT',
        validUpdateData
      );
      const params = createMockParams('perf-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Performance validation failed');
      expect(data.details).toEqual(['Invalid time value for this discipline']);
    });

    it('should return 409 for duplicate performance', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(existingPerformance),
      };

      mockPrisma.userClub.findUnique.mockResolvedValue({
        role: 'MEMBER',
        isActive: true,
      });

      mockValidatePerformanceData.mockResolvedValue({
        isValid: true,
        errors: [],
        warnings: [],
      });

      mockCheckDuplicatePerformance.mockResolvedValue(true);

      const updateWithDate = {
        ...validUpdateData,
        date: '2024-01-16',
      };

      mockPerformanceUpdateSchema.safeParse.mockReturnValue({
        success: true,
        data: updateWithDate,
      });

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'PUT',
        updateWithDate
      );
      const params = createMockParams('perf-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe(
        'A performance with these details already exists for this athlete'
      );
    });

    it('should return 400 for invalid medal', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(existingPerformance),
        update: vi.fn(),
      };

      mockPrisma.userClub.findUnique.mockResolvedValue({
        role: 'MEMBER',
        isActive: true,
      });

      mockValidatePerformanceData.mockResolvedValue({
        isValid: true,
        errors: [],
        warnings: [],
      });

      mockCheckDuplicatePerformance.mockResolvedValue(false);

      // Mock medal query
      (prisma as any).medal = {
        findUnique: vi.fn().mockResolvedValue(null),
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'PUT',
        validUpdateData
      );
      const params = createMockParams('perf-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid medal selected');
    });

    it('should update performance successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(existingPerformance),
        update: vi.fn(),
      };

      mockPrisma.userClub.findUnique.mockResolvedValue({
        role: 'MEMBER',
        isActive: true,
      });

      mockValidatePerformanceData.mockResolvedValue({
        isValid: true,
        errors: [],
        warnings: [],
      });

      mockCheckDuplicatePerformance.mockResolvedValue(false);

      const mockMedal = {
        id: 'medal-2',
        position: 2,
        name: 'Silver',
      };

      (prisma as any).medal = {
        findUnique: vi.fn().mockResolvedValue(mockMedal),
      };

      const updatedPerformance = {
        ...existingPerformance,
        ...validUpdateData,
        medal: mockMedal,
      };

      (prisma as any).performance.update.mockResolvedValue(updatedPerformance);

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'PUT',
        validUpdateData
      );
      const params = createMockParams('perf-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      // Expected result should match the serialized format (date as string)
      const expectedResult = {
        ...updatedPerformance,
        date: updatedPerformance.date.toISOString(),
      };

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(expectedResult);
      expect(data.message).toBe('Performance updated successfully');
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi
          .fn()
          .mockRejectedValue(new Error('Database connection failed')),
      };

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'PUT',
        validUpdateData
      );
      const params = createMockParams('perf-1');
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update performance');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error updating performance:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('DELETE endpoint', () => {
    const existingPerformance = {
      id: 'perf-1',
      athlete: {
        id: 'athlete-1',
        clubId: 'club-1',
        firstName: 'John',
        lastName: 'Doe',
      },
      discipline: {
        id: 'discipline-1',
        name: '100m Sprint',
      },
    };

    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'DELETE'
      );
      const params = createMockParams('perf-1');
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 404 when performance not found', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(null),
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances/nonexistent',
        'DELETE'
      );
      const params = createMockParams('nonexistent');
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Performance not found');
    });

    it('should return 403 when user has no access to club', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(existingPerformance),
      };

      mockPrisma.userClub.findUnique.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'DELETE'
      );
      const params = createMockParams('perf-1');
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Access denied to this performance');
    });

    it('should delete performance successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi.fn().mockResolvedValue(existingPerformance),
        delete: vi.fn().mockResolvedValue(existingPerformance),
      };

      mockPrisma.userClub.findUnique.mockResolvedValue({
        role: 'MEMBER',
        isActive: true,
      });

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'DELETE'
      );
      const params = createMockParams('perf-1');
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe(
        'Performance for John Doe in 100m Sprint deleted successfully'
      );
      expect((prisma as any).performance.delete).toHaveBeenCalledWith({
        where: { id: 'perf-1' },
      });
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
      } as any);

      (prisma as any).performance = {
        findUnique: vi
          .fn()
          .mockRejectedValue(new Error('Database connection failed')),
      };

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const request = createMockRequest(
        'http://localhost:3000/api/performances/perf-1',
        'DELETE'
      );
      const params = createMockParams('perf-1');
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to delete performance');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error deleting performance:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
