'use client';

import React, { useState, useEffect } from 'react';
import { useClub } from '@/context/ClubContext';
import Form from '@/components/form/Form';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';

import type {
  Gender,
  CreateAthleteData,
  AthleteValidationErrors,
  AthleteWithRelations,
} from '@/types/athlete';

interface AthleteFormProps {
  onSuccess?: (athlete: AthleteWithRelations) => void;
  onCancel?: () => void;
  className?: string;
  athlete?: AthleteWithRelations | null;
}

const AthleteForm: React.FC<AthleteFormProps> = ({
  onSuccess,
  onCancel,
  className,
  athlete,
}) => {
  const isEditing = !!athlete;
  const { selectedClub } = useClub();
  const [formData, setFormData] = useState<CreateAthleteData>({
    firstName: '',
    lastName: '',
    genderId: '',
    ageGroupId: '',
  });
  const [genders, setGenders] = useState<Gender[]>([]);
  const [errors, setErrors] = useState<AthleteValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGenders, setIsLoadingGenders] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Initialize form data when editing
  useEffect(() => {
    if (athlete) {
      setFormData({
        firstName: athlete.firstName,
        lastName: athlete.lastName,
        genderId: athlete.gender.id,
        ageGroupId: athlete.ageGroup?.id || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        genderId: '',
        ageGroupId: '',
      });
    }
  }, [athlete]);

  // Fetch genders on component mount
  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await fetch('/api/genders');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch genders');
        }

        setGenders(data.data || []);
      } catch (error) {
        console.error('Error fetching genders:', error);
        setErrors({ general: 'Failed to load gender options' });
      } finally {
        setIsLoadingGenders(false);
      }
    };

    fetchGenders();
  }, []);

  const handleInputChange = (field: keyof CreateAthleteData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: AthleteValidationErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.genderId) {
      newErrors.genderId = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedClub) {
      setErrors({ general: 'No club selected' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const url = isEditing ? `/api/athletes/${athlete.id}` : '/api/athletes';
      const method = isEditing ? 'PUT' : 'POST';

      // Prepare request data, filtering out empty ageGroupId
      const baseData = { ...formData };
      if (baseData.ageGroupId === '') {
        delete baseData.ageGroupId;
      }

      const requestData = isEditing
        ? baseData
        : { ...baseData, clubId: selectedClub.id };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({
            general: 'An athlete with this name already exists in this club',
          });
        } else if (data.details) {
          // Handle validation errors from API
          const apiErrors: AthleteValidationErrors = {};
          data.details.forEach(
            (error: { path?: string[]; message: string }) => {
              if (error.path && error.path.length > 0) {
                apiErrors[error.path[0] as keyof AthleteValidationErrors] =
                  error.message;
              }
            }
          );
          setErrors(apiErrors);
        } else {
          setErrors({
            general:
              data.error ||
              `Failed to ${isEditing ? 'update' : 'create'} athlete`,
          });
        }
        return;
      }

      // Success
      setSuccessMessage(
        `Athlete "${data.data.firstName} ${data.data.lastName}" ${isEditing ? 'updated' : 'created'} successfully!`
      );

      if (onSuccess) {
        onSuccess(data.data);
      }

      // Reset form only if creating
      if (!isEditing) {
        setFormData({
          firstName: '',
          lastName: '',
          genderId: '',
          ageGroupId: '',
        });
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error(
        `Error ${isEditing ? 'updating' : 'creating'} athlete:`,
        error
      );
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingGenders) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin border-t-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading form...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <Form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Success Message Display */}
          {successMessage && (
            <div className="p-4 text-sm text-green-800 bg-green-100 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              {successMessage}
            </div>
          )}

          {/* General Error Display */}
          {errors.general && (
            <div className="p-4 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {errors.general}
            </div>
          )}

          {/* First Name Field */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              First Name *
            </label>
            <InputField
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter athlete's first name"
              value={formData.firstName}
              onChange={e => handleInputChange('firstName', e.target.value)}
              error={!!errors.firstName}
              hint={errors.firstName}
              disabled={isLoading}
            />
          </div>

          {/* Last Name Field */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Last Name *
            </label>
            <InputField
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter athlete's last name"
              value={formData.lastName}
              onChange={e => handleInputChange('lastName', e.target.value)}
              error={!!errors.lastName}
              hint={errors.lastName}
              disabled={isLoading}
            />
          </div>

          {/* Gender Selection */}
          <div>
            <label
              htmlFor="genderId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Gender *
            </label>
            <select
              id="genderId"
              name="genderId"
              value={formData.genderId}
              onChange={e => handleInputChange('genderId', e.target.value)}
              disabled={isLoading}
              className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 ${
                errors.genderId
                  ? 'text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500'
                  : 'bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800'
              }`}
            >
              <option value="">Select Gender</option>
              {genders.map(gender => (
                <option key={gender.id} value={gender.id}>
                  {gender.name}
                </option>
              ))}
            </select>
            {errors.genderId && (
              <p className="mt-1.5 text-xs text-error-500">{errors.genderId}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border border-white rounded-full animate-spin border-t-transparent"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditing ? (
                'Update Athlete'
              ) : (
                'Create Athlete'
              )}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AthleteForm;
