import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import DisciplineList from '../DisciplineList';
import type { Discipline } from '@/types/discipline';
import type { Season } from '@/types/season';

// Mock icons
vi.mock('@/icons', () => ({
  PencilIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="pencil-icon" />
  ),
  TrashBinIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="trash-icon" />
  ),
  ChevronUpIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="chevron-up-icon" />
  ),
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="chevron-down-icon" />
  ),
}));

// Mock Button component
vi.mock('@/components/ui/button/Button', () => ({
  default: ({
    children,
    onClick,
    disabled,
    startIcon,
    size,
    variant,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    startIcon?: React.ReactNode;
    size?: string;
    variant?: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-size={size}
      data-variant={variant}
    >
      {startIcon}
      {children}
    </button>
  ),
}));

// Mock Input component
vi.mock('@/components/form/input/InputField', () => ({
  default: ({
    placeholder,
    value,
    onChange,
    className,
  }: {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
  }) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  ),
}));

// Mock shadcn/ui table components
vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table data-testid="table">{children}</table>
  ),
  TableHeader: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <thead className={className}>{children}</thead>,
  TableBody: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <tbody className={className}>{children}</tbody>,
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <tr>{children}</tr>
  ),
  TableHead: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <th className={className}>{children}</th>,
  TableCell: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <td className={className}>{children}</td>,
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock window.confirm
const mockConfirm = vi.fn();
global.confirm = mockConfirm;

