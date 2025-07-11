import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET, PUT, DELETE } from '../route';
import { prisma } from '@/lib/db';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/db', () => ({
  prisma: {
    season: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    userClub: {
      findFirst: vi.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as any;
const mockPrisma = prisma as any;

const mockParams = { id: 'season1' };

describe('/api/seasons/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET endpoint', () => {
    it('should return specific season for authenticated user', async () => {
      // Mock authentication
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      // Mock database response
      const mockSeason = {
        id: 'season1',
        name: 'Track & Field',
        description: 'Outdoor track season',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { disciplines: 5 },
      };

      mockPrisma.season.findUnique.mockResolvedValue(mockSeason);

      const request = new NextRequest('http://localhost/api/seasons/season1');
      const response = await GET(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Track & Field');
      expect(data.data.description).toBe('Outdoor track season');
      expect(mockPrisma.season.findUnique).toHaveBeenCalledWith({
        where: { id: 'season1' },
        include: {
          _count: {
            select: { disciplines: true },
          },
        },
      });
    });

    it('should return 401 for unauthenticated users', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/seasons/season1');
      const response = await GET(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
      expect(mockPrisma.season.findUnique).not.toHaveBeenCalled();
    });

    it('should return 404 for non-existent season', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.season.findUnique.mockResolvedValue(null);

      const request = new NextRequest(
        'http://localhost/api/seasons/nonexistent'
      );
      const response = await GET(request, {
        params: Promise.resolve({ id: 'nonexistent' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Season not found');
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.season.findUnique.mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest('http://localhost/api/seasons/season1');
      const response = await GET(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch season');
    });
  });

  describe('PUT endpoint', () => {
    const validUpdateData = {
      name: 'Track & Field - Updated',
      description: 'Updated outdoor track season',
    };

    it('should update season for admin user', async () => {
      // Mock authentication with admin role
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      // Mock existing season
      const existingSeason = {
        id: 'season1',
        name: 'Track & Field',
      };

      mockPrisma.season.findUnique
        .mockResolvedValueOnce(existingSeason) // For duplicate check
        .mockResolvedValueOnce(null); // No duplicate found

      // Mock update success
      const mockUpdatedSeason = {
        id: 'season1',
        ...validUpdateData,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { disciplines: 5 },
      };

      mockPrisma.season.update.mockResolvedValue(mockUpdatedSeason);

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
      });

      const response = await PUT(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Track & Field - Updated');
      expect(data.data.description).toBe('Updated outdoor track season');
      expect(data.message).toBe('Season updated successfully');
      expect(mockPrisma.season.update).toHaveBeenCalledWith({
        where: { id: 'season1' },
        data: validUpdateData,
        include: {
          _count: {
            select: { disciplines: true },
          },
        },
      });
    });

    it('should update season for owner user', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'OWNER',
        isActive: true,
      });

      mockPrisma.season.findUnique
        .mockResolvedValueOnce({ id: 'season1', name: 'Track & Field' })
        .mockResolvedValueOnce(null);

      const mockUpdatedSeason = {
        id: 'season1',
        ...validUpdateData,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { disciplines: 5 },
      };

      mockPrisma.season.update.mockResolvedValue(mockUpdatedSeason);

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
      });

      const response = await PUT(request, {
        params: Promise.resolve(mockParams),
      });

      expect(response.status).toBe(200);
    });

    it('should return 401 for unauthenticated users', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
      });

      const response = await PUT(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
      expect(mockPrisma.season.update).not.toHaveBeenCalled();
    });

    it('should return 403 for member users', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue(null); // No admin/owner role

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
      });

      const response = await PUT(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe(
        'Insufficient permissions - Admin or Owner role required'
      );
      expect(mockPrisma.season.update).not.toHaveBeenCalled();
    });

    it('should return 404 for non-existent season', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      mockPrisma.season.findUnique.mockResolvedValue(null);

      const request = new NextRequest(
        'http://localhost/api/seasons/nonexistent',
        {
          method: 'PUT',
          body: JSON.stringify(validUpdateData),
        }
      );

      const response = await PUT(request, {
        params: Promise.resolve({ id: 'nonexistent' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Season not found');
      expect(mockPrisma.season.update).not.toHaveBeenCalled();
    });

    it('should return 409 for duplicate season name', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      // Mock existing season and duplicate
      mockPrisma.season.findUnique
        .mockResolvedValueOnce({ id: 'season1', name: 'Track & Field' })
        .mockResolvedValueOnce({
          id: 'season2',
          name: 'Track & Field - Updated',
        });

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
      });

      const response = await PUT(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe('Season with this name already exists');
      expect(mockPrisma.season.update).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid update data', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      const invalidData = {
        name: 'A'.repeat(65), // Exceeds 64 character limit
      };

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'PUT',
        body: JSON.stringify(invalidData),
      });

      const response = await PUT(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details[0].message).toContain('64 characters or less');
      expect(mockPrisma.season.update).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      mockPrisma.season.findUnique
        .mockResolvedValueOnce({ id: 'season1', name: 'Track & Field' })
        .mockResolvedValueOnce(null);

      mockPrisma.season.update.mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
      });

      const response = await PUT(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update season');
    });
  });

  describe('DELETE endpoint', () => {
    it('should delete season for admin user when no disciplines exist', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      // Mock existing season with no disciplines
      const existingSeason = {
        id: 'season1',
        name: 'Track & Field',
        _count: { disciplines: 0 },
      };

      mockPrisma.season.findUnique.mockResolvedValue(existingSeason);
      mockPrisma.season.delete.mockResolvedValue(existingSeason);

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Season deleted successfully');
      expect(mockPrisma.season.delete).toHaveBeenCalledWith({
        where: { id: 'season1' },
      });
    });

    it('should return 401 for unauthenticated users', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
      expect(mockPrisma.season.delete).not.toHaveBeenCalled();
    });

    it('should return 403 for member users', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe(
        'Insufficient permissions - Admin or Owner role required'
      );
      expect(mockPrisma.season.delete).not.toHaveBeenCalled();
    });

    it('should return 404 for non-existent season', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      mockPrisma.season.findUnique.mockResolvedValue(null);

      const request = new NextRequest(
        'http://localhost/api/seasons/nonexistent',
        {
          method: 'DELETE',
        }
      );

      const response = await DELETE(request, {
        params: Promise.resolve({ id: 'nonexistent' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Season not found');
      expect(mockPrisma.season.delete).not.toHaveBeenCalled();
    });

    it('should return 409 when season has disciplines', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      // Mock existing season with disciplines
      const existingSeason = {
        id: 'season1',
        name: 'Track & Field',
        _count: { disciplines: 5 },
      };

      mockPrisma.season.findUnique.mockResolvedValue(existingSeason);

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe('Cannot delete season with existing disciplines');
      expect(data.details).toContain('Season has 5 disciplines');
      expect(mockPrisma.season.delete).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user1' },
      });

      mockPrisma.userClub.findFirst.mockResolvedValue({
        role: 'ADMIN',
        isActive: true,
      });

      mockPrisma.season.findUnique.mockResolvedValue({
        id: 'season1',
        name: 'Track & Field',
        _count: { disciplines: 0 },
      });

      mockPrisma.season.delete.mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest('http://localhost/api/seasons/season1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, {
        params: Promise.resolve(mockParams),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to delete season');
    });
  });
});
