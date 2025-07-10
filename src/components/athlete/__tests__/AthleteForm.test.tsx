import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AthleteForm from '../AthleteForm';

// Mock ClubContext
const mockUseClub = vi.fn();
vi.mock('@/context/ClubContext', () => ({
  useClub: () => mockUseClub(),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AthleteForm', () => {
  const mockClub = {
    id: 'club-1',
    name: 'Test Club',
  };

  const mockGenders = [
    { id: 'gender-1', name: 'Male', initial: 'M' },
    { id: 'gender-2', name: 'Female', initial: 'F' },
  ];

  beforeEach(() => {
    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
    });

    // Mock successful genders fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockGenders,
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', async () => {
    render(<AthleteForm />);

    // Wait for genders to load
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create athlete/i })
    ).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<AthleteForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    // Try to submit without filling fields
    fireEvent.click(screen.getByRole('button', { name: /create athlete/i }));

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/gender is required/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockOnSuccess = vi.fn();

    // Mock successful athlete creation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 'athlete-1',
          firstName: 'John',
          lastName: 'Doe',
          genderId: 'gender-1',
        },
      }),
    });

    render(<AthleteForm onSuccess={mockOnSuccess} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/gender/i), {
      target: { value: 'gender-1' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create athlete/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/athletes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          genderId: 'gender-1',
          clubId: 'club-1',
        }),
      });
    });

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('handles API errors gracefully', async () => {
    // Mock API error response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        error: 'An athlete with this name already exists in this club',
      }),
    });

    render(<AthleteForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/gender/i), {
      target: { value: 'gender-1' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create athlete/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/an athlete with this name already exists/i)
      ).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    // Mock delayed response
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    mockFetch.mockReturnValueOnce(delayedPromise);

    render(<AthleteForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/gender/i), {
      target: { value: 'gender-1' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create athlete/i }));

    // Check loading state
    expect(screen.getByText(/creating.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /creating.../i })).toBeDisabled();

    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: 'athlete-1', firstName: 'John', lastName: 'Doe' },
      }),
    });

    await waitFor(() => {
      expect(screen.queryByText(/creating.../i)).not.toBeInTheDocument();
    });
  });

  it('handles no club selected state', async () => {
    mockUseClub.mockReturnValue({
      selectedClub: null,
    });

    render(<AthleteForm />);

    // Wait for form to load (it will still show the form but with no club)
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    // Fill the form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/gender/i), {
      target: { value: 'gender-1' },
    });

    // Submit form without club
    fireEvent.click(screen.getByRole('button', { name: /create athlete/i }));

    await waitFor(() => {
      expect(screen.getByText(/no club selected/i)).toBeInTheDocument();
    });
  });
});
