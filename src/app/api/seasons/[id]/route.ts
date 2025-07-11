import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import authOptions from '@/lib/auth';

// Validation schema for season updates
const UpdateSeasonSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(64, 'Name must be 64 characters or less')
    .optional(),
  description: z.string().optional().nullable(),
});

/**
 * GET /api/seasons/[id]
 * Get a specific season by ID
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
    const seasonId = resolvedParams.id;

    // Get the season with discipline count
    const season = await prisma.season.findUnique({
      where: {
        id: seasonId,
      },
      include: {
        _count: {
          select: {
            disciplines: true,
          },
        },
      },
    });

    if (!season) {
      return NextResponse.json({ error: 'Season not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: season,
    });
  } catch (error) {
    console.error('Error fetching season:', error);
    return NextResponse.json(
      { error: 'Failed to fetch season' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/seasons/[id]
 * Update a season (ADMIN/OWNER only)
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

    const resolvedParams = await params;
    const seasonId = resolvedParams.id;
    const body = await request.json();
    const validationResult = UpdateSeasonSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Get the existing season
    const existingSeason = await prisma.season.findUnique({
      where: {
        id: seasonId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!existingSeason) {
      return NextResponse.json({ error: 'Season not found' }, { status: 404 });
    }

    // Check for duplicate name if name is being updated
    if (updateData.name && updateData.name !== existingSeason.name) {
      const duplicateSeason = await prisma.season.findUnique({
        where: {
          name: updateData.name,
        },
      });

      if (duplicateSeason) {
        return NextResponse.json(
          { error: 'Season with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Update the season
    const updatedSeason = await prisma.season.update({
      where: {
        id: seasonId,
      },
      data: updateData,
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
      data: updatedSeason,
      message: 'Season updated successfully',
    });
  } catch (error) {
    console.error('Error updating season:', error);
    return NextResponse.json(
      { error: 'Failed to update season' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/seasons/[id]
 * Delete a season (ADMIN/OWNER only)
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

    const resolvedParams = await params;
    const seasonId = resolvedParams.id;

    // Check if season exists and get discipline count
    const existingSeason = await prisma.season.findUnique({
      where: {
        id: seasonId,
      },
      include: {
        _count: {
          select: {
            disciplines: true,
          },
        },
      },
    });

    if (!existingSeason) {
      return NextResponse.json({ error: 'Season not found' }, { status: 404 });
    }

    // Prevent deletion if season has disciplines
    if (existingSeason._count.disciplines > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete season with existing disciplines',
          details: `Season has ${existingSeason._count.disciplines} disciplines. Delete or reassign them first.`,
        },
        { status: 409 }
      );
    }

    // Delete the season
    await prisma.season.delete({
      where: {
        id: seasonId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Season deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting season:', error);
    return NextResponse.json(
      { error: 'Failed to delete season' },
      { status: 500 }
    );
  }
}
