import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClubSelector } from '../ClubSelector';
import { useClub } from '@/context/ClubContext';
import type { ClubType, UserClubWithClub } from '@/types/club';

// Mock the club context
vi.mock('@/context/ClubContext', () => ({
  useClub: vi.fn(),
}));

const mockUseClub = vi.mocked(useClub);

describe('ClubSelector', () => {
  const mockClub1: ClubType = {
    id: 'club1',
    name: 'Springfield Athletics',
    description: 'Test club 1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockClub2: ClubType = {
    id: 'club2',
    name: 'Riverside Track',
    description: 'Test club 2',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserClubs: UserClubWithClub[] = [
    {
      id: 'uc1',
      userId: 'user1',
      clubId: 'club1',
      role: 'ADMIN',
      isActive: true,
      joinedAt: new Date(),
      updatedAt: new Date(),
      club: mockClub1,
    },
    {
      id: 'uc2',
      userId: 'user1',
      clubId: 'club2',
      role: 'MEMBER',
      isActive: true,
      joinedAt: new Date(),
      updatedAt: new Date(),
      club: mockClub2,
    },
  ];

  const mockSelectClub = vi.fn();

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
      selectClub: mockSelectClub,
      refreshUserClubs: vi.fn(),
    });

    render(<ClubSelector />);

    expect(screen.getByText('Loading clubs...')).toBeInTheDocument();
    // Check for the spinner element directly
    const spinnerElement = document.querySelector('.animate-spin');
    expect(spinnerElement).toBeInTheDocument();
  });

  it('should render error state', () => {
    mockUseClub.mockReturnValue({
      selectedClub: null,
      userClubs: [],
      isLoading: false,
      error: 'Failed to load clubs',
      selectClub: mockSelectClub,
      refreshUserClubs: vi.fn(),
    });

    render(<ClubSelector />);

    expect(screen.getByText('Error: Failed to load clubs')).toBeInTheDocument();
  });

  it('should render no clubs available state', () => {
    mockUseClub.mockReturnValue({
      selectedClub: null,
      userClubs: [],
      isLoading: false,
      error: null,
      selectClub: mockSelectClub,
      refreshUserClubs: vi.fn(),
    });

    render(<ClubSelector />);

    expect(screen.getByText('No clubs available')).toBeInTheDocument();
  });

  it('should render single club as indicator without dropdown', () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub1,
      userClubs: [mockUserClubs[0]],
      isLoading: false,
      error: null,
      selectClub: mockSelectClub,
      refreshUserClubs: vi.fn(),
    });

    render(<ClubSelector />);

    expect(screen.getByText('Springfield Athletics')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render dropdown for multiple clubs', () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub1,
      userClubs: mockUserClubs,
      isLoading: false,
      error: null,
      selectClub: mockSelectClub,
      refreshUserClubs: vi.fn(),
    });

    render(<ClubSelector />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Springfield Athletics')).toBeInTheDocument();
  });

  it('should open dropdown when clicked', async () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub1,
      userClubs: mockUserClubs,
      isLoading: false,
      error: null,
      selectClub: mockSelectClub,
      refreshUserClubs: vi.fn(),
    });

    render(<ClubSelector />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Select Club')).toBeInTheDocument();
      expect(screen.getByText('Riverside Track')).toBeInTheDocument();
    });
  });

  it('should call selectClub when a club is selected', async () => {
    mockSelectClub.mockResolvedValue(undefined);

    mockUseClub.mockReturnValue({
      selectedClub: mockClub1,
      userClubs: mockUserClubs,
      isLoading: false,
      error: null,
      selectClub: mockSelectClub,
      refreshUserClubs: vi.fn(),
    });

    render(<ClubSelector />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Riverside Track')).toBeInTheDocument();
    });

    const clubOption = screen.getByText('Riverside Track').closest('button');
    expect(clubOption).toBeInTheDocument();

    fireEvent.click(clubOption!);

    await waitFor(() => {
      expect(mockSelectClub).toHaveBeenCalledWith('club2');
    });
  });

  it('should close dropdown when clicking outside', async () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub1,
      userClubs: mockUserClubs,
      isLoading: false,
      error: null,
      selectClub: mockSelectClub,
      refreshUserClubs: vi.fn(),
    });

    render(<ClubSelector />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Select Club')).toBeInTheDocument();
    });

    // Click outside
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Select Club')).not.toBeInTheDocument();
    });
  });

  it('should show correct selected club indicator', () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub1,
      userClubs: mockUserClubs,
      isLoading: false,
      error: null,
      selectClub: mockSelectClub,
      refreshUserClubs: vi.fn(),
    });

    render(<ClubSelector />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Check that the selected club has the correct visual indicator
    const dropdownButtons = screen.getAllByRole('button');
    const selectedClubOption = dropdownButtons.find(
      button =>
        button.textContent?.includes('Springfield Athletics') &&
        button.textContent?.includes('admin')
    );
    expect(selectedClubOption).toHaveClass('bg-blue-50');
  });

  it('should display club roles correctly', async () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub1,
      userClubs: mockUserClubs,
      isLoading: false,
      error: null,
      selectClub: mockSelectClub,
      refreshUserClubs: vi.fn(),
    });

    render(<ClubSelector />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('member')).toBeInTheDocument();
    });
  });

  it('should handle select club errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSelectClub.mockRejectedValue(new Error('Failed to select club'));

    mockUseClub.mockReturnValue({
      selectedClub: mockClub1,
      userClubs: mockUserClubs,
      isLoading: false,
      error: null,
      selectClub: mockSelectClub,
      refreshUserClubs: vi.fn(),
    });

    render(<ClubSelector />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Riverside Track')).toBeInTheDocument();
    });

    const clubOption = screen.getByText('Riverside Track').closest('button');
    fireEvent.click(clubOption!);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to select club:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
