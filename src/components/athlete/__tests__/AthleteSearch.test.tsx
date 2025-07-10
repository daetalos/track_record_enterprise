import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AthleteSearch } from '../AthleteSearch';

describe('AthleteSearch', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search input with correct placeholder', () => {
    render(
      <AthleteSearch
        onSearch={mockOnSearch}
        searchTerm=""
        placeholder="Search athletes..."
      />
    );

    const searchInput = screen.getByLabelText('Search athletes');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search athletes...');
  });

  it('should use default placeholder when none provided', () => {
    render(<AthleteSearch onSearch={mockOnSearch} searchTerm="" />);

    const searchInput = screen.getByLabelText('Search athletes');
    expect(searchInput).toHaveAttribute(
      'placeholder',
      'Search athletes by name...'
    );
  });

  it('should display initial search term value', () => {
    render(<AthleteSearch onSearch={mockOnSearch} searchTerm="John" />);

    const searchInput = screen.getByLabelText('Search athletes');
    expect(searchInput).toHaveValue('John');
  });

  it('should call onSearch when input value changes', () => {
    render(<AthleteSearch onSearch={mockOnSearch} searchTerm="" />);

    const searchInput = screen.getByLabelText('Search athletes');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(mockOnSearch).toHaveBeenCalledWith('John');
  });

  it('should update input value on change', () => {
    render(<AthleteSearch onSearch={mockOnSearch} searchTerm="" />);

    const searchInput = screen.getByLabelText('Search athletes');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(searchInput).toHaveValue('John');
  });

  it('should show clear button when input has value', () => {
    render(<AthleteSearch onSearch={mockOnSearch} searchTerm="John" />);

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when input is empty', () => {
    render(<AthleteSearch onSearch={mockOnSearch} searchTerm="" />);

    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should clear input and call onSearch with empty string when clear button is clicked', () => {
    render(<AthleteSearch onSearch={mockOnSearch} searchTerm="John" />);

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);

    const searchInput = screen.getByLabelText('Search athletes');
    expect(searchInput).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('should handle multiple search term changes', () => {
    render(<AthleteSearch onSearch={mockOnSearch} searchTerm="" />);

    const searchInput = screen.getByLabelText('Search athletes');

    fireEvent.change(searchInput, { target: { value: 'J' } });
    expect(mockOnSearch).toHaveBeenCalledWith('J');

    fireEvent.change(searchInput, { target: { value: 'Jo' } });
    expect(mockOnSearch).toHaveBeenCalledWith('Jo');

    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(mockOnSearch).toHaveBeenCalledWith('John');

    expect(mockOnSearch).toHaveBeenCalledTimes(3);
  });

  it('should handle empty string search', () => {
    render(<AthleteSearch onSearch={mockOnSearch} searchTerm="John" />);

    const searchInput = screen.getByLabelText('Search athletes');
    fireEvent.change(searchInput, { target: { value: '' } });

    expect(mockOnSearch).toHaveBeenCalledWith('');
    expect(searchInput).toHaveValue('');
  });

  it('should show search icon', () => {
    render(<AthleteSearch onSearch={mockOnSearch} searchTerm="" />);

    // Check for the search icon SVG
    const searchIcon = screen
      .getByLabelText('Search athletes')
      .closest('div')
      ?.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should handle whitespace in search terms', () => {
    render(<AthleteSearch onSearch={mockOnSearch} searchTerm="" />);

    const searchInput = screen.getByLabelText('Search athletes');
    fireEvent.change(searchInput, { target: { value: '  John  ' } });

    expect(mockOnSearch).toHaveBeenCalledWith('  John  ');
    expect(searchInput).toHaveValue('  John  ');
  });
});
