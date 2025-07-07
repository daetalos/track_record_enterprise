import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../db';

// Mock the Prisma client
vi.mock('../db', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Database Client', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe('User Operations', () => {
    it('should create a user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        hashedPassword: 'hashedpassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await prismaMock.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          hashedPassword: 'hashedpassword123',
        },
      });

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          hashedPassword: 'hashedpassword123',
        },
      });
    });

    it('should find a user by email', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        hashedPassword: 'hashedpassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await prismaMock.user.findUnique({
        where: { email: 'test@example.com' },
      });

      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await prismaMock.user.findUnique({
        where: { email: 'nonexistent@example.com' },
      });

      expect(result).toBeNull();
    });
  });

  describe('Session Operations', () => {
    it('should create a session', async () => {
      const mockSession = {
        id: '1',
        sessionToken: 'session123',
        userId: '1',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };

      prismaMock.session.create.mockResolvedValue(mockSession);

      const result = await prismaMock.session.create({
        data: {
          sessionToken: 'session123',
          userId: '1',
          expires: mockSession.expires,
        },
      });

      expect(result).toEqual(mockSession);
    });
  });

  describe('Account Operations', () => {
    it('should create an account', async () => {
      const mockAccount = {
        id: '1',
        userId: '1',
        type: 'credentials' as const,
        provider: 'credentials',
        providerAccountId: '1',
      };

      prismaMock.account.create.mockResolvedValue(mockAccount);

      const result = await prismaMock.account.create({
        data: {
          userId: '1',
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: '1',
        },
      });

      expect(result).toEqual(mockAccount);
    });
  });
});
