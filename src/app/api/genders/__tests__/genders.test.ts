import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the entire db module
vi.mock('@/lib/db', () => ({
  prisma: {
    gender: {
      findMany: vi.fn(),
    },
  },
}));

import { GET } from '../route';
import { prisma } from '@/lib/db';

// Get the mocked function
const mockFindMany = vi.mocked(prisma.gender.findMany);

describe('/api/genders GET endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return all genders successfully', async () => {
    const mockGenders = [
      { id: 'gender-1', name: 'Male', initial: 'M' },
      { id: 'gender-2', name: 'Female', initial: 'F' },
    ];

    mockFindMany.mockResolvedValue(mockGenders);

    const response = await GET();
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      success: true,
      data: mockGenders,
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
  });

  it('should handle database errors gracefully', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    mockFindMany.mockRejectedValue(new Error('Database connection failed'));

    const response = await GET();
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      error: 'Failed to fetch genders',
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching genders:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should return empty array when no genders exist', async () => {
    mockFindMany.mockResolvedValue([]);

    const response = await GET();
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      success: true,
      data: [],
    });
  });
});
