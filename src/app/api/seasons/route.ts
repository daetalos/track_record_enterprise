import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import authOptions from '@/lib/auth';

// Validation schema for season creation/update
const SeasonSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(64, 'Name must be 64 characters or less'),
  description: z.string().optional().nullable(),
});

/**
 * GET /api/seasons
 * Get all available seasons (global resource)
 */
export async function GET() {
  try {
    // Seasons are global - any authenticated user can view them
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get all seasons ordered by name
    const seasons = await prisma.season.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            disciplines: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: seasons,
    });
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seasons' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/seasons
 * Create a new season (ADMIN/OWNER only - global resource management)
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

    // For global resources like seasons, only users with ADMIN/OWNER role in ANY club can manage
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
    const validationResult = SeasonSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { name, description } = validationResult.data;

    // Check for duplicate season name (global uniqueness)
    const existingSeason = await prisma.season.findUnique({
      where: {
        name,
      },
    });

    if (existingSeason) {
      return NextResponse.json(
        { error: 'Season with this name already exists' },
        { status: 409 }
      );
    }

    // Create the season
    const season = await prisma.season.create({
      data: {
        name,
        description,
      },
      include: {
        _count: {
          select: {
            disciplines: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: season,
        message: 'Season created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating season:', error);
    return NextResponse.json(
      { error: 'Failed to create season' },
      { status: 500 }
    );
  }
}
