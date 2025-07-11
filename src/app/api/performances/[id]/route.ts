// Individual performance operations API endpoints

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import authOptions from '@/lib/auth';
import {
  PerformanceUpdateSchema,
  validatePerformanceData,
  checkDuplicatePerformance,
} from '@/lib/performanceValidation';
import { PerformanceResponse } from '@/types/performance';

/**
 * GET /api/performances/[id]
 * Get a specific performance by ID
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

    const { id: performanceId } = await params;

    // Get the performance with all relationships
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Performance model exists in schema but Prisma client needs regeneration
    const performance = await (prisma as any).performance.findUnique({
      where: { id: performanceId },
      include: {
        athlete: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            clubId: true,
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

    if (!performance) {
      return NextResponse.json(
        { error: 'Performance not found' },
        { status: 404 }
      );
    }

    // Verify user has access to this club
    const userRole = await prisma.userClub.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: performance.athlete.clubId,
        },
        isActive: true,
      },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: 'Access denied to this performance' },
        { status: 403 }
      );
    }

    const response: PerformanceResponse = {
      success: true,
      data: performance,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/performances/[id]
 * Update a specific performance
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

    const { id: performanceId } = await params;
    const body = await request.json();
    const validationResult = PerformanceUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Get the existing performance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Performance model exists in schema but Prisma client needs regeneration
    const existingPerformance = await (prisma as any).performance.findUnique({
      where: { id: performanceId },
      include: {
        athlete: {
          select: {
            id: true,
            clubId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!existingPerformance) {
      return NextResponse.json(
        { error: 'Performance not found' },
        { status: 404 }
      );
    }

    // Verify user has access to this club
    const userRole = await prisma.userClub.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: existingPerformance.athlete.clubId,
        },
        isActive: true,
      },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: 'Access denied to this performance' },
        { status: 403 }
      );
    }

    const updateData = validationResult.data;

    // Comprehensive performance validation
    const performanceValidation = await validatePerformanceData(updateData);
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

    // Check for duplicate performance if key fields are being updated
    if (updateData.date || updateData.eventDetails) {
      const isDuplicate = await checkDuplicatePerformance({
        athleteId: existingPerformance.athleteId,
        disciplineId: existingPerformance.disciplineId,
        ageGroupId: existingPerformance.ageGroupId,
        genderId: existingPerformance.genderId,
        date:
          updateData.date ||
          existingPerformance.date.toISOString().split('T')[0],
        eventDetails:
          updateData.eventDetails || existingPerformance.eventDetails,
        excludeId: performanceId,
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
    }

    // Verify medal assignment if being updated
    if (updateData.medalId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Medal model exists in schema but Prisma client needs regeneration
      const medal = await (prisma as any).medal.findUnique({
        where: { id: updateData.medalId },
      });

      if (!medal) {
        return NextResponse.json(
          { error: 'Invalid medal selected' },
          { status: 400 }
        );
      }
    }

    // Update the performance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Performance model exists in schema but Prisma client needs regeneration
    const updatedPerformance = await (prisma as any).performance.update({
      where: { id: performanceId },
      data: {
        ...(updateData.medalId !== undefined && {
          medalId: updateData.medalId || null,
        }),
        ...(updateData.timeSeconds !== undefined && {
          timeSeconds: updateData.timeSeconds,
        }),
        ...(updateData.distanceMeters !== undefined && {
          distanceMeters: updateData.distanceMeters,
        }),
        ...(updateData.date && { date: new Date(updateData.date) }),
        ...(updateData.eventDetails && {
          eventDetails: updateData.eventDetails,
        }),
        ...(updateData.proofFileUrl !== undefined && {
          proofFileUrl: updateData.proofFileUrl || null,
        }),
        ...(updateData.proofFileName !== undefined && {
          proofFileName: updateData.proofFileName || null,
        }),
        ...(updateData.teamMembers !== undefined && {
          teamMembers: updateData.teamMembers || null,
        }),
        // Record flags will be recalculated later
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
      data: updatedPerformance,
      message: 'Performance updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating performance:', error);
    return NextResponse.json(
      { error: 'Failed to update performance' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/performances/[id]
 * Delete a specific performance
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

    const { id: performanceId } = await params;

    // Get the existing performance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Performance model exists in schema but Prisma client needs regeneration
    const existingPerformance = await (prisma as any).performance.findUnique({
      where: { id: performanceId },
      include: {
        athlete: {
          select: {
            id: true,
            clubId: true,
            firstName: true,
            lastName: true,
          },
        },
        discipline: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existingPerformance) {
      return NextResponse.json(
        { error: 'Performance not found' },
        { status: 404 }
      );
    }

    // Verify user has access to this club
    const userRole = await prisma.userClub.findUnique({
      where: {
        userId_clubId: {
          userId: session.user.id,
          clubId: existingPerformance.athlete.clubId,
        },
        isActive: true,
      },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: 'Access denied to this performance' },
        { status: 403 }
      );
    }

    // Delete the performance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Performance model exists in schema but Prisma client needs regeneration
    await (prisma as any).performance.delete({
      where: { id: performanceId },
    });

    return NextResponse.json({
      success: true,
      message: `Performance for ${existingPerformance.athlete.firstName} ${existingPerformance.athlete.lastName} in ${existingPerformance.discipline.name} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting performance:', error);
    return NextResponse.json(
      { error: 'Failed to delete performance' },
      { status: 500 }
    );
  }
}
