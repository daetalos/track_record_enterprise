import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/genders
 * Get all available genders (public data)
 */
export async function GET() {
  try {
    const genders = await prisma.gender.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: genders,
    });
  } catch (error) {
    console.error('Error fetching genders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genders' },
      { status: 500 }
    );
  }
}
