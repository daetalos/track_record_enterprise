import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import authOptions from '@/lib/auth';

/**
 * GET /api/disciplines/search
 * Search disciplines by name or description
 * Query params: q (search term), season (optional season filter)
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
    const searchTerm = searchParams.get('q');
    const seasonFilter = searchParams.get('season');

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Search term (q) is required' },
        { status: 400 }
      );
    }

    // Build search conditions
    const searchConditions = {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
      ],
    };

    // Add season filter if provided
    const whereClause = seasonFilter
      ? {
          AND: [
            searchConditions,
            {
              seasonId: seasonFilter,
            },
          ],
        }
      : searchConditions;

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
      take: 20, // Limit results for performance
    });

    return NextResponse.json({
      success: true,
      data: disciplines,
      searchTerm,
      resultCount: disciplines.length,
    });
  } catch (error) {
    console.error('Error searching disciplines:', error);
    return NextResponse.json(
      { error: 'Failed to search disciplines' },
      { status: 500 }
    );
  }
}
