import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyAgeGroupManagementPermission } from '@/lib/permissions';
import authOptions from '@/lib/auth';

// Validation schema for age group creation/update
const AgeGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(32, 'Name must be 32 characters or less'),
  ordinal: z.number().int().min(1, 'Ordinal must be a positive integer'),
  clubId: z.string().min(1, 'Club ID is required'),
});

/**
 * GET /api/age-groups
 * Get age groups for the user's current club
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

    // Get age groups for the club, ordered by ordinal
    const ageGroups = await prisma.ageGroup.findMany({
      where: {
        clubId,
      },
      orderBy: {
        ordinal: 'asc',
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            athletes: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: ageGroups,
    });
  } catch (error) {
    console.error('Error fetching age groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch age groups' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/age-groups
 * Create a new age group (ADMIN/OWNER only)
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
    const validationResult = AgeGroupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { name, ordinal, clubId } = validationResult.data;

    // Verify user has permission to manage age groups for this club
    const permissionCheck = await verifyAgeGroupManagementPermission(
      session.user.id,
      clubId
    );

    if (!permissionCheck.hasPermission) {
      return NextResponse.json(
        { error: permissionCheck.error || 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check for duplicate age group name within the club
    const existingAgeGroup = await prisma.ageGroup.findUnique({
      where: {
        clubId_name: {
          clubId,
          name,
        },
      },
    });

    if (existingAgeGroup) {
      return NextResponse.json(
        { error: 'Age group with this name already exists in this club' },
        { status: 409 }
      );
    }

    // Create the age group
    const ageGroup = await prisma.ageGroup.create({
      data: {
        name,
        ordinal,
        clubId,
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            athletes: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: ageGroup,
        message: 'Age group created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating age group:', error);
    return NextResponse.json(
      { error: 'Failed to create age group' },
      { status: 500 }
    );
  }
}
