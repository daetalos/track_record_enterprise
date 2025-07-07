import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  resetTestDatabase,
  getTestPrisma,
} from '../../test/db-setup';
import type { PrismaClient } from '@prisma/client';

describe('Database Operations', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  describe('User Model', () => {
    it('should create a new user', async () => {
      const prisma = getTestPrisma();

      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          emailVerified: new Date(),
        },
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.id).toBeDefined();
      expect(typeof user.id).toBe('string');
    });

    it('should enforce unique email constraint', async () => {
      const prisma = getTestPrisma();

      const userData = {
        email: 'duplicate@example.com',
        name: 'Test User',
      };

      // Create first user
      await prisma.user.create({ data: userData });

      // Try to create second user with same email
      await expect(prisma.user.create({ data: userData })).rejects.toThrow();
    });

    it('should find user by email', async () => {
      const prisma = getTestPrisma();

      const email = 'findme@example.com';
      await prisma.user.create({
        data: {
          email,
          name: 'Find Me User',
        },
      });

      const foundUser = await prisma.user.findUnique({
        where: { email },
      });

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(email);
    });

    it('should update user information', async () => {
      const prisma = getTestPrisma();

      const user = await prisma.user.create({
        data: {
          email: 'update@example.com',
          name: 'Original Name',
        },
      });

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { name: 'Updated Name' },
      });

      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.email).toBe('update@example.com');
    });

    it('should delete a user', async () => {
      const prisma = getTestPrisma();

      const user = await prisma.user.create({
        data: {
          email: 'delete@example.com',
          name: 'Delete Me',
        },
      });

      await prisma.user.delete({
        where: { id: user.id },
      });

      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(deletedUser).toBeNull();
    });
  });

  describe('Account Model', () => {
    it('should create an account linked to a user', async () => {
      const prisma = getTestPrisma();

      // Create user first
      const user = await prisma.user.create({
        data: {
          email: 'account-test@example.com',
          name: 'Account Test User',
        },
      });

      // Create account
      const account = await prisma.account.create({
        data: {
          userId: user.id,
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: user.id,
          refresh_token: 'hashed_password_here',
        },
      });

      expect(account).toBeDefined();
      expect(account.userId).toBe(user.id);
      expect(account.provider).toBe('credentials');
    });

    it('should find accounts by user', async () => {
      const prisma = getTestPrisma();

      const user = await prisma.user.create({
        data: {
          email: 'multi-account@example.com',
          name: 'Multi Account User',
        },
      });

      // Create multiple accounts
      await prisma.account.createMany({
        data: [
          {
            userId: user.id,
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: user.id,
          },
          {
            userId: user.id,
            type: 'oauth',
            provider: 'google',
            providerAccountId: 'google-123',
          },
        ],
      });

      const userWithAccounts = await prisma.user.findUnique({
        where: { id: user.id },
        include: { accounts: true },
      });

      expect(userWithAccounts?.accounts).toHaveLength(2);
      expect(
        userWithAccounts?.accounts.some(
          (acc: { provider: string }) => acc.provider === 'credentials'
        )
      ).toBe(true);
      expect(
        userWithAccounts?.accounts.some(
          (acc: { provider: string }) => acc.provider === 'google'
        )
      ).toBe(true);
    });
  });

  describe('Session Model', () => {
    it('should create a session for a user', async () => {
      const prisma = getTestPrisma();

      const user = await prisma.user.create({
        data: {
          email: 'session-test@example.com',
          name: 'Session Test User',
        },
      });

      const session = await prisma.session.create({
        data: {
          sessionToken: 'test_session_token',
          userId: user.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      expect(session).toBeDefined();
      expect(session.userId).toBe(user.id);
      expect(session.sessionToken).toBe('test_session_token');
    });

    it('should find valid sessions', async () => {
      const prisma = getTestPrisma();

      const user = await prisma.user.create({
        data: {
          email: 'valid-session@example.com',
          name: 'Valid Session User',
        },
      });

      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Create valid and expired sessions
      await prisma.session.createMany({
        data: [
          {
            sessionToken: 'valid_token',
            userId: user.id,
            expires: futureDate,
          },
          {
            sessionToken: 'expired_token',
            userId: user.id,
            expires: pastDate,
          },
        ],
      });

      const validSessions = await prisma.session.findMany({
        where: {
          userId: user.id,
          expires: { gt: new Date() },
        },
      });

      expect(validSessions).toHaveLength(1);
      expect(validSessions[0].sessionToken).toBe('valid_token');
    });
  });

  describe('Transaction Operations', () => {
    it('should handle successful transactions', async () => {
      const prisma = getTestPrisma();

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
          const user = await tx.user.create({
            data: {
              email: 'transaction@example.com',
              name: 'Transaction User',
            },
          });

          const account = await tx.account.create({
            data: {
              userId: user.id,
              type: 'credentials',
              provider: 'credentials',
              providerAccountId: user.id,
            },
          });

          return { user, account };
        }
      );

      expect(result.user).toBeDefined();
      expect(result.account).toBeDefined();
      expect(result.account.userId).toBe(result.user.id);

      // Verify data was actually committed
      const user = await prisma.user.findUnique({
        where: { id: result.user.id },
        include: { accounts: true },
      });

      expect(user).toBeDefined();
      expect(user?.accounts).toHaveLength(1);
    });

    it('should rollback failed transactions', async () => {
      const prisma = getTestPrisma();

      await expect(
        prisma.$transaction(
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
            await tx.user.create({
              data: {
                email: 'rollback@example.com',
                name: 'Rollback User',
              },
            });

            // Force an error
            throw new Error('Transaction should rollback');
          }
        )
      ).rejects.toThrow('Transaction should rollback');

      // Verify no user was created
      const user = await prisma.user.findUnique({
        where: { email: 'rollback@example.com' },
      });

      expect(user).toBeNull();
    });
  });
});
