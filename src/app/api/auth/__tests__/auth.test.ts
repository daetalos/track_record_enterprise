import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { createUser, isEmailRegistered } from '../../../../lib/auth-utils';

// Mock the Prisma client
vi.mock('../../../../lib/db', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

// Mock bcrypt
vi.mock('bcryptjs', () => ({
  hash: vi.fn(),
}));

// Import the mocked hash function
const { hash } = await import('bcryptjs');

const prismaMock = vi.mocked(await import('../../../../lib/db'))
  .prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Authentication Utilities', () => {
  beforeEach(() => {
    mockReset(prismaMock);
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const hashedPassword = 'hashed_password_123';
      const mockUser = {
        id: '1',
        email: userData.email,
        name: userData.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock existing user check (should return null)
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Mock bcrypt.hash
      (hash as Mock).mockResolvedValue(hashedPassword);

      // Mock transaction
      prismaMock.$transaction.mockResolvedValue(mockUser);

      const result = await createUser(userData);

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
      expect(result.error).toBeUndefined();
    });

    it('should reject user creation if email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123',
      };

      const existingUser = {
        id: '1',
        email: userData.email,
        name: 'Existing User',
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock existing user check (should return existing user)
      prismaMock.user.findUnique.mockResolvedValue(existingUser);

      const result = await createUser(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User with this email already exists');
      expect(result.user).toBeUndefined();
    });
  });

  describe('isEmailRegistered', () => {
    it('should return true for existing email', async () => {
      const email = 'existing@example.com';
      const mockUser = {
        id: '1',
        email,
        name: 'Test User',
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await isEmailRegistered(email);

      expect(result).toBe(true);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return false for non-existent email', async () => {
      const email = 'nonexistent@example.com';

      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await isEmailRegistered(email);

      expect(result).toBe(false);
    });
  });
});
