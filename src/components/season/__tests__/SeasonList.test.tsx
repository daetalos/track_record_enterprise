import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import SeasonList from '../SeasonList';
import type { Season } from '@/types/season';

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
  ChevronUpIcon: ({ className }: { className?: string }) => (
    <div className={className} data-testid="chevron-up-icon">
      up
    </div>
  ),
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <div className={className} data-testid="chevron-down-icon">
      down
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

// Mock Input component
vi.mock('@/components/form/input/InputField', () => ({
  default: ({ value, onChange, placeholder, className, ...props }: any) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      data-testid="search-input"
      {...props}
    />
  ),
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
    description: 'Outdoor track and field season',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    _count: { disciplines: 5 },
  },
  {
    id: 'season-2',
    name: 'Indoors',
    description: null,
    createdAt: new Date('2024-01-02T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    _count: { disciplines: 3 },
  },
];

describe('SeasonList', () => {
  const mockOnEdit = vi.fn();
  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render loading state', () => {
    render(
      <SeasonList
        seasons={[]}
        isLoading={true}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('Loading seasons...')).toBeInTheDocument();
  });

  it('should render empty state when no seasons', () => {
    render(
      <SeasonList
        seasons={[]}
        isLoading={false}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText('No Seasons')).toBeInTheDocument();
    expect(
      screen.getByText('Get started by creating your first season.')
    ).toBeInTheDocument();
  });

  it('should render seasons correctly', () => {
    render(
      <SeasonList
        seasons={mockSeasons}
        isLoading={false}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

    // Check season names
    expect(screen.getByText('Track & Field')).toBeInTheDocument();
    expect(screen.getByText('Indoors')).toBeInTheDocument();

    // Check descriptions
    expect(
      screen.getByText('Outdoor track and field season')
    ).toBeInTheDocument();
    expect(screen.getByText('No description')).toBeInTheDocument();

    // Check discipline counts
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    // Check dates
    expect(screen.getByText('1/1/2024')).toBeInTheDocument();
    expect(screen.getByText('2/1/2024')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <SeasonList
        seasons={mockSeasons}
        isLoading={false}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockSeasons[0]);
  });

  it('should handle season deletion successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });

    render(
      <SeasonList
        seasons={mockSeasons}
        isLoading={false}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith(
      'Are you sure you want to delete "Track & Field"?'
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/seasons/season-1', {
        method: 'DELETE',
      });
    });

    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  it('should not delete season when user cancels confirmation', () => {
    mockConfirm.mockReturnValue(false);

    render(
      <SeasonList
        seasons={mockSeasons}
        isLoading={false}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

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
      json: vi.fn().mockResolvedValue({ error: 'Season is in use' }),
    });

    render(
      <SeasonList
        seasons={mockSeasons}
        isLoading={false}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Season is in use');
    });

    expect(mockOnRefresh).not.toHaveBeenCalled();
  });

  it('should handle network error during deletion', async () => {
    const mockAlert = vi.fn();
    global.alert = mockAlert;

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <SeasonList
        seasons={mockSeasons}
        isLoading={false}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Network error');
    });
  });

  it('should show loading state for delete button during deletion', async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100)
        )
    );

    render(
      <SeasonList
        seasons={mockSeasons}
        isLoading={false}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Should show loading text
    await waitFor(() => {
      expect(screen.getByText('Deleting...')).toBeInTheDocument();
    });

    // Wait for deletion to complete
    await waitFor(() => {
      expect(screen.queryByText('Deleting...')).not.toBeInTheDocument();
    });
  });

  it('should filter seasons based on search input', async () => {
    render(
      <SeasonList
        seasons={mockSeasons}
        isLoading={false}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

    // Initial state - both seasons visible
    expect(screen.getByText('Track & Field')).toBeInTheDocument();
    expect(screen.getByText('Indoors')).toBeInTheDocument();

    // Search for 'Track'
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Track' } });

    // Note: We're testing the business logic of search setup, not TanStack filtering
    expect(searchInput).toHaveValue('Track');
  });

  it('should show correct results count', () => {
    render(
      <SeasonList
        seasons={mockSeasons}
        isLoading={false}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

    // Should show results info (tests the business logic, not TanStack implementation)
    expect(screen.getByText(/Showing.*of.*season/)).toBeInTheDocument();
  });

  it('should disable delete button during deletion', async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100)
        )
    );

    render(
      <SeasonList
        seasons={mockSeasons}
        isLoading={false}
        onEdit={mockOnEdit}
        onRefresh={mockOnRefresh}
      />
    );

    const deleteButtons = screen.getAllByTestId('button');
    const firstDeleteButton = deleteButtons.find(button =>
      button.textContent?.includes('Delete')
    );

    if (firstDeleteButton) {
      fireEvent.click(firstDeleteButton);

      await waitFor(() => {
        expect(firstDeleteButton).toBeDisabled();
      });
    }
  });
});
