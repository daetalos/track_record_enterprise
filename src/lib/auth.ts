import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './db';
import { env } from './env';
import { getUserClubs } from './db';

// Extend the default session type to include user id and club context
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    selectedClubId?: string | null;
  }
}

// Extend JWT token to include club context
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    selectedClubId?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            include: {
              accounts: true,
            },
          });

          if (!user) {
            return null;
          }

          // For credential accounts, check if password exists
          const credentialAccount = user.accounts.find(
            (account: { provider: string }) =>
              account.provider === 'credentials'
          );

          if (!credentialAccount?.refresh_token) {
            return null;
          }

          // Verify password (stored in refresh_token field for credentials)
          const isPasswordValid = await compare(
            credentials.password,
            credentialAccount.refresh_token
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;

        // Auto-select club for single club users on initial login
        try {
          const userClubs = await getUserClubs(user.id);
          if (userClubs.length === 1) {
            token.selectedClubId = userClubs[0].club.id;
          }
        } catch (error) {
          console.error('Error auto-selecting club:', error);
        }
      }

      // Handle club selection updates via session trigger
      if (trigger === 'update' && session?.selectedClubId !== undefined) {
        token.selectedClubId = session.selectedClubId;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }

      // Include selected club ID in session
      if (token?.selectedClubId !== undefined) {
        session.selectedClubId = token.selectedClubId;
      }

      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      console.log('User signed in:', { userId: user.id, isNewUser });
    },
    async signOut({ token }) {
      console.log('User signed out:', { userId: token?.id });
    },
  },
  debug: env.NODE_ENV === 'development',
};

export default authOptions;
