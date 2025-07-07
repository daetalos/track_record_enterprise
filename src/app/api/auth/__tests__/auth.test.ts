import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  resetTestDatabase,
} from '../../../../test/db-setup';
import {
  createTestUser,
  findTestUser,
  verifyTestUserPassword,
} from '../../../../test/auth-helpers';
import { createUser, isEmailRegistered } from '../../../../lib/auth-utils';

describe('Authentication System', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  describe('User Registration', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'securepassword123',
      };

      const result = await createUser(userData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(userData.email);
      expect(result.user?.name).toBe(userData.name);
      expect(result.user?.id).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should reject registration with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'securepassword123',
      };

      // Create first user
      const firstResult = await createUser(userData);
      expect(firstResult.success).toBe(true);

      // Try to create second user with same email
      const secondResult = await createUser(userData);
      expect(secondResult.success).toBe(false);
      expect(secondResult.error).toContain('already exists');
      expect(secondResult.user).toBeUndefined();
    });

    it('should hash passwords correctly', async () => {
      const userData = {
        name: 'Password Test',
        email: 'password@example.com',
        password: 'mypassword123',
      };

      const result = await createUser(userData);
      expect(result.success).toBe(true);

      // Find the created user
      const user = await findTestUser(userData.email);
      expect(user).toBeDefined();

      // Check that password is hashed (not stored in plain text)
      const credentialAccount = user?.accounts.find(
        (account: { provider: string }) => account.provider === 'credentials'
      );
      expect(credentialAccount?.refresh_token).toBeDefined();
      expect(credentialAccount?.refresh_token).not.toBe(userData.password);

      // Verify password verification works
      const isValid = await verifyTestUserPassword(
        userData.email,
        userData.password
      );
      expect(isValid).toBe(true);

      // Verify wrong password fails
      const isInvalid = await verifyTestUserPassword(
        userData.email,
        'wrongpassword'
      );
      expect(isInvalid).toBe(false);
    });

    it('should validate required fields', async () => {
      // Test missing name
      const resultMissingName = await createUser({
        name: '',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(resultMissingName.success).toBe(false);

      // Test invalid email
      const resultInvalidEmail = await createUser({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      });
      expect(resultInvalidEmail.success).toBe(false);

      // Test short password
      const resultShortPassword = await createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
      });
      expect(resultShortPassword.success).toBe(false);
    });
  });

  describe('Email Registration Check', () => {
    it('should detect existing email addresses', async () => {
      const email = 'existing@example.com';

      // Initially email should not be registered
      const initialCheck = await isEmailRegistered(email);
      expect(initialCheck).toBe(false);

      // Create a user
      await createUser({
        name: 'Existing User',
        email,
        password: 'password123',
      });

      // Now email should be registered
      const finalCheck = await isEmailRegistered(email);
      expect(finalCheck).toBe(true);
    });

    it('should handle case-insensitive email checks', async () => {
      const email = 'CaseTest@Example.Com';

      await createUser({
        name: 'Case Test',
        email: email.toLowerCase(),
        password: 'password123',
      });

      const isRegistered = await isEmailRegistered(email);
      expect(isRegistered).toBe(true);
    });
  });

  describe('User Lookup', () => {
    it('should find users by email', async () => {
      const testUser = await createTestUser({
        email: 'lookup@example.com',
        name: 'Lookup Test',
        password: 'testpassword',
      });

      const foundUser = await findTestUser(testUser.email);
      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(testUser.email);
      expect(foundUser?.name).toBe(testUser.name);
      expect(foundUser?.accounts).toBeDefined();
    });

    it('should return null for non-existent users', async () => {
      const user = await findTestUser('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('Password Verification', () => {
    it('should verify correct passwords', async () => {
      const testUser = await createTestUser({
        email: 'verify@example.com',
        name: 'Verify Test',
        password: 'correctpassword',
      });

      const isValid = await verifyTestUserPassword(
        testUser.email,
        'correctpassword'
      );
      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const testUser = await createTestUser({
        email: 'reject@example.com',
        name: 'Reject Test',
        password: 'correctpassword',
      });

      const isValid = await verifyTestUserPassword(
        testUser.email,
        'wrongpassword'
      );
      expect(isValid).toBe(false);
    });

    it('should handle non-existent users gracefully', async () => {
      const isValid = await verifyTestUserPassword(
        'nobody@example.com',
        'anypassword'
      );
      expect(isValid).toBe(false);
    });

    it('should handle users without credentials', async () => {
      // This would be a user created via OAuth without password
      const testUser = await createTestUser({
        email: 'oauth@example.com',
        name: 'OAuth User',
      });

      // Manually remove credential account to simulate OAuth-only user
      const user = await findTestUser(testUser.email);
      if (user) {
        const { getTestPrisma } = await import('../../../../test/db-setup');
        const prisma = getTestPrisma();
        await prisma.account.deleteMany({
          where: {
            userId: user.id,
            provider: 'credentials',
          },
        });
      }

      const isValid = await verifyTestUserPassword(
        testUser.email,
        'anypassword'
      );
      expect(isValid).toBe(false);
    });
  });

  describe('Authentication Integration', () => {
    it('should create users with proper account relationships', async () => {
      const testUser = await createTestUser({
        email: 'integration@example.com',
        name: 'Integration Test',
        password: 'integrationpassword',
      });

      const user = await findTestUser(testUser.email);
      expect(user).toBeDefined();
      expect(user?.accounts).toHaveLength(1);

      const account = user?.accounts[0];
      expect(account?.provider).toBe('credentials');
      expect(account?.type).toBe('credentials');
      expect(account?.userId).toBe(user?.id);
      expect(account?.refresh_token).toBeDefined();
    });

    it('should handle multiple authentication methods for one user', async () => {
      const testUser = await createTestUser({
        email: 'multi@example.com',
        name: 'Multi Auth Test',
        password: 'multipassword',
      });

      // Simulate adding an OAuth account
      const user = await findTestUser(testUser.email);
      if (user) {
        const { getTestPrisma } = await import('../../../../test/db-setup');
        const prisma = getTestPrisma();

        await prisma.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: 'google',
            providerAccountId: 'google-123456',
            access_token: 'mock_access_token',
          },
        });
      }

      const updatedUser = await findTestUser(testUser.email);
      expect(updatedUser?.accounts).toHaveLength(2);
      expect(
        updatedUser?.accounts.some(
          (acc: { provider: string }) => acc.provider === 'credentials'
        )
      ).toBe(true);
      expect(
        updatedUser?.accounts.some(
          (acc: { provider: string }) => acc.provider === 'google'
        )
      ).toBe(true);
    });
  });
});
