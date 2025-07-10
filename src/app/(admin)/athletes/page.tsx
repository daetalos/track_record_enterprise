'use client';

import React from 'react';
import Link from 'next/link';
import { useClub } from '@/context/ClubContext';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { AthleteList } from '@/components/athlete';
import { PlusIcon } from '@/icons';

export default function AthletesPage() {
  const { selectedClub, isLoading: clubLoading } = useClub();

  // Show loading state if club is loading
  if (clubLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-transparent dark:border-gray-600"></div>
          Loading club information...
        </div>
      </div>
    );
  }

  // Show error if no club selected
  if (!selectedClub) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Club Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Please select a club to manage athletes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Athletes
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage athletes for {selectedClub.name}
          </p>
        </div>
        <Link href="/athletes/new">
          <Button
            startIcon={<PlusIcon className="w-4 h-4" />}
            className="shrink-0"
          >
            Add Athlete
          </Button>
        </Link>
      </div>

      {/* Athletes Table */}
      <ComponentCard
        title="Athletes"
        desc="Manage your club's athlete roster and information"
      >
        <AthleteList />
      </ComponentCard>
    </div>
  );
}
