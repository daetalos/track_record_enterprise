import { PrismaClient } from '@prisma/client';
import { env, getDatabaseUrl } from './env';
import type { Club, UserClub, ClubRole } from '@prisma/client';
import type {
  UserClubWithClub,
  ClubWithStats,
  CreateClubRequest,
  UpdateClubRequest,
} from '@/types/club';

// Global type for Prisma client to prevent multiple instances
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Prisma client configuration with enterprise settings
const createPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });
};

// Singleton pattern for Prisma client to prevent connection issues
export const prisma = globalThis.__prisma ?? createPrismaClient();

// In development, store client on global object to prevent hot reload issues
if (env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

// Graceful shutdown helper
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

// Database health check utility
export const checkDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Transaction helper with error handling
export const withTransaction = async <T>(
  fn: (
    tx: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) => Promise<T>
): Promise<T> => {
  return await prisma.$transaction(fn);
};

// === CLUB DATABASE OPERATIONS ===

/**
 * Get all clubs that a user has access to
 */
export const getUserClubs = async (
  userId: string
): Promise<UserClubWithClub[]> => {
  return await prisma.userClub.findMany({
    where: {
      userId,
      isActive: true,
      club: {
        isActive: true,
      },
    },
    include: {
      club: true,
    },
    orderBy: [{ club: { name: 'asc' } }],
  });
};

/**
 * Get a specific club by ID with member count
 */
export const getClubById = async (
  clubId: string
): Promise<ClubWithStats | null> => {
  const club = await prisma.club.findUnique({
    where: { id: clubId, isActive: true },
    include: {
      userClubs: {
        where: { isActive: true },
      },
    },
  });

  if (!club) return null;

  return {
    ...club,
    memberCount: club.userClubs.length,
  };
};

/**
 * Check if user has access to a specific club
 */
export const userHasClubAccess = async (
  userId: string,
  clubId: string
): Promise<boolean> => {
  const userClub = await prisma.userClub.findUnique({
    where: {
      userId_clubId: {
        userId,
        clubId,
      },
      isActive: true,
    },
  });

  return !!userClub;
};

/**
 * Get user's role in a specific club
 */
export const getUserClubRole = async (
  userId: string,
  clubId: string
): Promise<ClubRole | null> => {
  const userClub = await prisma.userClub.findUnique({
    where: {
      userId_clubId: {
        userId,
        clubId,
      },
      isActive: true,
    },
    select: {
      role: true,
    },
  });

  return userClub?.role || null;
};

/**
 * Create a new club
 */
export const createClub = async (
  data: CreateClubRequest,
  ownerId: string
): Promise<Club> => {
  return await withTransaction(async tx => {
    // Create the club
    const club = await tx.club.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    // Add the creator as owner
    await tx.userClub.create({
      data: {
        userId: ownerId,
        clubId: club.id,
        role: 'OWNER',
      },
    });

    return club;
  });
};

/**
 * Update club information
 */
export const updateClub = async (
  clubId: string,
  data: UpdateClubRequest
): Promise<Club> => {
  return await prisma.club.update({
    where: { id: clubId },
    data,
  });
};

/**
 * Add a user to a club
 */
export const addUserToClub = async (
  userId: string,
  clubId: string,
  role: ClubRole = 'MEMBER'
): Promise<UserClub> => {
  return await prisma.userClub.create({
    data: {
      userId,
      clubId,
      role,
    },
  });
};

/**
 * Remove a user from a club (soft delete)
 */
export const removeUserFromClub = async (
  userId: string,
  clubId: string
): Promise<UserClub> => {
  return await prisma.userClub.update({
    where: {
      userId_clubId: {
        userId,
        clubId,
      },
    },
    data: {
      isActive: false,
    },
  });
};

/**
 * Get club member count
 */
export const getClubMemberCount = async (clubId: string): Promise<number> => {
  return await prisma.userClub.count({
    where: {
      clubId,
      isActive: true,
    },
  });
};

export default prisma;
