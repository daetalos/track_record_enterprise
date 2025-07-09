// TypeScript types for athlete management models
// Generated from Prisma schema for type safety

export interface Gender {
  id: string;
  name: string; // Male, Female
  initial: string; // M, F
}

export interface AgeGroup {
  id: string;
  clubId: string;
  name: string; // U9, U10, U11, Junior, Senior, Masters
  ordinal: number; // For proper sorting
  createdAt: Date;
  updatedAt: Date;
}

export interface AgeGroupWithClub extends AgeGroup {
  club: {
    id: string;
    name: string;
  };
}

export interface Athlete {
  id: string;
  clubId: string;
  genderId: string;
  firstName: string;
  lastName: string;
  ageGroupId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AthleteWithRelations extends Athlete {
  club: {
    id: string;
    name: string;
  };
  gender: Gender;
  ageGroup?: AgeGroup | null;
}

// Form types for athlete creation/editing
export interface CreateAthleteData {
  firstName: string;
  lastName: string;
  genderId: string;
  ageGroupId?: string;
}

export interface UpdateAthleteData extends Partial<CreateAthleteData> {
  id: string;
}

// Form types for age group creation/editing
export interface CreateAgeGroupData {
  name: string;
  ordinal: number;
}

export interface UpdateAgeGroupData extends Partial<CreateAgeGroupData> {
  id: string;
}

// Search and filtering types
export interface AthleteSearchParams {
  query?: string;
  genderId?: string;
  ageGroupId?: string;
  limit?: number;
  offset?: number;
}

export interface AthleteSearchResult {
  athletes: AthleteWithRelations[];
  total: number;
  hasMore: boolean;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface AthleteValidationErrors {
  firstName?: string;
  lastName?: string;
  genderId?: string;
  ageGroupId?: string;
  general?: string;
}

export interface AgeGroupValidationErrors {
  name?: string;
  ordinal?: string;
  general?: string;
}
