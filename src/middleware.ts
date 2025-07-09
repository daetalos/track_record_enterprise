import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requiresClubAuth } from '@/lib/middleware/clubAuth';

export default withAuth(
  async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // For API routes that require club authorization, we'll let them handle
    // the club validation internally since Edge Runtime can't access database
    if (pathname.startsWith('/api/') && requiresClubAuth(pathname)) {
      // Add a header to indicate this route requires club authorization
      // The API route handler will check this and validate accordingly
      const response = NextResponse.next();
      response.headers.set('x-requires-club-auth', 'true');
      return response;
    }

    // For all other routes, proceed normally
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Define public routes that don't require authentication
        if (
          pathname === '/' ||
          pathname === '/signin' ||
          pathname === '/signup' ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/signin') ||
          pathname.startsWith('/signup') ||
          pathname.startsWith('/api/health')
        ) {
          return true;
        }

        // For all other routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and images
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
