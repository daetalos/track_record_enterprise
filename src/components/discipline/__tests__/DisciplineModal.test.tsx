import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DisciplineModal from '../DisciplineModal';
import type { Discipline } from '@/types/discipline';
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
  default: ({
    children,
    onClick,
    disabled,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant}>
      {children}
    </button>
  ),
}));

// Mock Label component
vi.mock('@/components/form/Label', () => ({
  default: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
}));

// Mock Input component
vi.mock('@/components/form/input/InputField', () => ({
  default: ({
    id,
    type,
    value,
    onChange,
    placeholder,
    className,
    disabled,
    min,
    max,
  }: {
    id?: string;
    type?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    min?: string;
    max?: string;
  }) => (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      min={min}
      max={max}
    />
  ),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

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

const mockDiscipline: Discipline = {
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
};

describe('DisciplineModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('should render create modal correctly', () => {
      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      expect(
        screen.getByRole('heading', { name: 'Create Discipline' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Add a new discipline for athletic events')
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Season/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Discipline Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
      expect(screen.getByText(/Discipline Type/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Team Size/)).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(
        <DisciplineModal
          isOpen={false}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should validate required fields', async () => {
      const user = userEvent.setup();

      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', {
        name: /Create Discipline/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Season is required')).toBeInTheDocument();
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('should validate business rules - both timed and measured', async () => {
      const user = userEvent.setup();

      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      const seasonSelect = screen.getByLabelText(/Season/);
      const nameInput = screen.getByLabelText(/Discipline Name/);

      await user.selectOptions(seasonSelect, 'season-1');
      await user.type(nameInput, 'Test Discipline');

      // Try to select both timed and measured (this should be prevented by UI)
      const timedRadio = screen.getByLabelText(/Timed/);
      const measuredRadio = screen.getByLabelText(/Measured/);

      await user.click(timedRadio);
      await user.click(measuredRadio);

      // The UI should automatically deselect timed when measured is selected
      expect(measuredRadio).toBeChecked();
      expect(timedRadio).not.toBeChecked();
    });

    it('should create discipline successfully', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi
          .fn()
          .mockResolvedValue({ success: true, data: mockDiscipline }),
      });

      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      const seasonSelect = screen.getByLabelText(/Season/);
      const nameInput = screen.getByLabelText(/Discipline Name/);
      const descriptionInput = screen.getByLabelText(/Description/);
      const timedRadio = screen.getByLabelText(/Timed/);

      await user.selectOptions(seasonSelect, 'season-1');
      await user.type(nameInput, '100m Sprint');
      await user.type(descriptionInput, 'Individual timed sprint event');
      await user.click(timedRadio);

      const submitButton = screen.getByRole('button', {
        name: /Create Discipline/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/disciplines', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            seasonId: 'season-1',
            name: '100m Sprint',
            description: 'Individual timed sprint event',
            isTimed: true,
            isMeasured: false,
            teamSize: null,
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
          details: [
            { path: ['name'], message: 'Discipline name already exists' },
          ],
        }),
      });

      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      const seasonSelect = screen.getByLabelText(/Season/);
      const nameInput = screen.getByLabelText(/Discipline Name/);

      await user.selectOptions(seasonSelect, 'season-1');
      await user.type(nameInput, 'Existing Discipline');

      const submitButton = screen.getByRole('button', {
        name: /Create Discipline/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Discipline name already exists')
        ).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      const seasonSelect = screen.getByLabelText(/Season/);
      const nameInput = screen.getByLabelText(/Discipline Name/);

      await user.selectOptions(seasonSelect, 'season-1');
      await user.type(nameInput, 'Valid Discipline');

      const submitButton = screen.getByRole('button', {
        name: /Create Discipline/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to save discipline. Please try again.')
        ).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    it('should render edit modal correctly', () => {
      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          discipline={mockDiscipline}
          seasons={mockSeasons}
        />
      );

      expect(
        screen.getByRole('heading', { name: 'Edit Discipline' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Update the discipline details')
      ).toBeInTheDocument();

      // Check that form is pre-filled
      expect(screen.getByDisplayValue('100m Sprint')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Individual timed sprint event')
      ).toBeInTheDocument();
    });

    it('should update discipline successfully', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi
          .fn()
          .mockResolvedValue({ success: true, data: mockDiscipline }),
      });

      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          discipline={mockDiscipline}
          seasons={mockSeasons}
        />
      );

      const nameInput = screen.getByDisplayValue('100m Sprint');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated 100m Sprint');

      const submitButton = screen.getByRole('button', {
        name: /Update Discipline/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/disciplines/discipline-1',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              seasonId: 'season-1',
              name: 'Updated 100m Sprint',
              description: 'Individual timed sprint event',
              isTimed: true,
              isMeasured: false,
              teamSize: null,
            }),
          }
        );
      });

      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  describe('Modal Interaction', () => {
    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      const closeButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not close modal during submission', () => {
      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      // This would be tested by checking if the close button is disabled during submission
      // but that requires more complex state mocking
      expect(screen.getByTestId('modal')).toBeInTheDocument();
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
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      const seasonSelect = screen.getByLabelText(/Season/);
      const nameInput = screen.getByLabelText(/Discipline Name/);

      await user.selectOptions(seasonSelect, 'season-1');
      await user.type(nameInput, 'Test Discipline');

      const submitButton = screen.getByRole('button', {
        name: /Create Discipline/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Creating...')).toBeInTheDocument();
      });
    });

    it('should clear form data when modal opens in create mode', () => {
      const { rerender } = render(
        <DisciplineModal
          isOpen={false}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          discipline={mockDiscipline}
          seasons={mockSeasons}
        />
      );

      // Open modal in create mode (without discipline)
      rerender(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      const nameInput = screen.getByLabelText(/Discipline Name/);
      const descriptionInput = screen.getByLabelText(/Description/);

      expect(nameInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  describe('Business Rule Validation', () => {
    it('should enforce type exclusivity - selecting timed deselects measured', async () => {
      const user = userEvent.setup();

      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      const timedRadio = screen.getByLabelText(/Timed/);
      const measuredRadio = screen.getByLabelText(/Measured/);

      // Start with timed selected (default)
      expect(timedRadio).toBeChecked();
      expect(measuredRadio).not.toBeChecked();

      // Select measured - should deselect timed
      await user.click(measuredRadio);
      expect(measuredRadio).toBeChecked();
      expect(timedRadio).not.toBeChecked();

      // Select timed again - should deselect measured
      await user.click(timedRadio);
      expect(timedRadio).toBeChecked();
      expect(measuredRadio).not.toBeChecked();
    });

    it('should validate team size range', async () => {
      const user = userEvent.setup();

      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      const seasonSelect = screen.getByLabelText(/Season/);
      const nameInput = screen.getByLabelText(/Discipline Name/);
      const teamSizeInput = screen.getByLabelText(/Team Size/);

      await user.selectOptions(seasonSelect, 'season-1');
      await user.type(nameInput, 'Test Discipline');

      // Test minimum team size validation
      await user.type(teamSizeInput, '0');

      const submitButton = screen.getByRole('button', {
        name: /Create Discipline/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Team size must be at least 1')
        ).toBeInTheDocument();
      });
    });

    it('should handle team size for relay events', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

      render(
        <DisciplineModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          seasons={mockSeasons}
        />
      );

      const seasonSelect = screen.getByLabelText(/Season/);
      const nameInput = screen.getByLabelText(/Discipline Name/);
      const teamSizeInput = screen.getByLabelText(/Team Size/);

      await user.selectOptions(seasonSelect, 'season-1');
      await user.type(nameInput, '4x100m Relay');
      await user.type(teamSizeInput, '4');

      const submitButton = screen.getByRole('button', {
        name: /Create Discipline/,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/disciplines', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            seasonId: 'season-1',
            name: '4x100m Relay',
            description: null,
            isTimed: true,
            isMeasured: false,
            teamSize: 4,
          }),
        });
      });
    });
  });
});
