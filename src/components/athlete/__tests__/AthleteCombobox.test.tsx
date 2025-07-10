import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AthleteCombobox from '../AthleteCombobox';
import { useAthleteSearch } from '@/hooks/useAthleteSearch';

// Mock the useAthleteSearch hook
vi.mock('@/hooks/useAthleteSearch');

const mockUseAthleteSearch = vi.mocked(useAthleteSearch);

// Mock athlete data for testing
const mockAthletes = [
  {
    id: 'athlete-1',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    displayName: 'Doe, John',
    gender: { id: 'male', name: 'Male', initial: 'M' },
    ageGroup: { id: 'u10', name: 'U10' },
  },
  {
    id: 'athlete-2',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    displayName: 'Smith, Jane',
    gender: { id: 'female', name: 'Female', initial: 'F' },
    ageGroup: { id: 'u12', name: 'U12' },
  },
];

describe('AthleteCombobox', () => {
  const mockOnChange = vi.fn();
  const mockUpdateQuery = vi.fn();
  const mockUpdateGenderFilter = vi.fn();
  const mockUpdateAgeGroupFilter = vi.fn();

  const defaultSearchHookReturn = {
    athletes: [],
    isLoading: false,
    error: null,
    total: 0,
    searchParams: { query: '', limit: 10 },
    updateQuery: mockUpdateQuery,
    updateGenderFilter: mockUpdateGenderFilter,
    updateAgeGroupFilter: mockUpdateAgeGroupFilter,
    clearFilters: vi.fn(),
    clearResults: vi.fn(),
    searchAthletes: vi.fn(),
  };

  beforeEach(() => {
    mockUseAthleteSearch.mockReturnValue(defaultSearchHookReturn);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with default placeholder', () => {
      render(<AthleteCombobox value={null} onChange={mockOnChange} />);

      expect(
        screen.getByPlaceholderText('Search for an athlete...')
      ).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(
        <AthleteCombobox
          value={null}
          onChange={mockOnChange}
          placeholder="Find athlete..."
        />
      );

      expect(
        screen.getByPlaceholderText('Find athlete...')
      ).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <AthleteCombobox
          value={null}
          onChange={mockOnChange}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <AthleteCombobox value={null} onChange={mockOnChange} disabled={true} />
      );

      const input = screen.getByRole('combobox');
      expect(input).toBeDisabled();
    });
  });

  describe('Search Functionality', () => {
    it('should call updateQuery when user types', () => {
      render(<AthleteCombobox value={null} onChange={mockOnChange} />);

      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'John' } });

      expect(mockUpdateQuery).toHaveBeenCalledWith('John');
    });

    it('should display loading indicator when loading', () => {
      mockUseAthleteSearch.mockReturnValue({
        ...defaultSearchHookReturn,
        isLoading: true,
      });

      render(<AthleteCombobox value={null} onChange={mockOnChange} />);

      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });

    it('should display error message when there is an error', async () => {
      mockUseAthleteSearch.mockReturnValue({
        ...defaultSearchHookReturn,
        error: 'Search failed',
      });

      render(<AthleteCombobox value={null} onChange={mockOnChange} />);

      // Focus the input and type to trigger dropdown opening
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'test' } });

      await waitFor(() => {
        expect(screen.getByText('Error: Search failed')).toBeInTheDocument();
      });
    });

    it('should display no results message when no athletes found', () => {
      mockUseAthleteSearch.mockReturnValue({
        ...defaultSearchHookReturn,
        athletes: [],
        searchParams: { query: 'xyz', limit: 10 },
      });

      render(<AthleteCombobox value={null} onChange={mockOnChange} />);

      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'xyz' } });

      expect(
        screen.getByText(/No athletes found matching/)
      ).toBeInTheDocument();
    });
  });

  describe('Athletes Display', () => {
    beforeEach(() => {
      mockUseAthleteSearch.mockReturnValue({
        ...defaultSearchHookReturn,
        athletes: mockAthletes,
      });
    });

    it('should display athlete options when available', async () => {
      render(<AthleteCombobox value={null} onChange={mockOnChange} />);

      // Focus the input and type to trigger dropdown opening
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'test' } });

      await waitFor(() => {
        expect(screen.getByText('Doe, John')).toBeInTheDocument();
        expect(screen.getByText('Smith, Jane')).toBeInTheDocument();
      });
    });

    it('should display gender and age group information', async () => {
      render(<AthleteCombobox value={null} onChange={mockOnChange} />);

      // Focus the input and type to trigger dropdown opening
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'test' } });

      await waitFor(() => {
        expect(screen.getByText('M · U10')).toBeInTheDocument();
        expect(screen.getByText('F · U12')).toBeInTheDocument();
      });
    });

    it('should call onChange when athlete is selected', async () => {
      render(<AthleteCombobox value={null} onChange={mockOnChange} />);

      // Focus the input and type to trigger dropdown opening
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'test' } });

      await waitFor(() => {
        expect(screen.getByText('Doe, John')).toBeInTheDocument();
      });

      // Use mouseDown and mouseUp events which work better with HeadlessUI
      const option = screen.getByText('Doe, John');
      fireEvent.mouseDown(option);
      fireEvent.mouseUp(option);
      fireEvent.click(option);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(mockAthletes[0]);
      });
    });
  });

  describe('Value Handling', () => {
    it('should display selected athlete name in input', () => {
      render(
        <AthleteCombobox value={mockAthletes[0]} onChange={mockOnChange} />
      );

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('Doe, John');
    });

    it('should show clear button when athlete is selected', () => {
      render(
        <AthleteCombobox value={mockAthletes[0]} onChange={mockOnChange} />
      );

      expect(
        screen.getByRole('button', { name: /clear/i })
      ).toBeInTheDocument();
    });

    it('should clear selection when clear button is clicked', () => {
      render(
        <AthleteCombobox value={mockAthletes[0]} onChange={mockOnChange} />
      );

      const clearButton = screen.getByRole('button', { name: /clear/i });
      fireEvent.click(clearButton);

      expect(mockOnChange).toHaveBeenCalledWith(null);
      expect(mockUpdateQuery).toHaveBeenCalledWith('');
    });

    it('should not show clear button when disabled', () => {
      render(
        <AthleteCombobox
          value={mockAthletes[0]}
          onChange={mockOnChange}
          disabled={true}
        />
      );

      expect(
        screen.queryByRole('button', { name: /clear/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Filter Integration', () => {
    it('should call updateGenderFilter when genderId prop changes', () => {
      const { rerender } = render(
        <AthleteCombobox value={null} onChange={mockOnChange} />
      );

      rerender(
        <AthleteCombobox value={null} onChange={mockOnChange} genderId="male" />
      );

      expect(mockUpdateGenderFilter).toHaveBeenCalledWith('male');
    });

    it('should call updateAgeGroupFilter when ageGroupId prop changes', () => {
      const { rerender } = render(
        <AthleteCombobox value={null} onChange={mockOnChange} />
      );

      rerender(
        <AthleteCombobox
          value={null}
          onChange={mockOnChange}
          ageGroupId="u10"
        />
      );

      expect(mockUpdateAgeGroupFilter).toHaveBeenCalledWith('u10');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(<AthleteCombobox value={null} onChange={mockOnChange} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      mockUseAthleteSearch.mockReturnValue({
        ...defaultSearchHookReturn,
        athletes: mockAthletes,
      });

      render(<AthleteCombobox value={null} onChange={mockOnChange} />);

      const input = screen.getByRole('combobox');

      // Should be able to focus the input
      input.focus();
      expect(input).toHaveFocus();

      // Arrow down should open the listbox (if athletes are shown)
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      // The options should be available
      expect(screen.getByText('Doe, John')).toBeInTheDocument();
    });
  });

  describe('Hook Configuration', () => {
    it('should initialize useAthleteSearch hook with correct config', () => {
      render(<AthleteCombobox value={null} onChange={mockOnChange} />);

      expect(mockUseAthleteSearch).toHaveBeenCalledWith({
        debounceMs: 300,
        minQueryLength: 2,
        defaultLimit: 10,
      });
    });
  });
});
