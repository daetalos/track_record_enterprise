import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import authOptions from '@/lib/auth';
import { DisciplineValidation } from '@/types/discipline';

// Validation schema for discipline creation
const CreateDisciplineSchema = z
  .object({
    seasonId: z.string().min(1, 'Season ID is required'),
    name: z
      .string()
      .min(1, 'Name is required')
      .max(128, 'Name must be 128 characters or less'),
    description: z.string().optional().nullable(),
    isTimed: z.boolean(),
    isMeasured: z.boolean(),
    teamSize: z.number().int().min(1).max(10).optional().nullable(),
  })
  .refine(
    data => {
      // Business rule: must be either timed OR measured, not both
      return data.isTimed !== data.isMeasured;
    },
    {
      message: 'Discipline must be either timed or measured, not both',
      path: ['isTimed', 'isMeasured'],
    }
  );

/**
 * GET /api/disciplines
 * Get all disciplines with optional season filtering
 * Query params: season (seasonId)
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
    const seasonFilter = searchParams.get('season');

    // Build query with optional season filtering
    const whereClause = seasonFilter
      ? {
          seasonId: seasonFilter,
        }
      : {};

    const disciplines = await prisma.discipline.findMany({
      where: whereClause,
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

    return NextResponse.json({
      success: true,
      data: disciplines,
    });
  } catch (error) {
    console.error('Error fetching disciplines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch disciplines' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/disciplines
 * Create a new discipline (ADMIN/OWNER only)
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

    // For disciplines (global resources), only users with ADMIN/OWNER role in ANY club can manage
    const userRole = await prisma.userClub.findFirst({
      where: {
        userId: session.user.id,
        role: {
          in: ['ADMIN', 'OWNER'],
        },
        isActive: true,
      },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: 'Insufficient permissions - Admin or Owner role required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = CreateDisciplineSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { seasonId, name, description, isTimed, isMeasured, teamSize } =
      validationResult.data;

    // Verify season exists
    const season = await prisma.season.findUnique({
      where: { id: seasonId },
      select: { id: true, name: true },
    });

    if (!season) {
      return NextResponse.json({ error: 'Invalid season ID' }, { status: 400 });
    }

    // Check for duplicate discipline name within the same season
    const existingDiscipline = await prisma.discipline.findUnique({
      where: {
        seasonId_name: {
          seasonId,
          name,
        },
      },
    });

    if (existingDiscipline) {
      return NextResponse.json(
        {
          error: `Discipline "${name}" already exists in ${season.name} season`,
        },
        { status: 409 }
      );
    }

    // Apply business rules for comparison direction
    const isSmallerBetter = DisciplineValidation.getComparisonDirection(
      isTimed,
      isMeasured
    );

    // Create the discipline
    const discipline = await prisma.discipline.create({
      data: {
        seasonId,
        name,
        description,
        isTimed,
        isMeasured,
        isSmallerBetter,
        teamSize,
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

    return NextResponse.json(
      {
        success: true,
        data: discipline,
        message: 'Discipline created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating discipline:', error);

    // Handle business rule validation errors
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to create discipline' },
      { status: 500 }
    );
  }
}
