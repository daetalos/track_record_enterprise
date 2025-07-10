'use client';

import React, { useState } from 'react';
import AthleteCombobox from '@/components/athlete/AthleteCombobox';
import AthleteSearchFilters from '@/components/athlete/AthleteSearchFilters';
import { type AthleteSearchResult } from '@/hooks/useAthleteSearch';

// Enhanced test page for Step 4 - advanced search with filtering
export default function TestComboboxPage() {
  const [selectedAthlete, setSelectedAthlete] =
    useState<AthleteSearchResult | null>(null);
  const [genderId, setGenderId] = useState<string | undefined>();
  const [ageGroupId, setAgeGroupId] = useState<string | undefined>();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Advanced Athlete Search Test - Step 4
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search and Combobox */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Athletes
          </label>

          <AthleteCombobox
            value={selectedAthlete}
            onChange={setSelectedAthlete}
            placeholder="Type to search athletes..."
            genderId={genderId}
            ageGroupId={ageGroupId}
          />

          {selectedAthlete && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h3 className="text-sm font-medium text-gray-900">
                Selected Athlete:
              </h3>
              <pre className="mt-1 text-xs text-gray-600">
                {JSON.stringify(selectedAthlete, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Advanced Filters
          </h3>

          <AthleteSearchFilters
            selectedGenderId={genderId}
            selectedAgeGroupId={ageGroupId}
            onGenderChange={setGenderId}
            onAgeGroupChange={setAgeGroupId}
          />

          {/* Filter Debug Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded text-xs">
            <div className="font-medium text-blue-900">Active Filters:</div>
            <div className="text-blue-700">
              Gender: {genderId || 'All'}
              <br />
              Age Group: {ageGroupId || 'All'}
            </div>
          </div>
        </div>
      </div>

      {/* Features Demonstration */}
      <div className="mt-8 border-t pt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Features Demonstrated
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-medium text-green-900">
              ✅ Headless UI Integration
            </div>
            <div className="text-green-700">
              Accessible combobox with keyboard navigation
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-medium text-green-900">
              ✅ Search Debouncing
            </div>
            <div className="text-green-700">
              300ms debounce for performance optimization
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-medium text-green-900">
              ✅ Advanced Filtering
            </div>
            <div className="text-green-700">Filter by gender and age group</div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-medium text-green-900">
              ✅ Club Context Integration
            </div>
            <div className="text-green-700">
              Automatic club-scoped search results
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-medium text-green-900">
              ✅ Real-time Updates
            </div>
            <div className="text-green-700">
              Instant search with loading states
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-medium text-green-900">✅ Error Handling</div>
            <div className="text-green-700">
              Graceful error states and user feedback
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
