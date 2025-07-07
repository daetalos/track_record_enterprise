import { PrismaClient } from '@prisma/client';

// Test database client
let testPrisma: PrismaClient;

export async function setupTestDatabase(): Promise<PrismaClient> {
  if (!testPrisma) {
    testPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
        },
      },
      log: ['error'],
    });
  }

  await testPrisma.$connect();
  return testPrisma;
}

export async function cleanupTestDatabase(): Promise<void> {
  if (testPrisma) {
    // Clean up all tables in reverse order to avoid foreign key constraints
    await testPrisma.account.deleteMany();
    await testPrisma.session.deleteMany();
    await testPrisma.user.deleteMany();

    await testPrisma.$disconnect();
  }
}

export async function resetTestDatabase(): Promise<void> {
  if (testPrisma) {
    // Clean up all tables in reverse order to avoid foreign key constraints
    await testPrisma.account.deleteMany();
    await testPrisma.session.deleteMany();
    await testPrisma.user.deleteMany();
  }
}

export function getTestPrisma(): PrismaClient {
  if (!testPrisma) {
    throw new Error(
      'Test database not initialized. Call setupTestDatabase() first.'
    );
  }
  return testPrisma;
}
