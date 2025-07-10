import { useState, useEffect, useCallback } from 'react';
import { useClub } from '@/context/ClubContext';

// Types for search results (matching API response)
export interface AthleteSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  gender: {
    id: string;
    name: string;
    initial: string;
  };
  ageGroup?: {
    id: string;
    name: string;
  } | null;
}

// Search parameters interface
export interface AthleteSearchParams {
  query: string;
  genderId?: string;
  ageGroupId?: string;
  limit?: number;
}

// Search state interface
export interface AthleteSearchState {
  athletes: AthleteSearchResult[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

// Hook configuration
interface UseAthleteSearchConfig {
  debounceMs?: number;
  minQueryLength?: number;
  defaultLimit?: number;
}

// Pure function to build search URL - easy to test
export function buildSearchUrl(
  clubId: string,
  params: AthleteSearchParams
): string {
  const searchQueryParams = new URLSearchParams({
    clubId,
    q: params.query,
    limit: (params.limit ?? 10).toString(),
  });

  // Add optional filters
  if (params.genderId) {
    searchQueryParams.append('genderId', params.genderId);
  }
  if (params.ageGroupId) {
    searchQueryParams.append('ageGroupId', params.ageGroupId);
  }

  return `/api/athletes/search?${searchQueryParams}`;
}

// Pure function to validate search parameters - easy to test
export function validateSearchParams(
  params: AthleteSearchParams,
  clubId: string | null,
  minQueryLength: number
): string | null {
  if (!clubId) {
    return 'No club selected';
  }

  if (params.query.length < minQueryLength) {
    return null; // Not an error, just don't search
  }

  return null; // Valid
}

export function useAthleteSearch(config: UseAthleteSearchConfig = {}) {
  const { debounceMs = 300, minQueryLength = 2, defaultLimit = 10 } = config;

  const { selectedClub } = useClub();

  // Search state
  const [searchState, setSearchState] = useState<AthleteSearchState>({
    athletes: [],
    isLoading: false,
    error: null,
    total: 0,
  });

  // Search parameters
  const [searchParams, setSearchParams] = useState<AthleteSearchParams>({
    query: '',
    limit: defaultLimit,
  });

  // Debounced search function
  const searchAthletes = useCallback(
    async (params: AthleteSearchParams) => {
      const validationError = validateSearchParams(
        params,
        selectedClub?.id || null,
        minQueryLength
      );

      if (validationError) {
        setSearchState(prev => ({
          ...prev,
          athletes: [],
          error: validationError,
          isLoading: false,
        }));
        return;
      }

      if (params.query.length < minQueryLength) {
        setSearchState(prev => ({
          ...prev,
          athletes: [],
          error: null,
          isLoading: false,
          total: 0,
        }));
        return;
      }

      setSearchState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const url = buildSearchUrl(selectedClub!.id, params);
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to search athletes');
        }

        setSearchState({
          athletes: data.data || [],
          isLoading: false,
          error: null,
          total: data.total || 0,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Search failed';
        setSearchState({
          athletes: [],
          isLoading: false,
          error: errorMessage,
          total: 0,
        });
        console.error('Error searching athletes:', err);
      }
    },
    [selectedClub, minQueryLength]
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAthletes(searchParams);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchParams, searchAthletes, debounceMs]);

  // Update search query
  const updateQuery = useCallback((query: string) => {
    setSearchParams(prev => ({ ...prev, query }));
  }, []);

  // Update gender filter
  const updateGenderFilter = useCallback((genderId?: string) => {
    setSearchParams(prev => ({ ...prev, genderId }));
  }, []);

  // Update age group filter
  const updateAgeGroupFilter = useCallback((ageGroupId?: string) => {
    setSearchParams(prev => ({ ...prev, ageGroupId }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchParams({
      query: '',
      limit: defaultLimit,
    });
  }, [defaultLimit]);

  // Clear search results
  const clearResults = useCallback(() => {
    setSearchState({
      athletes: [],
      isLoading: false,
      error: null,
      total: 0,
    });
  }, []);

  return {
    // State
    athletes: searchState.athletes,
    isLoading: searchState.isLoading,
    error: searchState.error,
    total: searchState.total,

    // Current search parameters
    searchParams,

    // Actions
    updateQuery,
    updateGenderFilter,
    updateAgeGroupFilter,
    clearFilters,
    clearResults,

    // Manual search trigger (for advanced use cases)
    searchAthletes: useCallback((params: AthleteSearchParams) => {
      setSearchParams(params);
    }, []),
  };
}
