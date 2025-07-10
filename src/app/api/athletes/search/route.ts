import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import authOptions from '@/lib/auth';

/**
 * GET /api/athletes/search
 * AJAX search for athletes with minimal data for forms
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
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

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

    // Build search where clause
    const whereClause: {
      clubId: string;
      OR?: Array<{
        firstName?: { contains: string; mode: 'insensitive' };
        lastName?: { contains: string; mode: 'insensitive' };
      }>;
    } = {
      clubId,
    };

    // Add search query if provided (minimum 2 characters)
    if (query && query.length >= 2) {
      whereClause.OR = [
        {
          firstName: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Search for athletes with minimal data for performance
    const athletes = await prisma.athlete.findMany({
      where: whereClause,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      take: Math.min(limit, 20), // Max 20 results for AJAX
      select: {
        id: true,
        firstName: true,
        lastName: true,
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
          },
        },
      },
    });

    // Format for AJAX consumption
    const formattedAthletes = athletes.map(athlete => ({
      id: athlete.id,
      firstName: athlete.firstName,
      lastName: athlete.lastName,
      fullName: `${athlete.firstName} ${athlete.lastName}`,
      displayName: `${athlete.lastName}, ${athlete.firstName}`,
      gender: athlete.gender,
      ageGroup: athlete.ageGroup,
    }));

    return NextResponse.json({
      success: true,
      data: formattedAthletes,
      total: formattedAthletes.length,
    });
  } catch (error) {
    console.error('Error searching athletes:', error);
    return NextResponse.json(
      { error: 'Failed to search athletes' },
      { status: 500 }
    );
  }
}
