'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useClub } from '@/context/ClubContext';
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

export function AthleteList() {
  const { selectedClub } = useClub();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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

  if (!selectedClub) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          Please select a club to view athletes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow dark:bg-gray-800">
      {/* Search header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <AthleteSearch onSearch={handleSearch} searchTerm={searchTerm} />
      </div>

      {/* Athletes table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Loading athletes...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : athletes.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm
                ? `No athletes found matching "${searchTerm}"`
                : 'No athletes found. Add some athletes to get started.'}
            </p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Age Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Added
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {athletes.map(athlete => (
                  <tr
                    key={athlete.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {athlete.firstName} {athlete.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                        {athlete.gender.name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {athlete.ageGroup?.name || 'Not assigned'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(athlete.createdAt).toLocaleDateString()}
                    </td>
                    <td className="relative whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary-600">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
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
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        page => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 ${
                              page === currentPage
                                ? 'bg-primary text-white'
                                : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
