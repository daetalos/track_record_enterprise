'use client';

import React, { useState, useEffect } from 'react';
import { AthleteWithRelations } from '@/types/athlete';
import Button from '@/components/ui/button/Button';
import useGoBack from '@/hooks/useGoBack';

interface AthleteProfileProps {
  athleteId: string;
}

export function AthleteProfile({ athleteId }: AthleteProfileProps) {
  const [athlete, setAthlete] = useState<AthleteWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const goBack = useGoBack();

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/athletes/${athleteId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch athlete');
        }

        const result = await response.json();
        if (result.success) {
          setAthlete(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch athlete');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (athleteId) {
      fetchAthlete();
    }
  }, [athleteId]);

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-red-600 mb-2">Error</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <Button size="sm" onClick={goBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            Athlete Not Found
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            The requested athlete could not be found.
          </p>
          <Button size="sm" onClick={goBack}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Athlete Info Card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Athlete Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  First Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {athlete.firstName}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Last Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {athlete.lastName}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Gender
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {athlete.gender.name}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Age Group
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {athlete.ageGroup?.name || 'Not assigned'}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Club
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {athlete.club.name}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Created
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {new Date(athlete.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button
              size="sm"
              variant="outline"
              onClick={goBack}
              className="flex w-full items-center justify-center gap-2"
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.91922 2.25004C7.23236 2.25004 7.48922 2.5069 7.48922 2.82004C7.48922 3.13318 7.23236 3.39004 6.91922 3.39004H3.39004V14.61H6.91922C7.23236 14.61 7.48922 14.8669 7.48922 15.18C7.48922 15.4932 7.23236 15.75 6.91922 15.75H2.82004C2.5069 15.75 2.25004 15.4932 2.25004 15.18V2.82004C2.25004 2.5069 2.5069 2.25004 2.82004 2.25004H6.91922Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.4024 6.40242C12.6276 6.62765 12.6276 7.00235 12.4024 7.22758L9.62998 10L12.4024 12.7724C12.6276 12.9976 12.6276 13.3724 12.4024 13.5976C12.1772 13.8228 11.8024 13.8228 11.5772 13.5976L8.39242 10.4128C8.16719 10.1876 8.16719 9.81242 8.39242 9.58719L11.5772 6.40242C11.8024 6.17719 12.1772 6.17719 12.4024 6.40242Z"
                  fill=""
                />
              </svg>
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Performance Placeholder Card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Performance History
          </h4>
          <div className="py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Performance tracking coming soon
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Future releases will include performance records, personal bests,
              and competition results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
