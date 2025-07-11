// Performance API main route tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET, POST } from '../route';
import { prisma } from '@/lib/db';
import {
  validatePerformanceData,
  checkDuplicatePerformance,
  PerformanceCreateSchema,
} from '@/lib/performanceValidation';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/db', () => ({
  prisma: {
    userClub: {
      findUnique: vi.fn(),
    },
    athlete: {
      findUnique: vi.fn(),
    },
    discipline: {
      findUnique: vi.fn(),
    },
    ageGroup: {
      findUnique: vi.fn(),
    },
    gender: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/performanceValidation', () => ({
  PerformanceCreateSchema: {
    safeParse: vi.fn(),
  },
  validatePerformanceData: vi.fn(),
  checkDuplicatePerformance: vi.fn(),
}));

const mockGetServerSession = getServerSession as any;
const mockPrisma = prisma as any;
const mockValidatePerformanceData = validatePerformanceData as any;
const mockCheckDuplicatePerformance = checkDuplicatePerformance as any;
const mockPerformanceCreateSchema = PerformanceCreateSchema as any;

// Helper function to create mock NextRequest
function createMockRequest(
  url: string,
  method: string = 'GET',
  body?: any
): NextRequest {
  return new NextRequest(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe('/api/performances', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET endpoint', () => {
    const mockSession = {
      user: { id: 'user-1' },
      selectedClubId: 'club-1',
    };

    const mockUserRole = {
      userId: 'user-1',
      clubId: 'club-1',
      role: 'MEMBER',
      isActive: true,
    };

    const mockPerformances = [
      {
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
      },
    ];

    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/performances'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 400 when clubId is missing', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-1' },
        selectedClubId: null,
      });

      const request = createMockRequest(
        'http://localhost:3000/api/performances'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Club ID is required');
    });

    it('should return 403 when user has no access to club', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.userClub.findUnique.mockResolvedValue(null);

      const request = createMockRequest(
        'http://localhost:3000/api/performances'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Access denied to this club');
    });

    it('should return performances with default pagination', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.userClub.findUnique.mockResolvedValue(mockUserRole);

      // Mock the performance queries
      const mockPerformanceFindMany = vi
        .fn()
        .mockResolvedValue(mockPerformances);
      const mockPerformanceCount = vi.fn().mockResolvedValue(1);

      // Add these to the prisma mock
      (prisma as any).performance = {
        findMany: mockPerformanceFindMany,
        count: mockPerformanceCount,
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockPerformances);
      expect(data.pagination).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should handle filtering by athleteId', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.userClub.findUnique.mockResolvedValue(mockUserRole);

      const mockPerformanceFindMany = vi
        .fn()
        .mockResolvedValue(mockPerformances);
      const mockPerformanceCount = vi.fn().mockResolvedValue(1);

      (prisma as any).performance = {
        findMany: mockPerformanceFindMany,
        count: mockPerformanceCount,
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances?athleteId=athlete-1'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPerformanceFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            athleteId: 'athlete-1',
          }),
        })
      );
    });

    it('should handle filtering by disciplineId', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.userClub.findUnique.mockResolvedValue(mockUserRole);

      const mockPerformanceFindMany = vi
        .fn()
        .mockResolvedValue(mockPerformances);
      const mockPerformanceCount = vi.fn().mockResolvedValue(1);

      (prisma as any).performance = {
        findMany: mockPerformanceFindMany,
        count: mockPerformanceCount,
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances?disciplineId=discipline-1'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPerformanceFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            disciplineId: 'discipline-1',
          }),
        })
      );
    });

    it('should handle date range filtering', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.userClub.findUnique.mockResolvedValue(mockUserRole);

      const mockPerformanceFindMany = vi
        .fn()
        .mockResolvedValue(mockPerformances);
      const mockPerformanceCount = vi.fn().mockResolvedValue(1);

      (prisma as any).performance = {
        findMany: mockPerformanceFindMany,
        count: mockPerformanceCount,
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances?dateFrom=2024-01-01&dateTo=2024-12-31'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPerformanceFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: {
              gte: new Date('2024-01-01'),
              lte: new Date('2024-12-31'),
            },
          }),
        })
      );
    });

    it('should handle search filtering', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.userClub.findUnique.mockResolvedValue(mockUserRole);

      const mockPerformanceFindMany = vi
        .fn()
        .mockResolvedValue(mockPerformances);
      const mockPerformanceCount = vi.fn().mockResolvedValue(1);

      (prisma as any).performance = {
        findMany: mockPerformanceFindMany,
        count: mockPerformanceCount,
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances?search=John'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPerformanceFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              {
                athlete: {
                  firstName: {
                    contains: 'John',
                    mode: 'insensitive',
                  },
                },
              },
            ]),
          }),
        })
      );
    });

    it('should handle pagination parameters', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.userClub.findUnique.mockResolvedValue(mockUserRole);

      const mockPerformanceFindMany = vi
        .fn()
        .mockResolvedValue(mockPerformances);
      const mockPerformanceCount = vi.fn().mockResolvedValue(25);

      (prisma as any).performance = {
        findMany: mockPerformanceFindMany,
        count: mockPerformanceCount,
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances?page=2&limit=5'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pagination).toEqual({
        total: 25,
        page: 2,
        limit: 5,
        totalPages: 5,
      });
      expect(mockPerformanceFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
          skip: 5, // (page 2 - 1) * limit 5
        })
      );
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.userClub.findUnique.mockRejectedValue(
        new Error('Database connection failed')
      );

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const request = createMockRequest(
        'http://localhost:3000/api/performances'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch performances');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching performances:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('POST endpoint', () => {
    const mockSession = {
      user: { id: 'user-1' },
      selectedClubId: 'club-1',
    };

    const mockUserRole = {
      userId: 'user-1',
      clubId: 'club-1',
      role: 'MEMBER',
      isActive: true,
    };

    const mockAthlete = {
      id: 'athlete-1',
      clubId: 'club-1',
      firstName: 'John',
      lastName: 'Doe',
    };

    const mockDiscipline = {
      id: 'discipline-1',
      name: '100m Sprint',
      isTimed: true,
      isMeasured: false,
    };

    const mockAgeGroup = {
      id: 'age-group-1',
      name: 'U18',
      ordinal: 18,
    };

    const mockGender = {
      id: 'gender-1',
      name: 'Male',
      initial: 'M',
    };

    const mockMedal = {
      id: 'medal-1',
      position: 1,
      name: 'Gold',
    };

    const validPerformanceData = {
      athleteId: 'athlete-1',
      disciplineId: 'discipline-1',
      ageGroupId: 'age-group-1',
      genderId: 'gender-1',
      medalId: 'medal-1',
      timeSeconds: 12.5,
      date: '2024-01-15',
      eventDetails: 'School Championships',
    };

    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      // Mock the validation schema
      mockPerformanceCreateSchema.safeParse.mockReturnValue({
        success: true,
        data: validPerformanceData,
      });

      const request = createMockRequest(
        'http://localhost:3000/api/performances',
        'POST',
        validPerformanceData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 400 for validation errors', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      mockPerformanceCreateSchema.safeParse.mockReturnValue({
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
        'http://localhost:3000/api/performances',
        'POST',
        { ...validPerformanceData, timeSeconds: -1 }
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('should return 404 when athlete not found', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.athlete.findUnique.mockResolvedValue(null);

      // Mock the validation schema
      mockPerformanceCreateSchema.safeParse.mockReturnValue({
        success: true,
        data: validPerformanceData,
      });

      const request = createMockRequest(
        'http://localhost:3000/api/performances',
        'POST',
        validPerformanceData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Athlete not found');
    });

    it('should return 403 when user has no access to athlete club', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.athlete.findUnique.mockResolvedValue(mockAthlete);
      mockPrisma.userClub.findUnique.mockResolvedValue(null);

      // Mock the validation schema
      mockPerformanceCreateSchema.safeParse.mockReturnValue({
        success: true,
        data: validPerformanceData,
      });

      const request = createMockRequest(
        'http://localhost:3000/api/performances',
        'POST',
        validPerformanceData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Access denied to this club');
    });

    it('should return 400 for performance validation errors', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.athlete.findUnique.mockResolvedValue(mockAthlete);
      mockPrisma.userClub.findUnique.mockResolvedValue(mockUserRole);

      // Mock the validation schema
      mockPerformanceCreateSchema.safeParse.mockReturnValue({
        success: true,
        data: validPerformanceData,
      });

      mockValidatePerformanceData.mockResolvedValue({
        isValid: false,
        errors: ['Time value is required for timed disciplines'],
        warnings: [],
      });

      const request = createMockRequest(
        'http://localhost:3000/api/performances',
        'POST',
        validPerformanceData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Performance validation failed');
      expect(data.details).toEqual([
        'Time value is required for timed disciplines',
      ]);
    });

    it('should return 409 for duplicate performance', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.athlete.findUnique.mockResolvedValue(mockAthlete);
      mockPrisma.userClub.findUnique.mockResolvedValue(mockUserRole);

      // Mock the validation schema
      mockPerformanceCreateSchema.safeParse.mockReturnValue({
        success: true,
        data: validPerformanceData,
      });

      mockValidatePerformanceData.mockResolvedValue({
        isValid: true,
        errors: [],
        warnings: [],
      });

      mockCheckDuplicatePerformance.mockResolvedValue(true);

      const request = createMockRequest(
        'http://localhost:3000/api/performances',
        'POST',
        validPerformanceData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe(
        'A performance with these details already exists for this athlete'
      );
    });

    it('should return 400 for invalid discipline', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.athlete.findUnique.mockResolvedValue(mockAthlete);
      mockPrisma.userClub.findUnique.mockResolvedValue(mockUserRole);

      // Mock the validation schema
      mockPerformanceCreateSchema.safeParse.mockReturnValue({
        success: true,
        data: validPerformanceData,
      });

      mockValidatePerformanceData.mockResolvedValue({
        isValid: true,
        errors: [],
        warnings: [],
      });

      mockCheckDuplicatePerformance.mockResolvedValue(false);

      // Mock related entities
      mockPrisma.discipline.findUnique.mockResolvedValue(null);
      mockPrisma.ageGroup.findUnique.mockResolvedValue(mockAgeGroup);
      mockPrisma.gender.findUnique.mockResolvedValue(mockGender);

      // Mock medal query
      (prisma as any).medal = {
        findUnique: vi.fn().mockResolvedValue(mockMedal),
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances',
        'POST',
        validPerformanceData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid discipline selected');
    });

    it('should create performance successfully', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.athlete.findUnique.mockResolvedValue(mockAthlete);
      mockPrisma.userClub.findUnique.mockResolvedValue(mockUserRole);

      // Mock the validation schema
      mockPerformanceCreateSchema.safeParse.mockReturnValue({
        success: true,
        data: validPerformanceData,
      });

      mockValidatePerformanceData.mockResolvedValue({
        isValid: true,
        errors: [],
        warnings: [],
      });

      mockCheckDuplicatePerformance.mockResolvedValue(false);

      // Mock related entities
      mockPrisma.discipline.findUnique.mockResolvedValue(mockDiscipline);
      mockPrisma.ageGroup.findUnique.mockResolvedValue(mockAgeGroup);
      mockPrisma.gender.findUnique.mockResolvedValue(mockGender);

      // Mock medal query
      (prisma as any).medal = {
        findUnique: vi.fn().mockResolvedValue(mockMedal),
      };

      const createdPerformance = {
        id: 'perf-1',
        ...validPerformanceData,
        date: '2024-01-15T00:00:00.000Z',
        athlete: mockAthlete,
        discipline: mockDiscipline,
        ageGroup: mockAgeGroup,
        gender: mockGender,
        medal: mockMedal,
      };

      // Mock performance creation
      (prisma as any).performance = {
        create: vi.fn().mockResolvedValue(createdPerformance),
      };

      const request = createMockRequest(
        'http://localhost:3000/api/performances',
        'POST',
        validPerformanceData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(createdPerformance);
      expect(data.message).toBe('Performance recorded successfully');
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);
      mockPrisma.athlete.findUnique.mockRejectedValue(
        new Error('Database connection failed')
      );

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const request = createMockRequest(
        'http://localhost:3000/api/performances',
        'POST',
        validPerformanceData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create performance');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error creating performance:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
