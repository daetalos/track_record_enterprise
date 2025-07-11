// Medal API endpoint tests

import { describe, it, expect } from 'vitest';
import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import { getMedalsByPosition } from '@/lib/medalValidation';

// Helper function to create a mock NextRequest
function createMockRequest(method: string, body?: any): NextRequest {
  const url = 'http://localhost:3000/api/medals';

  return new NextRequest(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe('/api/medals', () => {
  describe('GET endpoint', () => {
    it('should return all medals with success status', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: getMedalsByPosition(),
        message: 'Medals retrieved successfully',
      });
    });

    it('should return medals in correct order (positions 1-12)', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(12);

      // Check each medal has correct position
      data.data.forEach((medal: any, index: number) => {
        expect(medal.position).toBe(index + 1);
      });
    });

    it('should return correct medal names (Gold, Silver, Bronze)', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.success).toBe(true);

      const medals = data.data;

      // Position 1 should be Gold
      expect(medals[0]).toEqual({ position: 1, name: 'Gold' });

      // Position 2 should be Silver
      expect(medals[1]).toEqual({ position: 2, name: 'Silver' });

      // Positions 3-12 should be Bronze
      for (let i = 2; i < 12; i++) {
        expect(medals[i]).toEqual({
          position: i + 1,
          name: 'Bronze',
        });
      }
    });

    it('should have proper response structure', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('message');
      expect(typeof data.success).toBe('boolean');
      expect(Array.isArray(data.data)).toBe(true);
      expect(typeof data.message).toBe('string');
    });
  });

  describe('POST endpoint', () => {
    it('should validate medal with valid position and name', async () => {
      const validMedalData = {
        position: 1,
        name: 'Gold',
      };

      const request = createMockRequest('POST', validMedalData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: validMedalData,
        message: 'Medal validation successful',
      });
    });

    it('should validate medal with valid Bronze position', async () => {
      const validMedalData = {
        position: 5,
        name: 'Bronze',
      };

      const request = createMockRequest('POST', validMedalData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(validMedalData);
    });

    it('should reject invalid medal position below 1', async () => {
      const invalidMedalData = {
        position: 0,
        name: 'Gold',
      };

      const request = createMockRequest('POST', invalidMedalData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Invalid medal position',
        message: 'Position must be between 1 and 12',
      });
    });

    it('should reject invalid medal position above 12', async () => {
      const invalidMedalData = {
        position: 15,
        name: 'Gold',
      };

      const request = createMockRequest('POST', invalidMedalData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid medal position');
    });

    it('should reject non-integer positions', async () => {
      const invalidMedalData = {
        position: 1.5,
        name: 'Gold',
      };

      const request = createMockRequest('POST', invalidMedalData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should reject negative positions', async () => {
      const invalidMedalData = {
        position: -1,
        name: 'Gold',
      };

      const request = createMockRequest('POST', invalidMedalData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should handle missing position field', async () => {
      const invalidMedalData = {
        name: 'Gold',
      };

      const request = createMockRequest('POST', invalidMedalData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should handle missing name field', async () => {
      const invalidMedalData = {
        position: 1,
      };

      const request = createMockRequest('POST', invalidMedalData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200); // Name validation is not enforced in current implementation
      expect(data.success).toBe(true);
    });

    it('should handle malformed JSON body', async () => {
      const url = 'http://localhost:3000/api/medals';
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json{',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to process medal creation');
    });

    it('should handle empty request body', async () => {
      const request = createMockRequest('POST');
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should have proper error response structure', async () => {
      const invalidMedalData = {
        position: 0,
        name: 'Gold',
      };

      const request = createMockRequest('POST', invalidMedalData);
      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('message');
      expect(data.success).toBe(false);
      expect(typeof data.error).toBe('string');
      expect(typeof data.message).toBe('string');
    });

    it('should provide meaningful error messages', async () => {
      const invalidMedalData = {
        position: 20,
        name: 'Gold',
      };

      const request = createMockRequest('POST', invalidMedalData);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe('Position must be between 1 and 12');
      expect(data.error).toBe('Invalid medal position');
    });
  });

  describe('Integration with validation functions', () => {
    it('should use medal validation functions consistently', async () => {
      // Test that API returns same data as validation functions
      const response = await GET();
      const apiData = await response.json();
      const validationData = getMedalsByPosition();

      expect(apiData.data).toEqual(validationData);
    });

    it('should validate all positions 1-12 through API', async () => {
      for (let position = 1; position <= 12; position++) {
        const medalData = {
          position,
          name: position === 1 ? 'Gold' : position === 2 ? 'Silver' : 'Bronze',
        };

        const request = createMockRequest('POST', medalData);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toEqual(medalData);
      }
    });

    it('should reject all invalid positions through API', async () => {
      const invalidPositions = [0, -1, 13, 15, 20, 1.5, NaN];

      for (const position of invalidPositions) {
        const medalData = {
          position,
          name: 'Gold',
        };

        const request = createMockRequest('POST', medalData);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
      }
    });
  });
});
