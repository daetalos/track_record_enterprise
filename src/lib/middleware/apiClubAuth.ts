import { getSessionWithClub } from '@/lib/auth-utils';
import { getUserClubs } from '@/lib/db';
import type { NextRequest } from 'next/server';

/**
 * Club authorization result for API routes
 */
export interface ApiClubAuthResult {
  isAuthorized: boolean;
  clubId: string | null;
  userId: string | null;
  error?: string;
}

/**
 * Validate club authorization for API requests (server-side)
 *
 * This function is used by API route handlers (not middleware) to validate
 * club access since it requires database access and NextAuth session.
 *
 * @param requiredClubId - Optional specific club ID to validate against
 * @returns Promise<ApiClubAuthResult> - Authorization result with club context
 */
export async function validateApiClubAuth(
  requiredClubId?: string
): Promise<ApiClubAuthResult> {
  try {
    // Get session with club context
    const session = await getSessionWithClub();

    if (!session?.user?.id) {
      return {
        isAuthorized: false,
        clubId: null,
        userId: null,
        error: 'Authentication required',
      };
    }

    // If no club context in session, user needs to select a club
    if (!session.selectedClubId) {
      return {
        isAuthorized: false,
        clubId: null,
        userId: session.user.id,
        error: 'Club context required - please select a club',
      };
    }

    // If specific club ID is required, validate access
    if (requiredClubId && requiredClubId !== session.selectedClubId) {
      return {
        isAuthorized: false,
        clubId: session.selectedClubId,
        userId: session.user.id,
        error: 'Unauthorized access to specified club',
      };
    }

    // Verify user has access to the selected club
    const userClubs = await getUserClubs(session.user.id);
    const hasAccess = userClubs.some(
      uc => uc.club.id === session.selectedClubId && uc.isActive
    );

    if (!hasAccess) {
      return {
        isAuthorized: false,
        clubId: session.selectedClubId,
        userId: session.user.id,
        error: 'User does not have access to selected club',
      };
    }

    return {
      isAuthorized: true,
      clubId: session.selectedClubId,
      userId: session.user.id,
    };
  } catch (error) {
    console.error('API club authorization error:', error);
    return {
      isAuthorized: false,
      clubId: null,
      userId: null,
      error: 'Authorization validation failed',
    };
  }
}

/**
 * Get club context from session for API routes
 *
 * @returns Promise<string | null> - Club ID from session or null
 */
export async function getApiClubContext(): Promise<string | null> {
  try {
    const session = await getSessionWithClub();
    return session?.selectedClubId || null;
  } catch (error) {
    console.error('Failed to get API club context:', error);
    return null;
  }
}

/**
 * Extract club ID from API request URL path or query parameters
 *
 * @param request - The Next.js request object
 * @returns string | null - Extracted club ID or null if not found
 */
export function extractApiClubIdFromRequest(
  request: NextRequest
): string | null {
  const { pathname, searchParams } = request.nextUrl;

  // Check for club ID in URL path (e.g., /api/clubs/[clubId]/...)
  const pathMatch = pathname.match(/\/api\/clubs\/([^\/]+)/);
  if (pathMatch && pathMatch[1] !== 'select') {
    return pathMatch[1];
  }

  // Check for club ID in query parameters
  const clubIdParam = searchParams.get('clubId');
  if (clubIdParam) {
    return clubIdParam;
  }

  return null;
}
