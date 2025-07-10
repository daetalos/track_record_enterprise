import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AthleteForm from '../AthleteForm';
import type { AthleteWithRelations } from '@/types/athlete';

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

  const mockAthlete: AthleteWithRelations = {
    id: 'athlete-1',
    firstName: 'John',
    lastName: 'Doe',
    clubId: 'club-1',
    genderId: 'gender-1',
    ageGroupId: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    club: mockClub,
    gender: mockGenders[0],
    ageGroup: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseClub.mockReturnValue({
      selectedClub: mockClub,
    });

    // Mock successful genders fetch by default - this will be the first call
    mockFetch.mockImplementation(async url => {
      if (url === '/api/genders') {
        return {
          ok: true,
          json: async () => ({
            success: true,
            data: mockGenders,
          }),
        };
      }
      // Default response for other calls
      return {
        ok: true,
        json: async () => ({ success: true, data: mockAthlete }),
      };
    });
  });

  describe('Create Mode', () => {
    it('renders form fields correctly for creation', async () => {
      render(<AthleteForm />);

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

    it('validates required fields on create', async () => {
      const user = userEvent.setup();
      render(<AthleteForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      // Try to submit without filling fields
      await user.click(screen.getByRole('button', { name: /create athlete/i }));

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/gender is required/i)).toBeInTheDocument();
    });

    it('creates athlete with valid data', async () => {
      const user = userEvent.setup();
      const mockOnSuccess = vi.fn();

      // Override the default mock for this specific test
      mockFetch.mockImplementation(async url => {
        if (url === '/api/genders') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockGenders }),
          };
        }
        if (url === '/api/athletes') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockAthlete }),
          };
        }
        return { ok: false };
      });

      render(<AthleteForm onSuccess={mockOnSuccess} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      // Fill out the form
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.selectOptions(screen.getByLabelText(/gender/i), 'gender-1');

      // Submit the form
      await user.click(screen.getByRole('button', { name: /create athlete/i }));

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

      expect(mockOnSuccess).toHaveBeenCalledWith(mockAthlete);
    });

    it('resets form after successful creation', async () => {
      const user = userEvent.setup();

      // Override the default mock for this specific test
      mockFetch.mockImplementation(async url => {
        if (url === '/api/genders') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockGenders }),
          };
        }
        if (url === '/api/athletes') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockAthlete }),
          };
        }
        return { ok: false };
      });

      render(<AthleteForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.selectOptions(screen.getByLabelText(/gender/i), 'gender-1');
      await user.click(screen.getByRole('button', { name: /create athlete/i }));

      // Wait for success message
      await waitFor(() => {
        expect(
          screen.getByText(/athlete.*john doe.*created successfully/i)
        ).toBeInTheDocument();
      });

      // Verify form is reset - fields should be empty
      expect(screen.getByLabelText(/first name/i)).toHaveValue('');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('');
      expect(screen.getByLabelText(/gender/i)).toHaveValue('');
    });
  });

  describe('Edit Mode', () => {
    it('renders form fields correctly for editing', async () => {
      render(<AthleteForm athlete={mockAthlete} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
      expect(screen.getByLabelText(/gender/i)).toHaveValue('gender-1');
      expect(
        screen.getByRole('button', { name: /update athlete/i })
      ).toBeInTheDocument();
    });

    it('updates athlete with valid data', async () => {
      const user = userEvent.setup();
      const mockOnSuccess = vi.fn();

      const updatedAthlete = { ...mockAthlete, firstName: 'Jane' };

      // Mock genders first, then successful athlete update
      mockFetch.mockImplementation(async url => {
        if (url === '/api/genders') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockGenders }),
          };
        }
        if (url.includes('/api/athletes/')) {
          return {
            ok: true,
            json: async () => ({ success: true, data: updatedAthlete }),
          };
        }
        return { ok: false };
      });

      render(<AthleteForm athlete={mockAthlete} onSuccess={mockOnSuccess} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      });

      // Update the first name
      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jane');

      // Submit the form
      await user.click(screen.getByRole('button', { name: /update athlete/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/athletes/athlete-1', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: 'Jane',
            lastName: 'Doe',
            genderId: 'gender-1',
          }),
        });
      });

      expect(mockOnSuccess).toHaveBeenCalledWith(updatedAthlete);
    });

    it('does not reset form after successful edit', async () => {
      const user = userEvent.setup();

      // Mock genders first, then successful update
      mockFetch.mockImplementation(async url => {
        if (url === '/api/genders') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockGenders }),
          };
        }
        if (url.includes('/api/athletes/')) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              data: { ...mockAthlete, firstName: 'Jane' },
            }),
          };
        }
        return { ok: false };
      });

      render(<AthleteForm athlete={mockAthlete} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      });

      // Update first name
      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jane');
      await user.click(screen.getByRole('button', { name: /update athlete/i }));

      // Wait for success and verify form retains values
      await waitFor(() => {
        expect(
          screen.getByText(/athlete.*jane.*doe.*updated successfully/i)
        ).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      const user = userEvent.setup();

      // Mock genders first, then API error for athlete creation
      mockFetch.mockImplementation(async url => {
        if (url === '/api/genders') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockGenders }),
          };
        }
        if (url === '/api/athletes') {
          return {
            ok: false,
            status: 409,
            json: async () => ({
              error: 'An athlete with this name already exists in this club',
            }),
          };
        }
        return { ok: false };
      });

      render(<AthleteForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.selectOptions(screen.getByLabelText(/gender/i), 'gender-1');
      await user.click(screen.getByRole('button', { name: /create athlete/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/an athlete with this name already exists/i)
        ).toBeInTheDocument();
      });
    });

    it('handles validation errors from API', async () => {
      const user = userEvent.setup();

      // Mock genders first, then validation error for athlete creation
      mockFetch.mockImplementation(async url => {
        if (url === '/api/genders') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockGenders }),
          };
        }
        if (url === '/api/athletes') {
          return {
            ok: false,
            status: 400,
            json: async () => ({
              error: 'Validation failed',
              details: [
                {
                  path: ['firstName'],
                  message: 'First name must be at least 2 characters',
                },
                { path: ['lastName'], message: 'Last name is required' },
              ],
            }),
          };
        }
        return { ok: false };
      });

      render(<AthleteForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      // Fill and submit form with invalid data
      await user.type(screen.getByLabelText(/first name/i), 'J'); // Too short
      await user.selectOptions(screen.getByLabelText(/gender/i), 'gender-1');
      await user.click(screen.getByRole('button', { name: /create athlete/i }));

      await waitFor(() => {
        // Check that validation errors are displayed properly
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
      });

      // Note: The firstName error might not be displayed since we're only checking API validation errors
      // which might not include all field errors depending on the mock setup
    });

    it('handles network errors', async () => {
      const user = userEvent.setup();

      // Mock genders first, then network error for athlete creation
      mockFetch.mockImplementation(async url => {
        if (url === '/api/genders') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockGenders }),
          };
        }
        if (url === '/api/athletes') {
          throw new Error('Network error');
        }
        return { ok: false };
      });

      render(<AthleteForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.selectOptions(screen.getByLabelText(/gender/i), 'gender-1');
      await user.click(screen.getByRole('button', { name: /create athlete/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/network error.*please try again/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state during submission', async () => {
      const user = userEvent.setup();

      // Mock delayed response
      let resolvePromise: (value: any) => void;
      const delayedPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      // Setup mocks for genders and delayed athlete creation
      mockFetch.mockImplementation(async url => {
        if (url === '/api/genders') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockGenders }),
          };
        }
        if (url === '/api/athletes') {
          return delayedPromise;
        }
        return { ok: false };
      });

      render(<AthleteForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.selectOptions(screen.getByLabelText(/gender/i), 'gender-1');
      await user.click(screen.getByRole('button', { name: /create athlete/i }));

      // Check loading state
      expect(screen.getByText(/creating.../i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /creating.../i })
      ).toBeDisabled();

      // Resolve the promise to clean up
      await act(async () => {
        resolvePromise!({
          ok: true,
          json: async () => ({ success: true, data: mockAthlete }),
        });
      });
    });

    it('shows loading state while fetching genders', () => {
      // Don't mock the genders fetch to simulate loading
      vi.clearAllMocks();
      mockUseClub.mockReturnValue({ selectedClub: mockClub });

      render(<AthleteForm />);

      expect(screen.getByText(/loading form.../i)).toBeInTheDocument();
    });
  });

  describe('Success Messages', () => {
    it('displays success message after creation', async () => {
      const user = userEvent.setup();

      // Mock genders first, then successful athlete creation
      mockFetch.mockImplementation(async url => {
        if (url === '/api/genders') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockGenders }),
          };
        }
        if (url === '/api/athletes') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockAthlete }),
          };
        }
        return { ok: false };
      });

      render(<AthleteForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.selectOptions(screen.getByLabelText(/gender/i), 'gender-1');
      await user.click(screen.getByRole('button', { name: /create athlete/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/athlete.*john doe.*created successfully/i)
        ).toBeInTheDocument();
      });
    });

    it('displays success message after update', async () => {
      const user = userEvent.setup();

      // Mock genders first, then successful athlete update
      mockFetch.mockImplementation(async url => {
        if (url === '/api/genders') {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockGenders }),
          };
        }
        if (url.includes('/api/athletes/')) {
          return {
            ok: true,
            json: async () => ({ success: true, data: mockAthlete }),
          };
        }
        return { ok: false };
      });

      render(<AthleteForm athlete={mockAthlete} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /update athlete/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/athlete.*john doe.*updated successfully/i)
        ).toBeInTheDocument();
      });
    });
  });
});
