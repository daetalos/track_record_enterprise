import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser, isEmailRegistered } from '@/lib/auth-utils';

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if email is already registered
    const emailExists = await isEmailRegistered(email);
    if (emailExists) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const userResult = await createUser({ name, email, password });

    if (!userResult.success) {
      return NextResponse.json(
        { error: userResult.error || 'Failed to create user' },
        { status: 500 }
      );
    }

    // Return success (without password)
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userResult.user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
