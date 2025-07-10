import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyAthleteManagementPermission } from '@/lib/permissions';
import authOptions from '@/lib/auth';

// Validation schema for athlete updates
const UpdateAthleteSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(64, 'First name must be 64 characters or less')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(64, 'Last name must be 64 characters or less')
    .optional(),
  genderId: z.string().min(1, 'Gender is required').optional(),
  ageGroupId: z
    .string()
    .min(1)
    .optional()
    .or(z.literal(''))
    .transform(val => (val === '' ? null : val)),
});

/**
 * GET /api/athletes/[id]
 * Get a specific athlete by ID
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

    const { id: athleteId } = await params;

    // Get the athlete with all relationships
    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
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
        { error: 'Access denied to this athlete' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: athlete,
    });
  } catch (error) {
    console.error('Error fetching athlete:', error);
    return NextResponse.json(
      { error: 'Failed to fetch athlete' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/athletes/[id]
 * Update a specific athlete
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

    const { id: athleteId } = await params;
    const body = await request.json();
    const validationResult = UpdateAthleteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Get the existing athlete
    const existingAthlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
    });

    if (!existingAthlete) {
      return NextResponse.json({ error: 'Athlete not found' }, { status: 404 });
    }

    // Verify user has permission to edit athletes for this club
    const permissionCheck = await verifyAthleteManagementPermission(
      session.user.id,
      existingAthlete.clubId
    );

    if (!permissionCheck.hasPermission) {
      return NextResponse.json(
        { error: permissionCheck.error || 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const updateData = validationResult.data;

    // Check for duplicate athlete name if name fields are being updated
    if (updateData.firstName || updateData.lastName) {
      const firstName = updateData.firstName || existingAthlete.firstName;
      const lastName = updateData.lastName || existingAthlete.lastName;

      const duplicateAthlete = await prisma.athlete.findFirst({
        where: {
          clubId: existingAthlete.clubId,
          firstName: {
            equals: firstName,
            mode: 'insensitive',
          },
          lastName: {
            equals: lastName,
            mode: 'insensitive',
          },
          NOT: {
            id: athleteId,
          },
        },
      });

      if (duplicateAthlete) {
        return NextResponse.json(
          { error: 'Athlete with this name already exists in this club' },
          { status: 409 }
        );
      }
    }

    // Verify gender exists if being updated
    if (updateData.genderId) {
      const gender = await prisma.gender.findUnique({
        where: { id: updateData.genderId },
      });

      if (!gender) {
        return NextResponse.json(
          { error: 'Invalid gender selected' },
          { status: 400 }
        );
      }
    }

    // Verify age group exists and belongs to the club if being updated
    if (updateData.ageGroupId !== undefined) {
      if (updateData.ageGroupId !== null) {
        const ageGroup = await prisma.ageGroup.findUnique({
          where: { id: updateData.ageGroupId },
        });

        if (!ageGroup || ageGroup.clubId !== existingAthlete.clubId) {
          return NextResponse.json(
            { error: 'Invalid age group selected' },
            { status: 400 }
          );
        }
      }
      // If ageGroupId is null, that's valid (means no age group assigned)
    }

    // Update the athlete
    const updatedAthlete = await prisma.athlete.update({
      where: { id: athleteId },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      data: updatedAthlete,
      message: 'Athlete updated successfully',
    });
  } catch (error) {
    console.error('Error updating athlete:', error);
    return NextResponse.json(
      { error: 'Failed to update athlete' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/athletes/[id]
 * Delete a specific athlete
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

    const { id: athleteId } = await params;

    // Get the existing athlete
    const existingAthlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
    });

    if (!existingAthlete) {
      return NextResponse.json({ error: 'Athlete not found' }, { status: 404 });
    }

    // Verify user has permission to delete athletes for this club
    const permissionCheck = await verifyAthleteManagementPermission(
      session.user.id,
      existingAthlete.clubId
    );

    if (!permissionCheck.hasPermission) {
      return NextResponse.json(
        { error: permissionCheck.error || 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // TODO: Check for related data (performances, etc.) before deletion
    // For now, we'll allow deletion but in the future we might want to:
    // - Prevent deletion if athlete has performances
    // - Or implement soft deletion

    // Delete the athlete
    await prisma.athlete.delete({
      where: { id: athleteId },
    });

    return NextResponse.json({
      success: true,
      message: 'Athlete deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting athlete:', error);
    return NextResponse.json(
      { error: 'Failed to delete athlete' },
      { status: 500 }
    );
  }
}
