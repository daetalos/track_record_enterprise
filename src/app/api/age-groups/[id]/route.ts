import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyAgeGroupManagementPermission } from '@/lib/permissions';
import authOptions from '@/lib/auth';

// Validation schema for age group updates
const UpdateAgeGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(32, 'Name must be 32 characters or less')
    .optional(),
  ordinal: z
    .number()
    .int()
    .min(1, 'Ordinal must be a positive integer')
    .optional(),
});

/**
 * GET /api/age-groups/[id]
 * Get a specific age group by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const ageGroupId = resolvedParams.id;

    // Get the age group with club information
    const ageGroup = await prisma.ageGroup.findUnique({
      where: {
        id: ageGroupId,
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

    if (!ageGroup) {
      return NextResponse.json(
        { error: 'Age group not found' },
        { status: 404 }
      );
    }

    // Verify user has access to this club
    const userRole = await prisma.userClub.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: ageGroup.clubId,
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

    return NextResponse.json({
      success: true,
      data: ageGroup,
    });
  } catch (error) {
    console.error('Error fetching age group:', error);
    return NextResponse.json(
      { error: 'Failed to fetch age group' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/age-groups/[id]
 * Update an age group (ADMIN/OWNER only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const ageGroupId = resolvedParams.id;
    const body = await request.json();
    const validationResult = UpdateAgeGroupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Get the existing age group to verify club ownership
    const existingAgeGroup = await prisma.ageGroup.findUnique({
      where: {
        id: ageGroupId,
      },
      select: {
        id: true,
        clubId: true,
        name: true,
      },
    });

    if (!existingAgeGroup) {
      return NextResponse.json(
        { error: 'Age group not found' },
        { status: 404 }
      );
    }

    // Verify user has permission to manage age groups for this club
    const permissionCheck = await verifyAgeGroupManagementPermission(
      session.user.id,
      existingAgeGroup.clubId
    );

    if (!permissionCheck.hasPermission) {
      return NextResponse.json(
        { error: permissionCheck.error || 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check for duplicate name if name is being updated
    if (updateData.name && updateData.name !== existingAgeGroup.name) {
      const duplicateAgeGroup = await prisma.ageGroup.findUnique({
        where: {
          clubId_name: {
            clubId: existingAgeGroup.clubId,
            name: updateData.name,
          },
        },
      });

      if (duplicateAgeGroup) {
        return NextResponse.json(
          { error: 'Age group with this name already exists in this club' },
          { status: 409 }
        );
      }
    }

    // Update the age group
    const updatedAgeGroup = await prisma.ageGroup.update({
      where: {
        id: ageGroupId,
      },
      data: updateData,
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
      data: updatedAgeGroup,
    });
  } catch (error) {
    console.error('Error updating age group:', error);
    return NextResponse.json(
      { error: 'Failed to update age group' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/age-groups/[id]
 * Delete an age group (ADMIN/OWNER only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const ageGroupId = resolvedParams.id;

    // Get the existing age group to verify club ownership
    const existingAgeGroup = await prisma.ageGroup.findUnique({
      where: {
        id: ageGroupId,
      },
      select: {
        id: true,
        clubId: true,
        _count: {
          select: {
            athletes: true,
          },
        },
      },
    });

    if (!existingAgeGroup) {
      return NextResponse.json(
        { error: 'Age group not found' },
        { status: 404 }
      );
    }

    // Verify user has permission to manage age groups for this club
    const permissionCheck = await verifyAgeGroupManagementPermission(
      session.user.id,
      existingAgeGroup.clubId
    );

    if (!permissionCheck.hasPermission) {
      return NextResponse.json(
        { error: permissionCheck.error || 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check if age group has athletes
    if (existingAgeGroup._count.athletes > 0) {
      return NextResponse.json(
        { error: 'Cannot delete age group with assigned athletes' },
        { status: 409 }
      );
    }

    // Delete the age group
    await prisma.ageGroup.delete({
      where: {
        id: ageGroupId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Age group deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting age group:', error);
    return NextResponse.json(
      { error: 'Failed to delete age group' },
      { status: 500 }
    );
  }
}
