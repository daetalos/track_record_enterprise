'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useClub } from '@/context/ClubContext';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { AthleteList, AthleteModal } from '@/components/athlete';
import type { AthleteListRef } from '@/components/athlete';
import type { AthleteWithRelations } from '@/types/athlete';
import { PlusIcon } from '@/icons';

export default function AthletesPage() {
  const { selectedClub, isLoading: clubLoading } = useClub();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] =
    useState<AthleteWithRelations | null>(null);
  const athleteListRef = useRef<AthleteListRef>(null);

  // Handle creating new athlete
  const handleCreate = () => {
    setEditingAthlete(null);
    setIsModalOpen(true);
  };

  // Handle editing athlete
  const handleEdit = async (athlete: {
    id: string;
    firstName: string;
    lastName: string;
    gender: { id: string; name: string; initial: string };
    ageGroup: { id: string; name: string } | null;
    createdAt: string;
  }) => {
    try {
      // Fetch the full athlete data from the API
      const response = await fetch(`/api/athletes/${athlete.id}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setEditingAthlete(data.data);
        setIsModalOpen(true);
      } else {
        console.error('Failed to fetch athlete details:', data.error);
        alert('Failed to load athlete details');
      }
    } catch (error) {
      console.error('Error fetching athlete details:', error);
      alert('Failed to load athlete details');
    }
  };

  // Handle athlete saved (created or updated)
  const handleAthleteSaved = () => {
    setIsModalOpen(false);
    setEditingAthlete(null);
    // Refresh the athlete list
    athleteListRef.current?.refresh();
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAthlete(null);
  };

  // Refresh athlete list
  const refreshAthletes = useCallback(() => {
    athleteListRef.current?.refresh();
  }, []);

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
        <Button
          onClick={handleCreate}
          startIcon={<PlusIcon className="w-4 h-4" />}
          className="shrink-0"
        >
          Add Athlete
        </Button>
      </div>

      {/* Athletes Table */}
      <ComponentCard
        title="Athletes"
        desc="Manage your club's athlete roster and information"
      >
        <AthleteList
          ref={athleteListRef}
          onEdit={handleEdit}
          onRefresh={refreshAthletes}
        />
      </ComponentCard>

      {/* Athlete Modal */}
      <AthleteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleAthleteSaved}
        athlete={editingAthlete}
      />
    </div>
  );
}
