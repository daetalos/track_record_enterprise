// Performance model types for athlete performance recording

export interface Performance {
  id: string;
  athleteId: string;
  disciplineId: string;
  ageGroupId: string;
  genderId: string;
  medalId?: string; // Optional medal assignment

  // Performance values (either time or distance, not both)
  timeSeconds?: number; // For timed disciplines
  distanceMeters?: number; // For measured disciplines

  // Event information
  date: string; // ISO date string
  eventDetails: string; // Competition/event name

  // Record flags
  isPersonalBest: boolean;
  isClubRecord: boolean;
  wasPersonalBest: boolean; // Historical flag
  wasClubRecord: boolean; // Historical flag

  // File upload support
  proofFileUrl?: string;
  proofFileName?: string;

  // Team performance support
  teamMembers?: string[]; // Array of athlete IDs for team events

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Relationships (for API responses)
  athlete?: {
    id: string;
    firstName: string;
    lastName: string;
    club: {
      id: string;
      name: string;
    };
  };
  discipline?: {
    id: string;
    name: string;
    isTimed: boolean;
    isMeasured: boolean;
    teamSize?: number;
    season: {
      id: string;
      name: string;
    };
  };
  ageGroup?: {
    id: string;
    name: string;
    ordinal: number;
  };
  gender?: {
    id: string;
    name: string;
    initial: string;
  };
  medal?: {
    id: string;
    position: number;
    name: string;
  };
}

// Performance creation data (without id and timestamps)
export interface PerformanceCreateData {
  athleteId: string;
  disciplineId: string;
  ageGroupId: string;
  genderId: string;
  medalId?: string;
  timeSeconds?: number;
  distanceMeters?: number;
  date: string;
  eventDetails: string;
  proofFileUrl?: string;
  proofFileName?: string;
  teamMembers?: string[];
}

// Performance update data (partial)
export interface PerformanceUpdateData {
  medalId?: string;
  timeSeconds?: number;
  distanceMeters?: number;
  date?: string;
  eventDetails?: string;
  proofFileUrl?: string;
  proofFileName?: string;
  teamMembers?: string[];
}

// Performance validation result
export interface PerformanceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Performance filter options
export interface PerformanceFilters {
  athleteId?: string;
  disciplineId?: string;
  ageGroupId?: string;
  genderId?: string;
  medalId?: string;
  seasonId?: string;
  dateFrom?: string;
  dateTo?: string;
  isPersonalBest?: boolean;
  isClubRecord?: boolean;
  hasProofFile?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// Performance list response
export interface PerformanceListResponse {
  success: boolean;
  data: Performance[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Performance API response
export interface PerformanceResponse {
  success: boolean;
  data: Performance;
  message?: string;
}

// Duplicate performance check data
export interface DuplicatePerformanceCheck {
  athleteId: string;
  disciplineId: string;
  ageGroupId: string;
  genderId: string;
  date: string;
  eventDetails: string;
  excludeId?: string; // For updates
}

// Record detection result
export interface RecordDetectionResult {
  isNewPersonalBest: boolean;
  isNewClubRecord: boolean;
  previousPersonalBest?: Performance;
  previousClubRecord?: Performance;
  notifications: string[];
}

// Team performance validation
export interface TeamPerformanceValidation {
  isValid: boolean;
  requiredTeamSize: number;
  providedTeamSize: number;
  errors: string[];
}

// Performance value validation
export interface PerformanceValueValidation {
  isValid: boolean;
  hasTimeValue: boolean;
  hasDistanceValue: boolean;
  hasMedal: boolean;
  disciplineType: 'timed' | 'measured' | 'unknown';
  errors: string[];
}

// Constants for performance validation
export const PERFORMANCE_VALIDATION = {
  MIN_TIME_SECONDS: 0.01, // Minimum time in seconds
  MAX_TIME_SECONDS: 86400, // Maximum time in seconds (24 hours)
  MIN_DISTANCE_METERS: 0.01, // Minimum distance in meters
  MAX_DISTANCE_METERS: 10000, // Maximum distance in meters
  MAX_EVENT_DETAILS_LENGTH: 255,
  MAX_PROOF_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_PROOF_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
} as const;

// Performance sorting options
export type PerformanceSortField =
  | 'date'
  | 'timeSeconds'
  | 'distanceMeters'
  | 'athlete.lastName'
  | 'discipline.name'
  | 'medal.position'
  | 'createdAt';

export type PerformanceSortOrder = 'asc' | 'desc';

export interface PerformanceSort {
  field: PerformanceSortField;
  order: PerformanceSortOrder;
}
