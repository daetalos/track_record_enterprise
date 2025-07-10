'use client';

import React, { useState, useCallback } from 'react';

interface AthleteSearchProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export function AthleteSearch({
  onSearch,
  initialValue = '',
  placeholder = 'Search athletes by name...',
}: AthleteSearchProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync internal state with initialValue when it changes externally
  React.useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

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
      <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
        <svg
          className="fill-gray-500 dark:fill-gray-400"
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
      </span>
      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        value={inputValue}
        onChange={handleInputChange}
        className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        placeholder={placeholder}
        aria-label="Search athletes"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05]"
          aria-label="Clear search"
        >
          <svg
            className="h-3 w-3"
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
      )}
    </div>
  );
}
