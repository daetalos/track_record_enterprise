'use client';

import React, { useState, useEffect } from 'react';
import { useClub } from '@/context/ClubContext';

interface Gender {
  id: string;
  name: string;
  initial: string;
}

interface AgeGroup {
  id: string;
  name: string;
  ordinal: number;
}

interface AthleteSearchFiltersProps {
  selectedGenderId?: string;
  selectedAgeGroupId?: string;
  onGenderChange: (genderId?: string) => void;
  onAgeGroupChange: (ageGroupId?: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function AthleteSearchFilters({
  selectedGenderId,
  selectedAgeGroupId,
  onGenderChange,
  onAgeGroupChange,
  className = '',
  disabled = false,
}: AthleteSearchFiltersProps) {
  const { selectedClub } = useClub();
  const [genders, setGenders] = useState<Gender[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch genders (global data)
  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await fetch('/api/genders');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch genders');
        }

        setGenders(data.data || []);
      } catch (err) {
        console.error('Error fetching genders:', err);
        setError('Failed to load gender options');
      }
    };

    fetchGenders();
  }, []);

  // Fetch age groups for selected club
  useEffect(() => {
    const fetchAgeGroups = async () => {
      if (!selectedClub?.id) {
        setAgeGroups([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/age-groups?clubId=${selectedClub.id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch age groups');
        }

        // Sort by ordinal for proper display
        const sortedAgeGroups = (data.data || []).sort(
          (a: AgeGroup, b: AgeGroup) => a.ordinal - b.ordinal
        );
        setAgeGroups(sortedAgeGroups);
      } catch (err) {
        console.error('Error fetching age groups:', err);
        setError('Failed to load age group options');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgeGroups();
  }, [selectedClub?.id]);

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* Gender Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender
        </label>
        <select
          value={selectedGenderId || ''}
          onChange={e => onGenderChange(e.target.value || undefined)}
          disabled={disabled}
          className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="">All Genders</option>
          {genders.map(gender => (
            <option key={gender.id} value={gender.id}>
              {gender.name}
            </option>
          ))}
        </select>
      </div>

      {/* Age Group Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age Group
        </label>
        <select
          value={selectedAgeGroupId || ''}
          onChange={e => onAgeGroupChange(e.target.value || undefined)}
          disabled={disabled || isLoading}
          className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="">All Age Groups</option>
          {ageGroups.map(ageGroup => (
            <option key={ageGroup.id} value={ageGroup.id}>
              {ageGroup.name}
            </option>
          ))}
        </select>
        {isLoading && (
          <div className="mt-1 text-xs text-gray-500">
            Loading age groups...
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {(selectedGenderId || selectedAgeGroupId) && (
        <button
          type="button"
          onClick={() => {
            onGenderChange(undefined);
            onAgeGroupChange(undefined);
          }}
          disabled={disabled}
          className="text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
