import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SeasonModal from '../SeasonModal';
import type { Season } from '@/types/season';

// Mock Modal component
vi.mock('@/components/ui/modal', () => ({
  Modal: ({
    isOpen,
    onClose,
    children,
    className,
  }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
  }) =>
    isOpen ? (
      <div data-testid="modal" className={className}>
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
        {children}
      </div>
    ) : null,
}));

// Mock Button component
vi.mock('@/components/ui/button/Button', () => ({
  default: ({ children, onClick, disabled, variant, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock Label component
vi.mock('@/components/form/Label', () => ({
  default: ({ children, htmlFor, ...props }: any) => (
    <label htmlFor={htmlFor} data-testid="label" {...props}>
      {children}
    </label>
  ),
}));

// Mock Input component
vi.mock('@/components/form/input/InputField', () => ({
  default: ({
    id,
    value,
    onChange,
    placeholder,
    disabled,
    className,
    ...props
  }: any) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      data-testid="input"
      {...props}
    />
  ),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock data
const mockSeason: Season = {
  id: 'season-1',
  name: 'Track & Field',
  description: 'Outdoor track and field season',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  _count: { disciplines: 5 },
};

describe('SeasonModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('should render create modal correctly', () => {
      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      expect(
        screen.getByRole('heading', { name: 'Create Season' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Add a new season for organizing disciplines')
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Season Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(
        <SeasonModal
          isOpen={false}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should validate required fields', async () => {
      const user = userEvent.setup();

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', {
        name: /Create Season/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('should validate name length', async () => {
      const user = userEvent.setup();

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      const nameInput = screen.getByLabelText(/Season Name/);
      await user.type(nameInput, 'a'.repeat(101)); // 101 characters

      const submitButton = screen.getByRole('button', {
        name: /Create Season/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Name must be 100 characters or less')
        ).toBeInTheDocument();
      });
    });

    it('should validate description length', async () => {
      const user = userEvent.setup();

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      const nameInput = screen.getByLabelText(/Season Name/);
      const descriptionInput = screen.getByLabelText(/Description/);

      await user.type(nameInput, 'Valid Season');
      await user.type(descriptionInput, 'a'.repeat(501)); // 501 characters

      const submitButton = screen.getByRole('button', {
        name: /Create Season/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Description must be 500 characters or less')
        ).toBeInTheDocument();
      });
    });

    it('should create season successfully', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true, data: mockSeason }),
      });

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      const nameInput = screen.getByLabelText(/Season Name/);
      const descriptionInput = screen.getByLabelText(/Description/);

      await user.type(nameInput, 'Track & Field');
      await user.type(descriptionInput, 'Outdoor track and field season');

      const submitButton = screen.getByRole('button', {
        name: /Create Season/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/seasons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Track & Field',
            description: 'Outdoor track and field season',
          }),
        });
      });

      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should handle API validation errors', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: 'Validation failed',
          details: [{ path: ['name'], message: 'Season name already exists' }],
        }),
      });

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      const nameInput = screen.getByLabelText(/Season Name/);
      await user.type(nameInput, 'Existing Season');

      const submitButton = screen.getByRole('button', {
        name: /Create Season/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Season name already exists')
        ).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      const nameInput = screen.getByLabelText(/Season Name/);
      await user.type(nameInput, 'Valid Season');

      const submitButton = screen.getByRole('button', {
        name: /Create Season/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to save season. Please try again.')
        ).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    it('should render edit modal correctly', () => {
      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          season={mockSeason}
        />
      );

      expect(screen.getByText('Edit Season')).toBeInTheDocument();
      expect(screen.getByText('Update the season details')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Track & Field')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Outdoor track and field season')
      ).toBeInTheDocument();
      expect(screen.getByText('Update Season')).toBeInTheDocument();
    });

    it('should handle season with null description', () => {
      const seasonWithoutDescription = {
        ...mockSeason,
        description: null,
      };

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          season={seasonWithoutDescription}
        />
      );

      const descriptionInput = screen.getByLabelText(/Description/);
      expect(descriptionInput).toHaveValue('');
    });

    it('should update season successfully', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true, data: mockSeason }),
      });

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          season={mockSeason}
        />
      );

      const nameInput = screen.getByDisplayValue('Track & Field');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Track & Field');

      const submitButton = screen.getByRole('button', {
        name: /Update Season/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/seasons/season-1', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Updated Track & Field',
            description: 'Outdoor track and field season',
          }),
        });
      });

      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  describe('Modal Interaction', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not close during submission', async () => {
      const user = userEvent.setup();

      // Mock a slow API call
      mockFetch.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100)
          )
      );

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      const nameInput = screen.getByLabelText(/Season Name/);
      await user.type(nameInput, 'Test Season');

      const submitButton = screen.getByRole('button', {
        name: /Create Season/,
      });
      await user.click(submitButton);

      // Try to click cancel during submission
      const cancelButton = screen.getByText('Cancel');
      expect(cancelButton).toBeDisabled();

      // Close button should also be disabled during submission
      const closeButton = screen.getByTestId('close-modal');
      await user.click(closeButton);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();

      mockFetch.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100)
          )
      );

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      const nameInput = screen.getByLabelText(/Season Name/);
      await user.type(nameInput, 'Test Season');

      const submitButton = screen.getByRole('button', {
        name: /Create Season/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Creating...')).toBeInTheDocument();
      });
    });

    it('should clear form data when modal opens in create mode', () => {
      const { rerender } = render(
        <SeasonModal
          isOpen={false}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          season={mockSeason}
        />
      );

      // Open modal in create mode (without season)
      rerender(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      const nameInput = screen.getByLabelText(/Season Name/);
      const descriptionInput = screen.getByLabelText(/Description/);

      expect(nameInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });

    it('should clear field errors when user starts typing', async () => {
      const user = userEvent.setup();

      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      );

      // Trigger validation error first
      const submitButton = screen.getByRole('button', {
        name: /Create Season/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });

      // Start typing in the name field
      const nameInput = screen.getByLabelText(/Season Name/);
      await user.type(nameInput, 'T');

      // Error should be cleared
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });

    it('should show character count', () => {
      render(
        <SeasonModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          season={mockSeason}
        />
      );

      // Should show character count
      expect(screen.getByText(/30.*\/.*500.*characters/)).toBeInTheDocument();
    });
  });
});
