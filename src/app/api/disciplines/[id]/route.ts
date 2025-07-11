import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import authOptions from '@/lib/auth';
import { DisciplineValidation } from '@/types/discipline';

// Validation schema for discipline updates
const UpdateDisciplineSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(128, 'Name must be 128 characters or less')
      .optional(),
    description: z.string().optional().nullable(),
    isTimed: z.boolean().optional(),
    isMeasured: z.boolean().optional(),
    teamSize: z.number().int().min(1).max(10).optional().nullable(),
  })
  .refine(
    data => {
      // Business rule: if both timed and measured are provided, they must be mutually exclusive
      if (data.isTimed !== undefined && data.isMeasured !== undefined) {
        return data.isTimed !== data.isMeasured;
      }
      return true;
    },
    {
      message: 'Discipline must be either timed or measured, not both',
      path: ['isTimed', 'isMeasured'],
    }
  );

/**
 * GET /api/disciplines/[id]
 * Get a specific discipline by ID
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
    const disciplineId = resolvedParams.id;

    // Get the discipline with season information
    const discipline = await prisma.discipline.findUnique({
      where: {
        id: disciplineId,
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

    if (!discipline) {
      return NextResponse.json(
        { error: 'Discipline not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: discipline,
    });
  } catch (error) {
    console.error('Error fetching discipline:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discipline' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/disciplines/[id]
 * Update a discipline (ADMIN/OWNER only)
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

    const resolvedParams = await params;
    const disciplineId = resolvedParams.id;
    const body = await request.json();
    const validationResult = UpdateDisciplineSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Get the existing discipline
    const existingDiscipline = await prisma.discipline.findUnique({
      where: {
        id: disciplineId,
      },
      select: {
        id: true,
        seasonId: true,
        name: true,
        isTimed: true,
        isMeasured: true,
        season: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!existingDiscipline) {
      return NextResponse.json(
        { error: 'Discipline not found' },
        { status: 404 }
      );
    }

    // Check for duplicate name if name is being updated
    if (updateData.name && updateData.name !== existingDiscipline.name) {
      const duplicateDiscipline = await prisma.discipline.findUnique({
        where: {
          seasonId_name: {
            seasonId: existingDiscipline.seasonId,
            name: updateData.name,
          },
        },
      });

      if (duplicateDiscipline) {
        return NextResponse.json(
          {
            error: `Discipline "${updateData.name}" already exists in ${existingDiscipline.season.name} season`,
          },
          { status: 409 }
        );
      }
    }

    // Handle type changes and business rule validation
    const finalUpdateData: Record<
      string,
      string | number | boolean | null | undefined
    > = { ...updateData };

    // Determine final timed/measured state for validation
    const finalIsTimed =
      updateData.isTimed !== undefined
        ? updateData.isTimed
        : existingDiscipline.isTimed;
    const finalIsMeasured =
      updateData.isMeasured !== undefined
        ? updateData.isMeasured
        : existingDiscipline.isMeasured;

    // Validate business rules with final state
    DisciplineValidation.validateTypeExclusivity(finalIsTimed, finalIsMeasured);

    // Update comparison direction if type changed
    if (
      updateData.isTimed !== undefined ||
      updateData.isMeasured !== undefined
    ) {
      finalUpdateData.isSmallerBetter =
        DisciplineValidation.getComparisonDirection(
          finalIsTimed,
          finalIsMeasured
        );
    }

    // Validate team size if provided
    if (updateData.teamSize !== undefined && updateData.teamSize !== null) {
      DisciplineValidation.validateTeamSize(updateData.teamSize);
    }

    // Update the discipline
    const updatedDiscipline = await prisma.discipline.update({
      where: {
        id: disciplineId,
      },
      data: finalUpdateData,
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

    return NextResponse.json({
      success: true,
      data: updatedDiscipline,
      message: 'Discipline updated successfully',
    });
  } catch (error) {
    console.error('Error updating discipline:', error);

    // Handle business rule validation errors
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to update discipline' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/disciplines/[id]
 * Delete a discipline (ADMIN/OWNER only)
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

    const resolvedParams = await params;
    const disciplineId = resolvedParams.id;

    // Check if discipline exists
    const existingDiscipline = await prisma.discipline.findUnique({
      where: {
        id: disciplineId,
      },
      select: {
        id: true,
        name: true,
        season: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!existingDiscipline) {
      return NextResponse.json(
        { error: 'Discipline not found' },
        { status: 404 }
      );
    }

    // TODO: In the future, check for existing performance records
    // For now, proceed with deletion

    // Delete the discipline
    await prisma.discipline.delete({
      where: {
        id: disciplineId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Discipline "${existingDiscipline.name}" deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting discipline:', error);
    return NextResponse.json(
      { error: 'Failed to delete discipline' },
      { status: 500 }
    );
  }
}
