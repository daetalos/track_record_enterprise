'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type { Season, SeasonCreateRequest } from '@/types/season';

interface SeasonValidationErrors {
  name?: string;
  description?: string;
  general?: string;
}

interface SeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  season?: Season | null;
}

export default function SeasonModal({
  isOpen,
  onClose,
  onSuccess,
  season,
}: SeasonModalProps) {
  const [formData, setFormData] = useState<SeasonCreateRequest>({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<SeasonValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!season;

  // Initialize form data when modal opens or season changes
  useEffect(() => {
    if (isOpen) {
      if (season) {
        setFormData({
          name: season.name,
          description: season.description || '',
        });
      } else {
        setFormData({
          name: '',
          description: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, season]);

  // Handle form input changes
  const handleInputChange = (
    field: keyof SeasonCreateRequest,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: SeasonValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be 100 characters or less';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
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
      const url = isEditing ? `/api/seasons/${season.id}` : '/api/seasons';
      const method = isEditing ? 'PUT' : 'POST';

      const requestData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
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
          const validationErrors: SeasonValidationErrors = {};
          data.details.forEach((error: { path: string[]; message: string }) => {
            const field = error.path[0] as keyof SeasonValidationErrors;
            validationErrors[field] = error.message;
          });
          setErrors(validationErrors);
        } else {
          setErrors({ general: data.error || 'Failed to save season' });
        }
        return;
      }

      // Success
      onSuccess();
    } catch (error) {
      console.error('Error saving season:', error);
      setErrors({ general: 'Failed to save season. Please try again.' });
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
            {isEditing ? 'Edit Season' : 'Create Season'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing
              ? 'Update the season details'
              : 'Add a new season for organizing disciplines'}
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
              Season Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="e.g. Track & Field, Indoors, Cross Country"
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
              placeholder="Optional description of the season"
              rows={3}
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
              className="min-w-[100px] inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-white rounded-full animate-spin border-t-transparent" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                <>{isEditing ? 'Update Season' : 'Create Season'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
