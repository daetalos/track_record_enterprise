'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useSession } from 'next-auth/react';
import type { ClubType, UserClubWithClub } from '@/types/club';

type ClubContextType = {
  selectedClub: ClubType | null;
  userClubs: UserClubWithClub[];
  isLoading: boolean;
  error: string | null;
  selectClub: (clubId: string) => Promise<void>;
  refreshUserClubs: () => Promise<void>;
};

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, update: updateSession } = useSession();
  const [selectedClub, setSelectedClub] = useState<ClubType | null>(null);
  const [userClubs, setUserClubs] = useState<UserClubWithClub[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's accessible clubs
  const refreshUserClubs = useCallback(async (): Promise<void> => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/clubs');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch clubs');
      }

      setUserClubs(data.data || []);

      // Set selected club from session or auto-select if only one club
      if (data.selectedClubId) {
        const selectedClubData = data.data?.find(
          (uc: UserClubWithClub) => uc.club.id === data.selectedClubId
        );
        setSelectedClub(selectedClubData?.club || null);
      } else if (data.data?.length === 1) {
        // Auto-select single club
        setSelectedClub(data.data[0].club);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching user clubs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  // Select a club and update session
  const selectClub = async (clubId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the select API endpoint
      const response = await fetch('/api/clubs/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to select club');
      }

      // Update session with new club context
      await updateSession({ selectedClubId: clubId });

      // Update local state
      const selectedClubData = userClubs.find(uc => uc.club.id === clubId);
      if (selectedClubData) {
        setSelectedClub(selectedClubData.club);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error selecting club:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize clubs when session is available
  useEffect(() => {
    if (session?.user?.id) {
      refreshUserClubs();
    }
  }, [session?.user?.id, refreshUserClubs]);

  // Update selected club when session changes
  useEffect(() => {
    if (session?.selectedClubId && userClubs.length > 0) {
      const selectedClubData = userClubs.find(
        uc => uc.club.id === session.selectedClubId
      );
      if (selectedClubData) {
        setSelectedClub(selectedClubData.club);
      }
    }
  }, [session?.selectedClubId, userClubs]);

  return (
    <ClubContext.Provider
      value={{
        selectedClub,
        userClubs,
        isLoading,
        error,
        selectClub,
        refreshUserClubs,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};
