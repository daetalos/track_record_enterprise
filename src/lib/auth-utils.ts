import { hash } from 'bcryptjs';
import { prisma } from './db';
import type { PrismaClient } from '@prisma/client';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

/**
 * Create a new user with hashed password
 */
export async function createUser(
  input: CreateUserInput
): Promise<CreateUserResult> {
  try {
    const { name, email, password } = input;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists',
      };
    }

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
            name,
            email,
          },
        });

        // Create credentials account (storing hashed password in refresh_token)
        await tx.account.create({
          data: {
            userId: user.id,
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: user.id,
            refresh_token: hashedPassword, // Store hashed password here
          },
        });

        return user;
      }
    );

    return {
      success: true,
      user: {
        id: result.id,
        email: result.email,
        name: result.name || '',
      },
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: 'Failed to create user',
    };
  }
}

/**
 * Verify if an email is already registered
 */
export async function isEmailRegistered(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  id: string,
  data: { name?: string; image?: string }
) {
  try {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}
