'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type {
  AgeGroup,
  CreateAgeGroupData,
  AgeGroupValidationErrors,
} from '@/types/athlete';

interface AgeGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ageGroup?: AgeGroup | null;
  clubId: string;
}

export default function AgeGroupModal({
  isOpen,
  onClose,
  onSuccess,
  ageGroup,
  clubId,
}: AgeGroupModalProps) {
  const [formData, setFormData] = useState<CreateAgeGroupData>({
    name: '',
    ordinal: 1,
  });
  const [errors, setErrors] = useState<AgeGroupValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!ageGroup;

  // Initialize form data when modal opens or age group changes
  useEffect(() => {
    if (isOpen) {
      if (ageGroup) {
        setFormData({
          name: ageGroup.name,
          ordinal: ageGroup.ordinal,
        });
      } else {
        setFormData({
          name: '',
          ordinal: 1,
        });
      }
      setErrors({});
    }
  }, [isOpen, ageGroup]);

  // Handle form input changes
  const handleInputChange = (
    field: keyof CreateAgeGroupData,
    value: string | number
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: AgeGroupValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 32) {
      newErrors.name = 'Name must be 32 characters or less';
    }

    if (formData.ordinal < 1) {
      newErrors.ordinal = 'Ordinal must be a positive number';
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
        ? `/api/age-groups/${ageGroup.id}`
        : '/api/age-groups';
      const method = isEditing ? 'PUT' : 'POST';

      const requestData = {
        ...formData,
        clubId,
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
          const validationErrors: AgeGroupValidationErrors = {};
          data.details.forEach((error: { path: string[]; message: string }) => {
            const field = error.path[0] as keyof AgeGroupValidationErrors;
            validationErrors[field] = error.message;
          });
          setErrors(validationErrors);
        } else {
          setErrors({ general: data.error || 'Failed to save age group' });
        }
        return;
      }

      // Success
      onSuccess();
    } catch (error) {
      console.error('Error saving age group:', error);
      setErrors({ general: 'Failed to save age group. Please try again.' });
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
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md mx-4">
      <div className="p-6">
        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Age Group' : 'Create Age Group'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing
              ? 'Update the age group details'
              : 'Add a new age group for your club'}
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

          {/* Name Field */}
          <div>
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="e.g. U9, U10, Junior, Senior"
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

          {/* Ordinal Field */}
          <div>
            <Label htmlFor="ordinal">
              Display Order <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ordinal"
              type="number"
              min="1"
              value={formData.ordinal}
              onChange={e =>
                handleInputChange('ordinal', parseInt(e.target.value) || 1)
              }
              placeholder="1"
              className={
                errors.ordinal
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : ''
              }
              disabled={isSubmitting}
            />
            {errors.ordinal && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.ordinal}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Lower numbers appear first in lists
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
              className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                  ? 'Update Age Group'
                  : 'Create Age Group'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
