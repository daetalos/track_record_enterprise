'use client';

import React, { useState, useCallback } from 'react';

interface AthleteSearchProps {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  placeholder?: string;
}

export function AthleteSearch({
  onSearch,
  searchTerm,
  placeholder = 'Search athletes by name...',
}: AthleteSearchProps) {
  const [inputValue, setInputValue] = useState(searchTerm);

  // Debounced search handler
  const handleSearch = useCallback(
    (value: string) => {
      onSearch(value);
    },
    [onSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Immediate search for responsive feedback
    handleSearch(value);
  };

  const handleClear = () => {
    setInputValue('');
    handleSearch('');
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-5 w-5 text-gray-400"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="block w-full rounded-md border-gray-300 bg-white pl-10 pr-10 text-sm placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-400 dark:focus:ring-primary-400"
        placeholder={placeholder}
        aria-label="Search athletes"
      />
      {inputValue && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
