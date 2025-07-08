import { NextResponse } from 'next/server';
import { getSessionWithClub } from '@/lib/auth-utils';
import { getUserClubs } from '@/lib/db';
import type { UserClubsApiResponse } from '@/types/club';

/**
 * GET /api/clubs
 *
 * Fetch all clubs accessible to the authenticated user
 *
 * Returns:
 * - 200: List of user's accessible clubs with role information
 * - 401: Unauthorized if no valid session
 * - 500: Server error
 */
export async function GET(): Promise<NextResponse<UserClubsApiResponse>> {
  try {
    // Check authentication
    const session = await getSessionWithClub();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          data: [],
        },
        { status: 401 }
      );
    }

    // Fetch user's accessible clubs
    const userClubs = await getUserClubs(session.user.id);

    // Return the user clubs data directly in the expected API format
    return NextResponse.json({
      success: true,
      data: userClubs,
      selectedClubId: session.selectedClubId,
    });
  } catch (error) {
    console.error('Error fetching user clubs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch clubs',
        data: [],
      },
      { status: 500 }
    );
  }
}
