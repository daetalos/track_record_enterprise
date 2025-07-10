import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, Mock, beforeEach, describe, it, expect } from 'vitest';
import { AthleteProfile } from '../AthleteProfile';
import { AthleteWithRelations } from '@/types/athlete';
import useGoBack from '@/hooks/useGoBack';

// Mock the useGoBack hook
vi.mock('@/hooks/useGoBack', () => ({
  default: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn();

const mockAthlete: AthleteWithRelations = {
  id: 'athlete-1',
  clubId: 'club-1',
  genderId: 'gender-1',
  firstName: 'John',
  lastName: 'Doe',
  ageGroupId: 'age-group-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  club: {
    id: 'club-1',
    name: 'Test Athletic Club',
  },
  gender: {
    id: 'gender-1',
    name: 'Male',
    initial: 'M',
  },
  ageGroup: {
    id: 'age-group-1',
    clubId: 'club-1',
    name: 'U18',
    ordinal: 18,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
};

const mockAthleteWithoutAgeGroup: AthleteWithRelations = {
  ...mockAthlete,
  ageGroupId: null,
  ageGroup: null,
};

describe('AthleteProfile', () => {
  const mockGoBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as Mock).mockClear();
    vi.mocked(useGoBack).mockReturnValue(mockGoBack);
  });

  it('displays loading state initially', () => {
    (global.fetch as Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<AthleteProfile athleteId="athlete-1" />);

    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('displays error state when fetch fails', async () => {
    (global.fetch as Mock).mockRejectedValue(new Error('Network error'));

    render(<AthleteProfile athleteId="athlete-1" />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(screen.getByText('Go Back')).toBeInTheDocument();
    });
  });

  it('displays error state when API returns error', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Athlete not found' }),
    });

    render(<AthleteProfile athleteId="athlete-1" />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch athlete')).toBeInTheDocument();
    });
  });

  it('displays not found state when API returns success: false', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, error: 'Athlete not found' }),
    });

    render(<AthleteProfile athleteId="athlete-1" />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Athlete not found')).toBeInTheDocument();
    });
  });

  it('displays athlete information when fetch succeeds', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockAthlete }),
    });

    render(<AthleteProfile athleteId="athlete-1" />);

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByText('U18')).toBeInTheDocument();
      expect(screen.getByText('Test Athletic Club')).toBeInTheDocument();
      expect(screen.getByText('1/1/2024')).toBeInTheDocument();
    });

    expect(screen.getByText('Athlete Information')).toBeInTheDocument();
    expect(screen.getByText('Performance History')).toBeInTheDocument();
    expect(
      screen.getByText('Performance tracking coming soon')
    ).toBeInTheDocument();
  });

  it('displays "Not assigned" when athlete has no age group', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockAthleteWithoutAgeGroup }),
    });

    render(<AthleteProfile athleteId="athlete-1" />);

    await waitFor(() => {
      expect(screen.getByText('Not assigned')).toBeInTheDocument();
    });
  });

  it('makes API call with correct athlete ID', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockAthlete }),
    });

    render(<AthleteProfile athleteId="test-athlete-id" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/athletes/test-athlete-id'
      );
    });
  });

  it('calls goBack when back button is clicked', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockAthlete }),
    });

    render(<AthleteProfile athleteId="athlete-1" />);

    await waitFor(() => {
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    const backButton = screen.getByText('Back');
    backButton.click();

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('calls goBack when error go back button is clicked', async () => {
    (global.fetch as Mock).mockRejectedValue(new Error('Network error'));

    render(<AthleteProfile athleteId="athlete-1" />);

    await waitFor(() => {
      expect(screen.getByText('Go Back')).toBeInTheDocument();
    });

    const goBackButton = screen.getByText('Go Back');
    goBackButton.click();

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('displays correct field labels', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockAthlete }),
    });

    render(<AthleteProfile athleteId="athlete-1" />);

    await waitFor(() => {
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByText('Age Group')).toBeInTheDocument();
      expect(screen.getByText('Club')).toBeInTheDocument();
      expect(screen.getByText('Created')).toBeInTheDocument();
    });
  });

  it('handles missing athleteId gracefully', () => {
    render(<AthleteProfile athleteId="" />);

    // Should not make API call with empty ID
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('renders performance placeholder section', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockAthlete }),
    });

    render(<AthleteProfile athleteId="athlete-1" />);

    await waitFor(() => {
      expect(screen.getByText('Performance History')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Future releases will include performance records, personal bests, and competition results.'
        )
      ).toBeInTheDocument();
    });
  });

  it('applies correct CSS classes for card styling', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockAthlete }),
    });

    const { container } = render(<AthleteProfile athleteId="athlete-1" />);

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    // Check for card styling classes
    const cards = container.querySelectorAll(
      '.rounded-2xl.border.border-gray-200'
    );
    expect(cards.length).toBeGreaterThan(0);
  });
});
