// Club-related TypeScript types and interfaces
// Generated from Prisma schema for type safety

import { Club, UserClub, ClubRole } from '@prisma/client';

// Base Club type from Prisma
export type ClubType = Club;

// Base UserClub type from Prisma
export type UserClubType = UserClub;

// Club role enum re-export
export { ClubRole };

// Extended Club type with user relationship count
export interface ClubWithStats extends Club {
  memberCount: number;
  userClubs?: UserClubType[];
}

// User club relationship with club details
export interface UserClubWithClub extends UserClub {
  club: Club;
}

// User club relationship with user details
export interface UserClubWithUser extends UserClub {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

// Club creation request type
export interface CreateClubRequest {
  name: string;
  description?: string;
}

// Club update request type
export interface UpdateClubRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// Club selection request type
export interface ClubSelectionRequest {
  clubId: string;
}

// Club context type for state management
export interface ClubContext {
  selectedClub: Club | null;
  userClubs: UserClubWithClub[];
  isLoading: boolean;
  error: string | null;
}

// Club permissions helper type
export interface ClubPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageMembers: boolean;
}

// API response types
export interface ClubApiResponse {
  success: boolean;
  data?: Club | Club[];
  error?: string;
  message?: string;
}

export interface UserClubsApiResponse {
  success: boolean;
  data?: UserClubWithClub[];
  error?: string;
  message?: string;
}

export interface ClubSelectionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Club validation schemas (for use with Zod)
export interface ClubValidationSchema {
  name: string;
  description?: string;
}

// Club search/filter types
export interface ClubFilters {
  isActive?: boolean;
  search?: string;
  role?: ClubRole;
}

// Club list item type for UI components
export interface ClubListItem {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  userRole: ClubRole;
  isActive: boolean;
}
