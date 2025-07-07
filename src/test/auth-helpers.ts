import { hash } from 'bcryptjs';
import { getTestPrisma } from './db-setup';
import type { PrismaClient } from '@prisma/client';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  password?: string;
}

export interface CreateTestUserOptions {
  email?: string;
  name?: string;
  password?: string;
}

/**
 * Create a test user with authentication credentials
 */
export async function createTestUser(
  options: CreateTestUserOptions = {}
): Promise<TestUser> {
  const prisma = getTestPrisma();

  const email = options.email || `test-${Date.now()}@example.com`;
  const name = options.name || 'Test User';
  const password = options.password || 'testpassword123';

  // Hash password
  const hashedPassword = await hash(password, 12);

  // Create user and credential account in a transaction
  const result = await prisma.$transaction(
    async (
      tx: Omit<
        PrismaClient,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      >
    ) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          name,
          emailVerified: new Date(),
        },
      });

      // Create credential account with hashed password
      await tx.account.create({
        data: {
          userId: user.id,
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: user.id,
          refresh_token: hashedPassword, // Store hashed password here for credentials
        },
      });

      return user;
    }
  );

  return {
    id: result.id,
    email: result.email!,
    name: result.name!,
    password,
  };
}

/**
 * Create multiple test users
 */
export async function createTestUsers(count: number): Promise<TestUser[]> {
  const users: TestUser[] = [];

  for (let i = 0; i < count; i++) {
    const user = await createTestUser({
      email: `test-user-${i}-${Date.now()}@example.com`,
      name: `Test User ${i + 1}`,
    });
    users.push(user);
  }

  return users;
}

/**
 * Find a test user by email
 */
export async function findTestUser(email: string) {
  const prisma = getTestPrisma();

  return await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: true,
    },
  });
}

/**
 * Verify a user's password
 */
export async function verifyTestUserPassword(
  email: string,
  password: string
): Promise<boolean> {
  const user = await findTestUser(email);

  if (!user) {
    return false;
  }

  const credentialAccount = user.accounts.find(
    (account: { provider: string }) => account.provider === 'credentials'
  );

  if (!credentialAccount?.refresh_token) {
    return false;
  }

  const bcrypt = await import('bcryptjs');
  return await bcrypt.compare(password, credentialAccount.refresh_token);
}
