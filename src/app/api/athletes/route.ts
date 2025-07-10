import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyAthleteManagementPermission } from '@/lib/permissions';
import authOptions from '@/lib/auth';

// Validation schema for athlete creation/update
const AthleteSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(64, 'First name must be 64 characters or less'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(64, 'Last name must be 64 characters or less'),
  genderId: z.string().min(1, 'Gender is required'),
  clubId: z.string().min(1, 'Club ID is required'),
  ageGroupId: z.string().optional(),
});

/**
 * GET /api/athletes
 * Get athletes for the user's current club
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
    const search = searchParams.get('search') || '';
    const genderId = searchParams.get('genderId') || '';
    const ageGroupId = searchParams.get('ageGroupId') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    if (!clubId) {
      return NextResponse.json(
        { error: 'Club ID is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this club (any role)
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
      clubId: string;
      OR?: Array<{
        firstName?: { contains: string; mode: 'insensitive' };
        lastName?: { contains: string; mode: 'insensitive' };
      }>;
      genderId?: string;
      ageGroupId?: string;
    } = {
      clubId,
    };

    // Add search query filter (case-insensitive)
    if (search) {
      whereClause.OR = [
        {
          firstName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Add gender filter
    if (genderId) {
      whereClause.genderId = genderId;
    }

    // Add age group filter
    if (ageGroupId) {
      whereClause.ageGroupId = ageGroupId;
    }

    // Get athletes for the club with relationships
    const [athletes, total] = await Promise.all([
      prisma.athlete.findMany({
        where: whereClause,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        take: limit,
        skip: offset,
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
      }),
      prisma.athlete.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: athletes,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching athletes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch athletes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/athletes
 * Create a new athlete (All club members can create athletes)
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
    const validationResult = AthleteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { firstName, lastName, genderId, clubId, ageGroupId } =
      validationResult.data;

    // Verify user has permission to create athletes for this club
    const permissionCheck = await verifyAthleteManagementPermission(
      session.user.id,
      clubId
    );

    if (!permissionCheck.hasPermission) {
      return NextResponse.json(
        { error: permissionCheck.error || 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check for duplicate athlete within the club
    const existingAthlete = await prisma.athlete.findFirst({
      where: {
        clubId,
        firstName: {
          equals: firstName,
          mode: 'insensitive',
        },
        lastName: {
          equals: lastName,
          mode: 'insensitive',
        },
      },
    });

    if (existingAthlete) {
      return NextResponse.json(
        { error: 'Athlete with this name already exists in this club' },
        { status: 409 }
      );
    }

    // Verify gender exists
    const gender = await prisma.gender.findUnique({
      where: { id: genderId },
    });

    if (!gender) {
      return NextResponse.json(
        { error: 'Invalid gender selected' },
        { status: 400 }
      );
    }

    // Verify age group exists and belongs to the club (if provided)
    if (ageGroupId) {
      const ageGroup = await prisma.ageGroup.findUnique({
        where: { id: ageGroupId },
      });

      if (!ageGroup || ageGroup.clubId !== clubId) {
        return NextResponse.json(
          { error: 'Invalid age group selected' },
          { status: 400 }
        );
      }
    }

    // Create the athlete
    const athlete = await prisma.athlete.create({
      data: {
        firstName,
        lastName,
        genderId,
        clubId,
        ageGroupId: ageGroupId || null,
      },
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

    return NextResponse.json(
      {
        success: true,
        data: athlete,
        message: 'Athlete created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating athlete:', error);
    return NextResponse.json(
      { error: 'Failed to create athlete' },
      { status: 500 }
    );
  }
}
