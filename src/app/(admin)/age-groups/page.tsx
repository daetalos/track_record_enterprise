'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useClub } from '@/context/ClubContext';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import AgeGroupList from '@/components/age-group/AgeGroupList';
import AgeGroupModal from '@/components/age-group/AgeGroupModal';
import { PlusIcon } from '@/icons';
import type { AgeGroup } from '@/types/athlete';

export default function AgeGroupsPage() {
  const { selectedClub, isLoading: clubLoading } = useClub();
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgeGroup, setEditingAgeGroup] = useState<AgeGroup | null>(null);

  // Fetch age groups for the selected club
  const fetchAgeGroups = useCallback(async () => {
    if (!selectedClub?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/age-groups?clubId=${selectedClub.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch age groups');
      }

      setAgeGroups(data.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching age groups:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClub?.id]);

  // Handle creating new age group
  const handleCreate = () => {
    setEditingAgeGroup(null);
    setIsModalOpen(true);
  };

  // Handle editing age group
  const handleEdit = (ageGroup: AgeGroup) => {
    setEditingAgeGroup(ageGroup);
    setIsModalOpen(true);
  };

  // Handle age group saved (created or updated)
  const handleAgeGroupSaved = () => {
    setIsModalOpen(false);
    setEditingAgeGroup(null);
    fetchAgeGroups(); // Refresh the list
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAgeGroup(null);
  };

  // Fetch age groups when club changes
  useEffect(() => {
    fetchAgeGroups();
  }, [selectedClub?.id, fetchAgeGroups]);

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
            Please select a club to manage age groups.
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
            Age Group Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage age groups for {selectedClub.name}
          </p>
        </div>
        <Button
          onClick={handleCreate}
          startIcon={<PlusIcon className="w-4 h-4" />}
          className="shrink-0"
        >
          Add Age Group
        </Button>
      </div>

      {/* Age Groups Table */}
      <ComponentCard
        title="Age Groups"
        desc="Create and manage age groups for your club's athletes"
      >
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <AgeGroupList
          ageGroups={ageGroups}
          isLoading={isLoading}
          onEdit={handleEdit}
          onRefresh={fetchAgeGroups}
        />
      </ComponentCard>

      {/* Age Group Modal */}
      <AgeGroupModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleAgeGroupSaved}
        ageGroup={editingAgeGroup}
        clubId={selectedClub.id}
      />
    </div>
  );
}
