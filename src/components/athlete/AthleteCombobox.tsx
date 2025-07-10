'use client';

import React, { useState } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import {
  useAthleteSearch,
  type AthleteSearchResult,
} from '@/hooks/useAthleteSearch';

interface AthleteComboboxProps {
  value?: AthleteSearchResult | null;
  onChange: (athlete: AthleteSearchResult | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  genderId?: string;
  ageGroupId?: string;
}

export default function AthleteCombobox({
  value,
  onChange,
  placeholder = 'Search for an athlete...',
  disabled = false,
  className = '',
  genderId,
  ageGroupId,
}: AthleteComboboxProps) {
  const [query, setQuery] = useState('');

  // Use the new search hook with debouncing and filtering
  const {
    athletes,
    isLoading,
    error,
    updateQuery,
    updateGenderFilter,
    updateAgeGroupFilter,
  } = useAthleteSearch({
    debounceMs: 300,
    minQueryLength: 2,
    defaultLimit: 10,
  });

  // Update filters when props change
  React.useEffect(() => {
    updateGenderFilter(genderId);
  }, [genderId, updateGenderFilter]);

  React.useEffect(() => {
    updateAgeGroupFilter(ageGroupId);
  }, [ageGroupId, updateAgeGroupFilter]);

  // Handle selection
  const handleChange = (selectedAthlete: AthleteSearchResult | null) => {
    onChange(selectedAthlete);
    // Clear search query when selecting
    if (selectedAthlete) {
      setQuery('');
    }
  };

  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    updateQuery(newQuery);
  };

  // Clear selection
  const handleClear = () => {
    setQuery('');
    updateQuery('');
    onChange(null);
  };

  return (
    <div className={`relative ${className}`}>
      <Combobox value={value} onChange={handleChange} disabled={disabled}>
        <div className="relative">
          <ComboboxInput
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
            displayValue={(athlete: AthleteSearchResult | null) =>
              athlete ? athlete.displayName : ''
            }
            onChange={handleInputChange}
            placeholder={placeholder}
            autoComplete="off"
          />

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div
                role="status"
                aria-label="Loading athletes"
                className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"
              ></div>
            </div>
          )}

          {/* Clear button */}
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none empty:invisible">
          {error ? (
            <div className="px-3 py-2 text-red-600">Error: {error}</div>
          ) : athletes.length === 0 && query.length >= 2 && !isLoading ? (
            <div className="px-3 py-2 text-gray-500">
              No athletes found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            athletes.map(athlete => (
              <ComboboxOption
                key={athlete.id}
                value={athlete}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <div className="flex items-center">
                  <span className="block truncate font-medium group-data-[selected]:font-semibold">
                    {athlete.displayName}
                  </span>
                  <span className="ml-2 text-xs text-gray-500 group-data-[focus]:text-indigo-200">
                    {athlete.gender.initial}
                    {athlete.ageGroup && ` · ${athlete.ageGroup.name}`}
                  </span>
                </div>

                {/* Selection indicator */}
                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
