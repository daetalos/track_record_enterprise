import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClubIndicator } from '../ClubIndicator';
import { useClub } from '@/context/ClubContext';
import type { ClubType } from '@/types/club';

// Mock the club context
vi.mock('@/context/ClubContext', () => ({
  useClub: vi.fn(),
}));

const mockUseClub = vi.mocked(useClub);

describe('ClubIndicator', () => {
  const mockClub: ClubType = {
    id: 'club1',
    name: 'Springfield Athletics',
    description: 'Test club',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseClub.mockReturnValue({
      selectedClub: null,
      userClubs: [],
      isLoading: true,
      error: null,
      selectClub: vi.fn(),
      refreshUserClubs: vi.fn(),
    });

    render(<ClubIndicator />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Check for the pulse element directly
    const pulseElement = document.querySelector('.animate-pulse');
    expect(pulseElement).toBeInTheDocument();
  });

  it('should render error state', () => {
    mockUseClub.mockReturnValue({
      selectedClub: null,
      userClubs: [],
      isLoading: false,
      error: 'Failed to load club',
      selectClub: vi.fn(),
      refreshUserClubs: vi.fn(),
    });

    render(<ClubIndicator />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    const errorIndicator = screen.getByText('Error').parentElement;
    expect(errorIndicator).toHaveClass('text-red-600');
  });

  it('should render no club selected state', () => {
    mockUseClub.mockReturnValue({
      selectedClub: null,
      userClubs: [],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
      refreshUserClubs: vi.fn(),
    });

    render(<ClubIndicator />);

    expect(screen.getByText('No club selected')).toBeInTheDocument();
  });

  it('should render selected club name', () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
      refreshUserClubs: vi.fn(),
    });

    render(<ClubIndicator />);

    expect(screen.getByText('Springfield Athletics')).toBeInTheDocument();

    // Check for the green indicator dot
    const container = screen.getByText('Springfield Athletics').parentElement;
    const indicator = container?.querySelector('.bg-green-500');
    expect(indicator).toBeInTheDocument();
  });

  it('should truncate long club names', () => {
    const longNameClub: ClubType = {
      ...mockClub,
      name: 'This is a very long club name that should be truncated',
    };

    mockUseClub.mockReturnValue({
      selectedClub: longNameClub,
      userClubs: [],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
      refreshUserClubs: vi.fn(),
    });

    render(<ClubIndicator />);

    const clubNameElement = screen.getByText(
      'This is a very long club name that should be truncated'
    );
    expect(clubNameElement).toHaveClass('truncate', 'max-w-32');
  });

  it('should have correct styling classes', () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
      refreshUserClubs: vi.fn(),
    });

    render(<ClubIndicator />);

    const container = screen.getByText('Springfield Athletics').parentElement;
    expect(container).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'text-sm',
      'font-medium',
      'text-gray-900',
      'dark:text-white'
    );
  });
});