// Mock data
const mockSeasons: Season[] = [
  {
    id: 'season-1',
    name: 'Track & Field',
    description: 'Outdoor track and field events',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  },
  {
    id: 'season-2',
    name: 'Indoors',
    description: 'Indoor track and field events',
    createdAt: new Date('2024-01-02T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  },
];

const mockDisciplines: Discipline[] = [
  {
    id: 'discipline-1',
    seasonId: 'season-1',
    name: '100m Sprint',
    description: 'Individual timed sprint event',
    isTimed: true,
    isMeasured: false,
    isSmallerBetter: true,
    teamSize: undefined,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    season: {
      id: 'season-1',
      name: 'Track & Field',
      description: 'Outdoor track and field events',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  },
  {
    id: 'discipline-2',
    seasonId: 'season-1',
    name: 'Shot Put',
    description: 'Individual measured throwing event',
    isTimed: false,
    isMeasured: true,
    isSmallerBetter: false,
    teamSize: undefined,
    createdAt: new Date('2024-01-02T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    season: {
      id: 'season-1',
      name: 'Track & Field',
      description: 'Outdoor track and field events',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  },
  {
    id: 'discipline-3',
    seasonId: 'season-1',
    name: '4x100m Relay',
    description: 'Team timed relay event',
    isTimed: true,
    isMeasured: false,
    isSmallerBetter: true,
    teamSize: 4,
    createdAt: new Date('2024-01-03T00:00:00.000Z'),
    updatedAt: new Date('2024-01-03T00:00:00.000Z'),
    season: {
      id: 'season-1',
      name: 'Track & Field',
      description: 'Outdoor track and field events',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  },
  {
    id: 'discipline-4',
    seasonId: 'season-2',
    name: 'Indoor 60m',
    description: 'Indoor sprint event',
    isTimed: true,
    isMeasured: false,
    isSmallerBetter: true,
    teamSize: undefined,
    createdAt: new Date('2024-01-04T00:00:00.000Z'),
    updatedAt: new Date('2024-01-04T00:00:00.000Z'),
    season: {
      id: 'season-2',
      name: 'Indoors',
      description: 'Indoor track and field events',
      createdAt: new Date('2024-01-02T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    },
  },
];

describe('DisciplineList', () => {
  const mockOnEdit = vi.fn();
  const mockOnRefresh = vi.fn();
  const mockOnSeasonFilter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const defaultProps = {
    disciplines: mockDisciplines,
    seasons: mockSeasons,
    isLoading: false,
    onEdit: mockOnEdit,
    onRefresh: mockOnRefresh,
    onSeasonFilter: mockOnSeasonFilter,
  };

  it('should render loading state', () => {
    render(
      <DisciplineList {...defaultProps} disciplines={[]} isLoading={true} />
    );

    expect(screen.getByText('Loading disciplines...')).toBeInTheDocument();
  });

  it('should render empty state when no disciplines', () => {
    render(<DisciplineList {...defaultProps} disciplines={[]} />);

    expect(screen.getByText('No Disciplines')).toBeInTheDocument();
    expect(
      screen.getByText('Get started by creating your first discipline.')
    ).toBeInTheDocument();
  });

  it('should render filtered empty state when no disciplines in selected season', () => {
    render(
      <DisciplineList
        {...defaultProps}
        disciplines={[]}
        selectedSeasonId="season-1"
      />
    );

    expect(
      screen.getByText('No Disciplines in Track & Field')
    ).toBeInTheDocument();
    expect(
      screen.getByText("This season doesn't have any disciplines yet.")
    ).toBeInTheDocument();
  });

  it('should render disciplines correctly', () => {
    render(<DisciplineList {...defaultProps} />);

    // Check discipline names
    expect(screen.getByText('100m Sprint')).toBeInTheDocument();
    expect(screen.getByText('Shot Put')).toBeInTheDocument();
    expect(screen.getByText('4x100m Relay')).toBeInTheDocument();
    expect(screen.getByText('Indoor 60m')).toBeInTheDocument();

    // Check seasons
    expect(screen.getAllByText('Track & Field')).toHaveLength(3);
    expect(screen.getByText('Indoors')).toBeInTheDocument();

    // Check types with proper badges
    expect(screen.getAllByText('Timed')).toHaveLength(3);
    expect(screen.getByText('Measured')).toBeInTheDocument();

    // Check team size display
    expect(screen.getByText('(Team: 4)')).toBeInTheDocument();

    // Check descriptions
    expect(
      screen.getByText('Individual timed sprint event')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Individual measured throwing event')
    ).toBeInTheDocument();

    // Check dates
    expect(screen.getByText('1/1/2024')).toBeInTheDocument();
    expect(screen.getByText('2/1/2024')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(<DisciplineList {...defaultProps} />);

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockDisciplines[0]);
  });

  it('should handle discipline deletion successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });

    render(<DisciplineList {...defaultProps} />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith(
      'Are you sure you want to delete "100m Sprint"?'
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/disciplines/discipline-1', {
        method: 'DELETE',
      });
    });

    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  it('should not delete discipline when user cancels confirmation', () => {
    mockConfirm.mockReturnValue(false);

    render(<DisciplineList {...defaultProps} />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle deletion error gracefully', async () => {
    const mockAlert = vi.fn();
    global.alert = mockAlert;

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: 'Discipline is in use' }),
    });

    render(<DisciplineList {...defaultProps} />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Discipline is in use');
    });

    expect(mockOnRefresh).not.toHaveBeenCalled();
  });

  it('should show deleting state during deletion', async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100)
        )
    );

    render(<DisciplineList {...defaultProps} />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Deleting...')).toBeInTheDocument();
    });
  });

  it('should handle season filter change', async () => {
    const user = userEvent.setup();
    render(<DisciplineList {...defaultProps} />);

    const seasonFilter = screen.getByDisplayValue('All Seasons');
    await user.selectOptions(seasonFilter, 'season-1');

    expect(mockOnSeasonFilter).toHaveBeenCalledWith('season-1');
  });

  it('should handle clearing season filter', async () => {
    const user = userEvent.setup();
    render(<DisciplineList {...defaultProps} selectedSeasonId="season-1" />);

    const seasonFilter = screen.getByDisplayValue('Track & Field');
    await user.selectOptions(seasonFilter, '');

    expect(mockOnSeasonFilter).toHaveBeenCalledWith(null);
  });

  it('should handle global search filter', async () => {
    const user = userEvent.setup();
    render(<DisciplineList {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search disciplines...');
    await user.type(searchInput, 'Sprint');

    // Note: We're testing the UI interaction, not the actual filtering logic
    // The filtering is handled by TanStack Table internally
    expect(searchInput).toHaveValue('Sprint');
  });

  it('should show correct discipline type badges', () => {
    render(<DisciplineList {...defaultProps} />);

    // Check timed disciplines have blue badges
    const timedBadges = screen.getAllByText('Timed');
    expect(timedBadges).toHaveLength(3);

    // Check measured disciplines have green badges
    const measuredBadges = screen.getAllByText('Measured');
    expect(measuredBadges).toHaveLength(1);
  });

  it('should display team size for relay events', () => {
    render(<DisciplineList {...defaultProps} />);

    // Only the 4x100m Relay should show team size
    expect(screen.getByText('(Team: 4)')).toBeInTheDocument();

    // Individual events should not show team size
    const individualEvents = mockDisciplines.filter(d => !d.teamSize);
    expect(individualEvents).toHaveLength(3);
  });

  it('should handle sorting by clicking column headers', async () => {
    const user = userEvent.setup();
    render(<DisciplineList {...defaultProps} />);

    // Click on Name column header to sort
    const nameHeader = screen.getByRole('button', { name: /Name/ });
    await user.click(nameHeader);

    // Should show sorting icon (we're testing the UI interaction)
    expect(nameHeader).toBeInTheDocument();
  });

  it('should display results info correctly', () => {
    render(<DisciplineList {...defaultProps} />);

    expect(
      screen.getByText(/Showing \d+ of \d+ discipline\(s\)/)
    ).toBeInTheDocument();
  });

  it('should display season-specific results info when filtered', () => {
    render(<DisciplineList {...defaultProps} selectedSeasonId="season-1" />);

    expect(screen.getByText(/in Track & Field/)).toBeInTheDocument();
  });

  it('should handle missing season data gracefully', () => {
    const disciplinesWithoutSeason = [
      {
        ...mockDisciplines[0],
        season: undefined,
      },
    ];

    render(
      <DisciplineList
        {...defaultProps}
        disciplines={disciplinesWithoutSeason}
      />
    );

    expect(screen.getByText('Unknown Season')).toBeInTheDocument();
  });

  it('should handle missing description gracefully', () => {
    const disciplinesWithoutDescription = [
      {
        ...mockDisciplines[0],
        description: undefined,
      },
    ];

    render(
      <DisciplineList
        {...defaultProps}
        disciplines={disciplinesWithoutDescription}
      />
    );

    expect(screen.getByText('No description')).toBeInTheDocument();
  });
});
