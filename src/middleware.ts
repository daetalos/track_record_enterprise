import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    // If we get here, the user is authenticated
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
          pathname.startsWith('/signup')
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
