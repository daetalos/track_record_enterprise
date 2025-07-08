import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithClub } from '@/lib/auth-utils';
import { userHasClubAccess } from '@/lib/db';
import type { ClubSelectionRequest, ClubSelectionResponse } from '@/types/club';

/**
 * POST /api/clubs/select
 *
 * Update the user's selected club context in their session
 *
 * Body: { clubId: string }
 *
 * Returns:
 * - 200: Success with updated session context
 * - 401: Unauthorized if no valid session
 * - 403: Forbidden if user doesn't have access to the club
 * - 400: Bad request if invalid club ID
 * - 500: Server error
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ClubSelectionResponse>> {
  try {
    // Check authentication
    const session = await getSessionWithClub();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
        },
        { status: 401 }
      );
    }

    // Parse request body
    let body: ClubSelectionRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
        },
        { status: 400 }
      );
    }

    const { clubId } = body;

    // Validate club ID
    if (!clubId || typeof clubId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Club ID is required and must be a string',
        },
        { status: 400 }
      );
    }

    // Check if user has access to the club
    const hasAccess = await userHasClubAccess(session.user.id, clubId);
    if (!hasAccess) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied to the specified club',
        },
        { status: 403 }
      );
    }

    // Session update will be handled by the client-side session update trigger
    // The actual session update happens through NextAuth's session callback
    // when the client calls update() with the new club context

    return NextResponse.json({
      success: true,
      message: 'Club selection processed successfully',
    });
  } catch (error) {
    console.error('Error selecting club:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to select club',
      },
      { status: 500 }
    );
  }
}
