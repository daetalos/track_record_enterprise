'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useClub } from '@/context/ClubContext';

export const ClubSelector: React.FC = () => {
  const { selectedClub, userClubs, isLoading, error, selectClub } = useClub();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle club selection
  const handleClubSelect = async (clubId: string) => {
    try {
      await selectClub(clubId);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to select club:', error);
    }
  };

  // Don't render if no clubs or loading
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-transparent dark:border-gray-600"></div>
        Loading clubs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-2 text-sm text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  if (userClubs.length === 0) {
    return (
      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        No clubs available
      </div>
    );
  }

  // Single club - just show indicator, no dropdown
  if (userClubs.length === 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        {selectedClub?.name || userClubs[0].club.name}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="truncate max-w-32">
            {selectedClub?.name || 'Select Club'}
          </span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-56 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
              Select Club
            </div>
            {userClubs.map(userClub => (
              <button
                key={userClub.club.id}
                onClick={() => handleClubSelect(userClub.club.id)}
                className={`flex items-center w-full gap-3 px-3 py-2 text-sm text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedClub?.id === userClub.club.id
                    ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedClub?.id === userClub.club.id
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="truncate">{userClub.club.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {userClub.role.toLowerCase()}
                  </div>
                </div>
                {selectedClub?.id === userClub.club.id && (
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubSelector;
