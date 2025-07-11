'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type { Discipline, CreateDisciplineInput } from '@/types/discipline';
import type { Season } from '@/types/season';

interface DisciplineValidationErrors {
  name?: string;
  description?: string;
  seasonId?: string;
  isTimed?: string;
  isMeasured?: string;
  teamSize?: string;
  general?: string;
}

interface DisciplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  discipline?: Discipline | null;
  seasons: Season[];
}

export default function DisciplineModal({
  isOpen,
  onClose,
  onSuccess,
  discipline,
  seasons,
}: DisciplineModalProps) {
  const [formData, setFormData] = useState<CreateDisciplineInput>({
    seasonId: '',
    name: '',
    description: '',
    isTimed: true,
    isMeasured: false,
    teamSize: undefined,
  });
  const [errors, setErrors] = useState<DisciplineValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!discipline;

  // Initialize form data when modal opens or discipline changes
  useEffect(() => {
    if (isOpen) {
      if (discipline) {
        setFormData({
          seasonId: discipline.seasonId,
          name: discipline.name,
          description: discipline.description || '',
          isTimed: discipline.isTimed,
          isMeasured: discipline.isMeasured,
          teamSize: discipline.teamSize || undefined,
        });
      } else {
        setFormData({
          seasonId: '',
          name: '',
          description: '',
          isTimed: true,
          isMeasured: false,
          teamSize: undefined,
        });
      }
      setErrors({});
    }
  }, [isOpen, discipline]);

  // Handle form input changes
  const handleInputChange = (
    field: keyof CreateDisciplineInput,
    value: string | boolean | number | undefined
  ) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Business rule: automatically adjust type exclusivity
      if (field === 'isTimed' && value === true) {
        newData.isMeasured = false;
      } else if (field === 'isMeasured' && value === true) {
        newData.isTimed = false;
      }

      return newData;
    });

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: DisciplineValidationErrors = {};

    // Season validation
    if (!formData.seasonId) {
      newErrors.seasonId = 'Season is required';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 128) {
      newErrors.name = 'Name must be 128 characters or less';
    }

    // Description validation
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    // Business rule: Type exclusivity validation
    if (!formData.isTimed && !formData.isMeasured) {
      newErrors.isTimed = 'Discipline must be either timed or measured';
      newErrors.isMeasured = 'Discipline must be either timed or measured';
    } else if (formData.isTimed && formData.isMeasured) {
      newErrors.isTimed = 'Discipline cannot be both timed and measured';
      newErrors.isMeasured = 'Discipline cannot be both timed and measured';
    }

    // Team size validation
    if (formData.teamSize !== undefined && formData.teamSize !== null) {
      if (formData.teamSize < 1) {
        newErrors.teamSize = 'Team size must be at least 1';
      } else if (formData.teamSize > 10) {
        newErrors.teamSize = 'Team size cannot exceed 10 members';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const url = isEditing
        ? `/api/disciplines/${discipline.id}`
        : '/api/disciplines';
      const method = isEditing ? 'PUT' : 'POST';

      const requestData = {
        seasonId: formData.seasonId,
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        isTimed: formData.isTimed,
        isMeasured: formData.isMeasured,
        teamSize: formData.teamSize || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Handle Zod validation errors
          const validationErrors: DisciplineValidationErrors = {};
          data.details.forEach((error: { path: string[]; message: string }) => {
            const field = error.path[0] as keyof DisciplineValidationErrors;
            validationErrors[field] = error.message;
          });
          setErrors(validationErrors);
        } else {
          setErrors({ general: data.error || 'Failed to save discipline' });
        }
        return;
      }

      // Success
      onSuccess();
    } catch (error) {
      console.error('Error saving discipline:', error);
      setErrors({ general: 'Failed to save discipline. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg mx-4">
      <div className="p-6">
        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Discipline' : 'Create Discipline'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing
              ? 'Update the discipline details'
              : 'Add a new discipline for athletic events'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Error */}
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.general}
              </p>
            </div>
          )}

          {/* Season Field */}
          <div>
            <Label htmlFor="seasonId">
              Season <span className="text-red-500">*</span>
            </Label>
            <select
              id="seasonId"
              value={formData.seasonId}
              onChange={e => handleInputChange('seasonId', e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                errors.seasonId
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : ''
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select a season</option>
              {seasons.map(season => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>
            {errors.seasonId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.seasonId}
              </p>
            )}
          </div>

          {/* Name Field */}
          <div>
            <Label htmlFor="name">
              Discipline Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="e.g. 100m Sprint, Shot Put, 4x100m Relay"
              className={
                errors.name
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : ''
              }
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Optional description of the discipline"
              rows={2}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 ${
                errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {(formData.description || '').length}/500 characters
            </p>
          </div>

          {/* Type Selection */}
          <div>
            <Label>
              Discipline Type <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="disciplineType"
                  checked={formData.isTimed}
                  onChange={() => handleInputChange('isTimed', true)}
                  disabled={isSubmitting}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Timed</strong> - Events measured by time (e.g.,
                  sprints, distance races)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="disciplineType"
                  checked={formData.isMeasured}
                  onChange={() => handleInputChange('isMeasured', true)}
                  disabled={isSubmitting}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Measured</strong> - Events measured by distance/height
                  (e.g., throws, jumps)
                </span>
              </label>
            </div>
            {(errors.isTimed || errors.isMeasured) && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.isTimed || errors.isMeasured}
              </p>
            )}
          </div>

          {/* Team Size Field */}
          <div>
            <Label htmlFor="teamSize">Team Size (Optional)</Label>
            <Input
              id="teamSize"
              type="number"
              min="1"
              max="10"
              value={formData.teamSize || ''}
              onChange={e => {
                const value = e.target.value;
                handleInputChange(
                  'teamSize',
                  value ? parseInt(value, 10) : undefined
                );
              }}
              placeholder="Leave empty for individual events"
              className={
                errors.teamSize
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : ''
              }
              disabled={isSubmitting}
            />
            {errors.teamSize && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.teamSize}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              For relay or team events, specify the number of team members
              (1-10)
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px] inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-white rounded-full animate-spin border-t-transparent" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                <>{isEditing ? 'Update Discipline' : 'Create Discipline'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
