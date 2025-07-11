'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useModal } from '@/hooks/useModal';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import { DisciplineList, DisciplineModal } from '@/components/discipline';
import { PlusIcon } from '@/icons';
import type { Discipline } from '@/types/discipline';
import type { Season } from '@/types/season';

export default function DisciplinesPage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(
    null
  );

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();

  // Fetch seasons for filtering and modal
  const fetchSeasons = useCallback(async () => {
    try {
      const response = await fetch('/api/seasons');
      if (response.ok) {
        const data = await response.json();
        setSeasons(data.data || []);
      } else {
        console.error('Failed to fetch seasons');
      }
    } catch (error) {
      console.error('Error fetching seasons:', error);
    }
  }, []);

  // Fetch disciplines with optional season filtering
  const fetchDisciplines = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = selectedSeasonId
        ? `/api/disciplines?season=${selectedSeasonId}`
        : '/api/disciplines';

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDisciplines(data.data || []);
      } else {
        console.error('Failed to fetch disciplines');
        setDisciplines([]);
      }
    } catch (error) {
      console.error('Error fetching disciplines:', error);
      setDisciplines([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSeasonId]);

  // Initial data load
  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  // Fetch disciplines when season filter changes
  useEffect(() => {
    fetchDisciplines();
  }, [fetchDisciplines]);

  // Handle opening create modal
  const handleCreate = () => {
    setEditingDiscipline(null);
    openModal();
  };

  // Handle opening edit modal
  const handleEdit = (discipline: Discipline) => {
    setEditingDiscipline(discipline);
    openModal();
  };

  // Handle successful modal submission
  const handleModalSuccess = () => {
    closeModal();
    setEditingDiscipline(null);
    fetchDisciplines(); // Refresh the list
  };

  // Handle modal close
  const handleModalClose = () => {
    closeModal();
    setEditingDiscipline(null);
  };

  // Handle season filter change
  const handleSeasonFilter = (seasonId: string | null) => {
    setSelectedSeasonId(seasonId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Discipline Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage athletic disciplines and events for your organization
          </p>
        </div>
        <Button
          onClick={handleCreate}
          startIcon={<PlusIcon className="w-4 h-4" />}
          disabled={seasons.length === 0}
        >
          Add Discipline
        </Button>
      </div>

      {/* No Seasons Warning */}
      {seasons.length === 0 && (
        <ComponentCard title="No Seasons Available">
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 text-yellow-400">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Seasons Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You need to create seasons before you can add disciplines.
            </p>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/seasons')}
            >
              Go to Season Management
            </Button>
          </div>
        </ComponentCard>
      )}

      {/* Main Content */}
      {seasons.length > 0 && (
        <ComponentCard title="Discipline Management">
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Total Disciplines
                    </p>
                    <p className="text-2xl font-semibold text-blue-900 dark:text-blue-100">
                      {disciplines.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Timed Events
                    </p>
                    <p className="text-2xl font-semibold text-green-900 dark:text-green-100">
                      {disciplines.filter(d => d.isTimed).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Measured Events
                    </p>
                    <p className="text-2xl font-semibold text-purple-900 dark:text-purple-100">
                      {disciplines.filter(d => d.isMeasured).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Discipline List */}
            <DisciplineList
              disciplines={disciplines}
              seasons={seasons}
              isLoading={isLoading}
              onEdit={handleEdit}
              onRefresh={fetchDisciplines}
              selectedSeasonId={selectedSeasonId}
              onSeasonFilter={handleSeasonFilter}
            />
          </div>
        </ComponentCard>
      )}

      {/* Discipline Modal */}
      <DisciplineModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        discipline={editingDiscipline}
        seasons={seasons}
      />
    </div>
  );
}
