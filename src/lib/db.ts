import { PrismaClient } from '@prisma/client';
import { env, getDatabaseUrl } from './env';

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
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> => {
  return await prisma.$transaction(fn);
};

export default prisma;
