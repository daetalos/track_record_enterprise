import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AthleteSearch } from '../AthleteSearch';

describe('AthleteSearch', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input with correct placeholder', () => {
    render(
      <AthleteSearch onSearch={mockOnSearch} placeholder="Search athletes..." />
    );

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search athletes...');
  });

  it('uses default placeholder when none provided', () => {
    render(<AthleteSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toHaveAttribute(
      'placeholder',
      'Search athletes by name...'
    );
  });

  it('displays initial value when provided', () => {
    render(<AthleteSearch onSearch={mockOnSearch} initialValue="John" />);

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toHaveValue('John');
  });

  it('calls onSearch when user types', async () => {
    const user = userEvent.setup();
    render(<AthleteSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'John');

    expect(mockOnSearch).toHaveBeenCalledWith('J');
    expect(mockOnSearch).toHaveBeenCalledWith('Jo');
    expect(mockOnSearch).toHaveBeenCalledWith('Joh');
    expect(mockOnSearch).toHaveBeenCalledWith('John');
    expect(mockOnSearch).toHaveBeenCalledTimes(4);
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<AthleteSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'John');

    expect(searchInput).toHaveValue('John');
  });

  it('shows clear button when input has value', async () => {
    const user = userEvent.setup();
    render(<AthleteSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'John');

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('hides clear button when input is empty', () => {
    render(<AthleteSearch onSearch={mockOnSearch} />);

    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('clears input and calls onSearch with empty string when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<AthleteSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'John');

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(mockOnSearch).toHaveBeenLastCalledWith('');
  });

  it('handles progressive search typing correctly', async () => {
    const user = userEvent.setup();
    render(<AthleteSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByRole('searchbox');

    await user.type(searchInput, 'John');

    expect(mockOnSearch).toHaveBeenNthCalledWith(1, 'J');
    expect(mockOnSearch).toHaveBeenNthCalledWith(2, 'Jo');
    expect(mockOnSearch).toHaveBeenNthCalledWith(3, 'Joh');
    expect(mockOnSearch).toHaveBeenNthCalledWith(4, 'John');
    expect(mockOnSearch).toHaveBeenCalledTimes(4);
  });

  it('handles clearing search via backspace', async () => {
    const user = userEvent.setup();
    render(<AthleteSearch onSearch={mockOnSearch} initialValue="Test" />);

    const searchInput = screen.getByRole('searchbox');

    // Clear the input by selecting all and deleting
    await user.clear(searchInput);

    expect(searchInput).toHaveValue('');
    expect(mockOnSearch).toHaveBeenLastCalledWith('');
  });

  it('maintains search functionality with whitespace', async () => {
    const user = userEvent.setup();
    render(<AthleteSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, '  John  ');

    expect(mockOnSearch).toHaveBeenLastCalledWith('  John  ');
    expect(searchInput).toHaveValue('  John  ');
  });

  it('displays search icon', () => {
    render(<AthleteSearch onSearch={mockOnSearch} />);

    // Check for the search icon by looking for the SVG
    const searchIcon = screen
      .getByRole('searchbox')
      .parentElement?.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });
});
