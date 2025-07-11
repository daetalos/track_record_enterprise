// Medal API endpoints for competition awards

import { NextResponse } from 'next/server';
import {
  getMedalsByPosition,
  validateMedalPosition,
} from '@/lib/medalValidation';

/**
 * GET /api/medals - Retrieve all medals in position order
 * Returns medals with their positions and names (Gold/Silver/Bronze)
 */
export async function GET() {
  try {
    // Get all medals using validation functions
    const medals = getMedalsByPosition();

    return NextResponse.json({
      success: true,
      data: medals,
      message: 'Medals retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving medals:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve medals',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/medals - Create a new medal (for testing/development)
 * Body: { position: number, name: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { position, name } = body;

    // Validate position
    if (!validateMedalPosition(position)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid medal position',
          message: 'Position must be between 1 and 12',
        },
        { status: 400 }
      );
    }

    // For this iteration, we're just validating the data structure
    // Actual database operations will be implemented in later iterations

    return NextResponse.json({
      success: true,
      data: { position, name },
      message: 'Medal validation successful',
    });
  } catch (error) {
    console.error('Error processing medal creation:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process medal creation',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
