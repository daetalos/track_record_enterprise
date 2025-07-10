'use client';

import { useClub } from '@/context/ClubContext';
import AthleteForm from '@/components/athlete/AthleteForm';
import ComponentCard from '@/components/common/ComponentCard';

export default function NewAthletePage() {
  const { selectedClub, isLoading: clubLoading } = useClub();

  if (clubLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-gray-300 rounded-full animate-spin border-t-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!selectedClub) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            No Club Selected
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please select a club to create athletes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Athlete
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add a new athlete to {selectedClub.name}
        </p>
      </div>

      <ComponentCard title="Athlete Details" className="max-w-2xl">
        <AthleteForm />
      </ComponentCard>
    </div>
  );
}
