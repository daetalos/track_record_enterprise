'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useClub } from '@/context/ClubContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Button from '@/components/ui/button/Button';
import { PencilIcon, TrashBinIcon } from '@/icons';
import { AthleteSearch } from './AthleteSearch';

interface Gender {
  id: string;
  name: string;
  initial: string;
}

interface AgeGroup {
  id: string;
  name: string;
}

interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  ageGroup: AgeGroup | null;
  createdAt: string;
}

interface AthletesResponse {
  success: boolean;
  data: Athlete[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface AthleteListProps {
  onEdit?: (athlete: Athlete) => void;
  onRefresh?: () => void;
}

export function AthleteList({ onEdit, onRefresh }: AthleteListProps = {}) {
  const { selectedClub } = useClub();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const limit = 10; // Athletes per page

  // Fetch athletes
  const fetchAthletes = useCallback(
    async (page: number = 1, search: string = '') => {
      if (!selectedClub?.id) return;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          clubId: selectedClub.id,
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search.trim()) {
          params.append('search', search.trim());
        }

        const response = await fetch(`/api/athletes?${params}`);
        const result: AthletesResponse = await response.json();

        if (result.success) {
          setAthletes(result.data);
          setTotalPages(result.pagination.totalPages);
          setTotal(result.pagination.total);
        } else {
          setError('Failed to fetch athletes');
        }
      } catch (err) {
        setError('Failed to fetch athletes');
        console.error('Error fetching athletes:', err);
      } finally {
        setLoading(false);
      }
    },
    [selectedClub?.id, limit]
  );

  // Load athletes when club changes or component mounts
  useEffect(() => {
    if (selectedClub?.id) {
      fetchAthletes(1, '');
      setCurrentPage(1);
    } else {
      // Reset loading state when no club is selected
      setLoading(false);
      setAthletes([]);
      setError(null);
    }
  }, [selectedClub?.id, fetchAthletes]);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchAthletes(1, term);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAthletes(page, searchTerm);
  };

  // Handle athlete deletion
  const handleDelete = async (athlete: Athlete) => {
    if (
      !confirm(
        `Are you sure you want to delete "${athlete.firstName} ${athlete.lastName}"?`
      )
    ) {
      return;
    }

    setDeletingId(athlete.id);

    try {
      const response = await fetch(`/api/athletes/${athlete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete athlete');
      }

      // Refresh the list after successful deletion
      if (onRefresh) {
        onRefresh();
      } else {
        fetchAthletes(currentPage, searchTerm);
      }
    } catch (error) {
      console.error('Error deleting athlete:', error);
      alert(
        error instanceof Error ? error.message : 'Failed to delete athlete'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-transparent dark:border-gray-600"></div>
          Loading athletes...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  // No club selected state
  if (!selectedClub) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Please select a club to view athletes.
        </p>
      </div>
    );
  }

  // Empty state
  if (athletes.length === 0) {
    return (
      <div className="space-y-6">
        {/* Search header */}
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <AthleteSearch onSearch={handleSearch} searchTerm={searchTerm} />
        </div>

        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
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
                d="M17 20a4 4 0 1 1 8 0 4 4 0 0 1-8 0zM8 34v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1M32 20a4 4 0 1 1 8 0 4 4 0 0 1-8 0zM28 34v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Athletes Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm
              ? `No athletes found matching "${searchTerm}"`
              : 'Get started by adding your first athlete.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <AthleteSearch onSearch={handleSearch} searchTerm={searchTerm} />
      </div>

      {/* Athletes table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Gender
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Age Group
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Added
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {athletes.map(athlete => (
                  <TableRow key={athlete.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {athlete.firstName} {athlete.lastName}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                        {athlete.gender.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {athlete.ageGroup?.name || 'Not assigned'}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {new Date(athlete.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit && onEdit(athlete)}
                          startIcon={<PencilIcon className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(athlete)}
                          disabled={deletingId === athlete.id}
                          startIcon={
                            deletingId === athlete.id ? (
                              <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-transparent" />
                            ) : (
                              <TrashBinIcon className="w-4 h-4" />
                            )
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          {deletingId === athlete.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Previous
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * limit, total)}
                </span>{' '}
                of <span className="font-medium">{total}</span> athletes
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 ${
                        page === currentPage
                          ? 'bg-primary text-white'
                          : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
