import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AthleteList } from '../AthleteList';

// Mock ClubContext
const mockUseClub = vi.fn();
vi.mock('@/context/ClubContext', () => ({
  useClub: () => mockUseClub(),
}));

// Mock icons to prevent SVG data URI errors
vi.mock('@/icons', () => ({
  PencilIcon: ({ className }: { className?: string }) => (
    <div className={className} data-testid="pencil-icon">
      edit
    </div>
  ),
  TrashBinIcon: ({ className }: { className?: string }) => (
    <div className={className} data-testid="trash-icon">
      delete
    </div>
  ),
}));

// Mock Button component to avoid complex dependencies
vi.mock('@/components/ui/button/Button', () => ({
  default: ({
    children,
    onClick,
    disabled,
    startIcon,
    className,
    ...props
  }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid="button"
      {...props}
    >
      {startIcon}
      {children}
    </button>
  ),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock data
const mockClub = {
  id: 'club-1',
  name: 'Test Club',
};

const mockAthletes = [
  {
    id: 'athlete-1',
    firstName: 'John',
    lastName: 'Doe',
    gender: { id: 'gender-1', name: 'Male', initial: 'M' },
    ageGroup: { id: 'age-1', name: 'U18' },
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'athlete-2',
    firstName: 'Jane',
    lastName: 'Smith',
    gender: { id: 'gender-2', name: 'Female', initial: 'F' },
    ageGroup: null,
    createdAt: '2024-01-02T00:00:00.000Z',
  },
];

const mockApiResponse = {
  success: true,
  data: mockAthletes,
  pagination: {
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

describe('AthleteList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockApiResponse),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render loading state initially', () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [mockClub],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
    });

    render(<AthleteList />);
    expect(screen.getByText('Loading athletes...')).toBeInTheDocument();
  });

  it('should render no club selected message when no club is selected', () => {
    mockUseClub.mockReturnValue({
      selectedClub: null,
      userClubs: [],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
    });

    render(<AthleteList />);
    expect(
      screen.getByText('Please select a club to view athletes.')
    ).toBeInTheDocument();
  });

  it('should fetch and display athletes when club is selected', async () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [mockClub],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
    });

    await act(async () => {
      render(<AthleteList />);
    });

    // Wait for the fetch to complete and athletes to be displayed
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    // Check gender displays
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();

    // Check age group displays
    expect(screen.getByText('U18')).toBeInTheDocument();
    expect(screen.getByText('Not assigned')).toBeInTheDocument();
  });

  it('should make correct API call with club ID', async () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [mockClub],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
    });

    render(<AthleteList />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/athletes?clubId=club-1&page=1&limit=10'
      );
    });
  });

  it('should handle search functionality', async () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [mockClub],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
    });

    await act(async () => {
      render(<AthleteList />);
    });

    // Wait for initial load
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Clear the mock to track new calls
    mockFetch.mockClear();

    // Perform search
    const searchInput = screen.getByLabelText('Search athletes');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'John' } });
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/athletes?clubId=club-1&page=1&limit=10&search=John'
      );
    });
  });

  it('should handle pagination', async () => {
    const paginatedResponse = {
      success: true,
      data: mockAthletes,
      pagination: {
        total: 20,
        page: 1,
        limit: 10,
        totalPages: 2,
      },
    };

    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue(paginatedResponse),
    });

    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [mockClub],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
    });

    await act(async () => {
      render(<AthleteList />);
    });

    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Check pagination elements exist (mobile pagination is always visible)
    await waitFor(() => {
      const nextButtons = screen.getAllByText('Next');
      expect(nextButtons.length).toBeGreaterThan(0);

      const prevButtons = screen.getAllByText('Previous');
      expect(prevButtons.length).toBeGreaterThan(0);

      // Check page number buttons exist (desktop pagination) - there are multiple "1"s, so use getAllByText
      const pageOneButtons = screen.getAllByText('1');
      expect(pageOneButtons.length).toBeGreaterThan(0);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    // Test next button functionality - use the first Next button found
    const nextButtons = screen.getAllByText('Next');
    const nextButton = nextButtons[0];
    expect(nextButton).not.toBeDisabled();

    // Clear mock and click next
    mockFetch.mockClear();
    await act(async () => {
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/athletes?clubId=club-1&page=2&limit=10'
      );
    });
  });

  it('should handle API errors gracefully', async () => {
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ success: false }),
    });

    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [mockClub],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
    });

    await act(async () => {
      render(<AthleteList />);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch athletes')).toBeInTheDocument();
    });
  });

  it('should handle network errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [mockClub],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
    });

    await act(async () => {
      render(<AthleteList />);
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch athletes')).toBeInTheDocument();
    });
  });

  it('should display empty state when no athletes found', async () => {
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      }),
    });

    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [mockClub],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
    });

    await act(async () => {
      render(<AthleteList />);
    });

    await waitFor(() => {
      expect(
        screen.getByText('No athletes found. Add some athletes to get started.')
      ).toBeInTheDocument();
    });
  });

  it('should display search-specific empty message when searching returns no results', async () => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [mockClub],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
    });

    // First load with athletes
    await act(async () => {
      render(<AthleteList />);
    });

    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Mock empty search result
    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      }),
    });

    // Perform search
    const searchInput = screen.getByLabelText('Search athletes');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'NonExistent' } });
    });

    await waitFor(() => {
      expect(
        screen.getByText('No athletes found matching "NonExistent"')
      ).toBeInTheDocument();
    });
  });

  it('should reset to page 1 when performing search', async () => {
    const paginatedResponse = {
      success: true,
      data: mockAthletes,
      pagination: {
        total: 20,
        page: 2,
        limit: 10,
        totalPages: 2,
      },
    };

    mockFetch.mockResolvedValue({
      json: vi.fn().mockResolvedValue(paginatedResponse),
    });

    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
      userClubs: [mockClub],
      isLoading: false,
      error: null,
      selectClub: vi.fn(),
    });

    await act(async () => {
      render(<AthleteList />);
    });

    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Clear mock and perform search
    mockFetch.mockClear();
    const searchInput = screen.getByLabelText('Search athletes');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'John' } });
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/athletes?clubId=club-1&page=1&limit=10&search=John'
      );
    });
  });
});
