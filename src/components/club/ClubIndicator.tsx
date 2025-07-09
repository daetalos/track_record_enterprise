'use client';

import React from 'react';
import { useClub } from '@/context/ClubContext';

export const ClubIndicator: React.FC = () => {
  const { selectedClub, isLoading, error } = useClub();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse dark:bg-gray-600"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span>Error</span>
      </div>
    );
  }

  if (!selectedClub) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="w-2 h-2 bg-gray-300 rounded-full dark:bg-gray-600"></div>
        <span>No club selected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="truncate max-w-32">{selectedClub.name}</span>
    </div>
  );
};

export default ClubIndicator;
