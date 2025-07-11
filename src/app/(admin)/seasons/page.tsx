'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { SeasonList, SeasonModal } from '@/components/season';
import { PlusIcon } from '@/icons';
import type { Season } from '@/types/season';

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);

  // Fetch seasons
  const fetchSeasons = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/seasons');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch seasons');
      }

      setSeasons(data.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching seasons:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle creating new season
  const handleCreate = () => {
    setEditingSeason(null);
    setIsModalOpen(true);
  };

  // Handle editing season
  const handleEdit = (season: Season) => {
    setEditingSeason(season);
    setIsModalOpen(true);
  };

  // Handle season saved (created or updated)
  const handleSeasonSaved = () => {
    setIsModalOpen(false);
    setEditingSeason(null);
    fetchSeasons(); // Refresh the list
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSeason(null);
  };

  // Fetch seasons on component mount
  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Season Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage seasons for organizing athletic disciplines
          </p>
        </div>
        <Button
          onClick={handleCreate}
          startIcon={<PlusIcon className="w-4 h-4" />}
          className="shrink-0"
        >
          Add Season
        </Button>
      </div>

      {/* Seasons Table */}
      <ComponentCard
        title="Seasons"
        desc="Create and manage seasons for organizing your athletic disciplines"
      >
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <SeasonList
          seasons={seasons}
          isLoading={isLoading}
          onEdit={handleEdit}
          onRefresh={fetchSeasons}
        />
      </ComponentCard>

      {/* Season Modal */}
      <SeasonModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSeasonSaved}
        season={editingSeason}
      />
    </div>
  );
}
