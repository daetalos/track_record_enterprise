import type { NextRequest } from 'next/server';

/**
 * Club authorization result
 */
export interface ClubAuthResult {
  isAuthorized: boolean;
  clubId: string | null;
  userId: string | null;
  error?: string;
}

/**
 * Extract club ID from request URL path or query parameters
 *
 * @param request - The Next.js request object
 * @returns string | null - Extracted club ID or null if not found
 */
export function extractClubIdFromRequest(request: NextRequest): string | null {
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

/**
 * Check if the request path requires club authorization
 *
 * @param pathname - The request pathname
 * @returns boolean - True if club authorization is required
 */
export function requiresClubAuth(pathname: string): boolean {
  // Define API routes that require club context
  const clubRequiredPaths = [
    '/api/athletes',
    '/api/performances',
    '/api/records',
    '/api/events',
    '/api/dashboard',
  ];

  // Define API routes that don't require club context
  const clubExemptPaths = [
    '/api/auth',
    '/api/health',
    '/api/clubs', // Club selection endpoints are exempt
  ];

  // Check if path is exempt from club authorization
  if (clubExemptPaths.some(exemptPath => pathname.startsWith(exemptPath))) {
    return false;
  }

  // Check if path requires club authorization
  return clubRequiredPaths.some(requiredPath =>
    pathname.startsWith(requiredPath)
  );
}

// Note: For Edge Runtime compatibility, actual session validation will be done in API routes
// The middleware will only handle basic path-based routing and defer session checks to API handlers
