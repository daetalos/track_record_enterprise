// Performance API endpoints for athlete performance recording

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import authOptions from '@/lib/auth';
import {
  PerformanceCreateSchema,
  validatePerformanceData,
  checkDuplicatePerformance,
} from '@/lib/performanceValidation';
import {
  PerformanceListResponse,
  PerformanceResponse,
} from '@/types/performance';

/**
 * GET /api/performances
 * Get performances with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('clubId') || session.selectedClubId;
    const athleteId = searchParams.get('athleteId') || '';
    const disciplineId = searchParams.get('disciplineId') || '';
    const ageGroupId = searchParams.get('ageGroupId') || '';
    const genderId = searchParams.get('genderId') || '';
    const medalId = searchParams.get('medalId') || '';
    const seasonId = searchParams.get('seasonId') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const isPersonalBest = searchParams.get('isPersonalBest') === 'true';
    const isClubRecord = searchParams.get('isClubRecord') === 'true';
    const hasProofFile = searchParams.get('hasProofFile') === 'true';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    if (!clubId) {
      return NextResponse.json(
        { error: 'Club ID is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this club
    const userRole = await prisma.userClub.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId,
        },
        isActive: true,
      },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: 'Access denied to this club' },
        { status: 403 }
      );
    }

    // Build where clause for filtering
    const whereClause: {
      athlete: { clubId: string };
      athleteId?: string;
      disciplineId?: string;
      ageGroupId?: string;
      genderId?: string;
      medalId?: string;
      discipline?: { seasonId: string };
      date?: { gte?: Date; lte?: Date };
      isPersonalBest?: boolean;
      isClubRecord?: boolean;
      proofFileUrl?: { not: null };
      OR?: Array<{
        athlete?: {
          firstName?: { contains: string; mode: 'insensitive' };
          lastName?: { contains: string; mode: 'insensitive' };
        };
        discipline?: {
          name?: { contains: string; mode: 'insensitive' };
        };
        eventDetails?: { contains: string; mode: 'insensitive' };
      }>;
    } = {
      athlete: {
        clubId,
      },
    };

    // Add filters
    if (athleteId) {
      whereClause.athleteId = athleteId;
    }

    if (disciplineId) {
      whereClause.disciplineId = disciplineId;
    }

    if (ageGroupId) {
      whereClause.ageGroupId = ageGroupId;
    }

    if (genderId) {
      whereClause.genderId = genderId;
    }

    if (medalId) {
      whereClause.medalId = medalId;
    }

    if (seasonId) {
      whereClause.discipline = {
        seasonId,
      };
    }

    if (dateFrom || dateTo) {
      whereClause.date = {};
      if (dateFrom) {
        whereClause.date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.date.lte = new Date(dateTo);
      }
    }

    if (isPersonalBest) {
      whereClause.isPersonalBest = true;
    }

    if (isClubRecord) {
      whereClause.isClubRecord = true;
    }

    if (hasProofFile) {
      whereClause.proofFileUrl = {
        not: null,
      };
    }

    // Add search query filter
    if (search) {
      whereClause.OR = [
        {
          athlete: {
            firstName: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          athlete: {
            lastName: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          discipline: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          eventDetails: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Get performances with relationships
    const [performances, total] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Performance model exists in schema but Prisma client needs regeneration
      (prisma as any).performance.findMany({
        where: whereClause,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        take: limit,
        skip: offset,
        include: {
          athlete: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              club: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          discipline: {
            select: {
              id: true,
              name: true,
              isTimed: true,
              isMeasured: true,
              teamSize: true,
              season: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          ageGroup: {
            select: {
              id: true,
              name: true,
              ordinal: true,
            },
          },
          gender: {
            select: {
              id: true,
              name: true,
              initial: true,
            },
          },
          medal: {
            select: {
              id: true,
              position: true,
              name: true,
            },
          },
        },
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Performance model exists in schema but Prisma client needs regeneration
      (prisma as any).performance.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: PerformanceListResponse = {
      success: true,
      data: performances,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching performances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performances' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/performances
 * Create a new performance
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = PerformanceCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const performanceData = validationResult.data;

    // Verify user has access to the athlete's club
    const athlete = await prisma.athlete.findUnique({
      where: { id: performanceData.athleteId },
      select: {
        id: true,
        clubId: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!athlete) {
      return NextResponse.json({ error: 'Athlete not found' }, { status: 404 });
    }

    // Verify user has access to this club
    const userRole = await prisma.userClub.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: athlete.clubId,
        },
        isActive: true,
      },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: 'Access denied to this club' },
        { status: 403 }
      );
    }

    // Comprehensive performance validation
    const performanceValidation =
      await validatePerformanceData(performanceData);
    if (!performanceValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Performance validation failed',
          details: performanceValidation.errors,
          warnings: performanceValidation.warnings,
        },
        { status: 400 }
      );
    }

    // Check for duplicate performance
    const isDuplicate = await checkDuplicatePerformance({
      athleteId: performanceData.athleteId,
      disciplineId: performanceData.disciplineId,
      ageGroupId: performanceData.ageGroupId,
      genderId: performanceData.genderId,
      date: performanceData.date,
      eventDetails: performanceData.eventDetails,
    });

    if (isDuplicate) {
      return NextResponse.json(
        {
          error:
            'A performance with these details already exists for this athlete',
        },
        { status: 409 }
      );
    }

    // Verify related entities exist
    const [discipline, ageGroup, gender, medal] = await Promise.all([
      prisma.discipline.findUnique({
        where: { id: performanceData.disciplineId },
      }),
      prisma.ageGroup.findUnique({
        where: { id: performanceData.ageGroupId },
      }),
      prisma.gender.findUnique({
        where: { id: performanceData.genderId },
      }),
      performanceData.medalId
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Medal model exists in schema but Prisma client needs regeneration
          (prisma as any).medal.findUnique({
            where: { id: performanceData.medalId },
          })
        : null,
    ]);

    if (!discipline) {
      return NextResponse.json(
        { error: 'Invalid discipline selected' },
        { status: 400 }
      );
    }

    if (!ageGroup) {
      return NextResponse.json(
        { error: 'Invalid age group selected' },
        { status: 400 }
      );
    }

    if (!gender) {
      return NextResponse.json(
        { error: 'Invalid gender selected' },
        { status: 400 }
      );
    }

    if (performanceData.medalId && !medal) {
      return NextResponse.json(
        { error: 'Invalid medal selected' },
        { status: 400 }
      );
    }

    // Create the performance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Performance model exists in schema but Prisma client needs regeneration
    const performance = await (prisma as any).performance.create({
      data: {
        athleteId: performanceData.athleteId,
        disciplineId: performanceData.disciplineId,
        ageGroupId: performanceData.ageGroupId,
        genderId: performanceData.genderId,
        medalId: performanceData.medalId || null,
        timeSeconds: performanceData.timeSeconds || null,
        distanceMeters: performanceData.distanceMeters || null,
        date: new Date(performanceData.date),
        eventDetails: performanceData.eventDetails,
        proofFileUrl: performanceData.proofFileUrl || null,
        proofFileName: performanceData.proofFileName || null,
        teamMembers: performanceData.teamMembers || null,
        isPersonalBest: false, // Will be calculated later
        isClubRecord: false, // Will be calculated later
        wasPersonalBest: false,
        wasClubRecord: false,
      },
      include: {
        athlete: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            club: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        discipline: {
          select: {
            id: true,
            name: true,
            isTimed: true,
            isMeasured: true,
            teamSize: true,
            season: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        ageGroup: {
          select: {
            id: true,
            name: true,
            ordinal: true,
          },
        },
        gender: {
          select: {
            id: true,
            name: true,
            initial: true,
          },
        },
        medal: {
          select: {
            id: true,
            position: true,
            name: true,
          },
        },
      },
    });

    const response: PerformanceResponse = {
      success: true,
      data: performance,
      message: 'Performance recorded successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating performance:', error);
    return NextResponse.json(
      { error: 'Failed to create performance' },
      { status: 500 }
    );
  }
}
