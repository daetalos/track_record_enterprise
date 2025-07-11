// Season and Discipline types for athletics event management
export interface Season {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Discipline {
  id: string;
  seasonId: string;
  name: string;
  description?: string;
  isTimed: boolean;
  isMeasured: boolean;
  isSmallerBetter: boolean;
  teamSize?: number;
  createdAt: Date;
  updatedAt: Date;
  season?: Season;
}

// Input types for creating/updating disciplines
export interface CreateDisciplineInput {
  seasonId: string;
  name: string;
  description?: string;
  isTimed: boolean;
  isMeasured: boolean;
  teamSize?: number;
}

export interface UpdateDisciplineInput {
  name?: string;
  description?: string;
  isTimed?: boolean;
  isMeasured?: boolean;
  teamSize?: number;
}

// Business rule validation functions
export class DisciplineValidation {
  /**
   * Validates that a discipline is either timed OR measured, not both
   */
  static validateTypeExclusivity(isTimed: boolean, isMeasured: boolean): void {
    if (isTimed && isMeasured) {
      throw new Error('Discipline cannot be both timed and measured');
    }
    if (!isTimed && !isMeasured) {
      throw new Error('Discipline must be either timed or measured');
    }
  }

  /**
   * Validates team size for relay events
   */
  static validateTeamSize(teamSize?: number): void {
    if (teamSize !== undefined && teamSize !== null) {
      if (teamSize < 1) {
        throw new Error('Team size must be at least 1');
      }
      if (teamSize > 10) {
        throw new Error('Team size cannot exceed 10 members');
      }
    }
  }

  /**
   * Determines the comparison direction based on discipline type
   */
  static getComparisonDirection(
    isTimed: boolean,
    isMeasured: boolean
  ): boolean {
    DisciplineValidation.validateTypeExclusivity(isTimed, isMeasured);

    if (isTimed) {
      return true; // Smaller is better for timed events
    }
    if (isMeasured) {
      return false; // Larger is better for measured events
    }

    throw new Error(
      'Cannot determine comparison direction for invalid discipline type'
    );
  }

  /**
   * Validates a complete discipline input
   */
  static validateDisciplineInput(input: CreateDisciplineInput): void {
    if (!input.seasonId?.trim()) {
      throw new Error('Season ID is required');
    }
    if (!input.name?.trim()) {
      throw new Error('Discipline name is required');
    }
    if (input.name.length > 128) {
      throw new Error('Discipline name cannot exceed 128 characters');
    }

    DisciplineValidation.validateTypeExclusivity(
      input.isTimed,
      input.isMeasured
    );
    DisciplineValidation.validateTeamSize(input.teamSize);
  }

  /**
   * Prepares a discipline for creation with business rules applied
   */
  static prepareDisciplineForCreation(input: CreateDisciplineInput) {
    DisciplineValidation.validateDisciplineInput(input);

    return {
      ...input,
      isSmallerBetter: DisciplineValidation.getComparisonDirection(
        input.isTimed,
        input.isMeasured
      ),
    };
  }
}

// Season input types
export interface CreateSeasonInput {
  name: string;
  description?: string;
}

export interface UpdateSeasonInput {
  name?: string;
  description?: string;
}

// Season validation functions
export class SeasonValidation {
  /**
   * Validates season input data
   */
  static validateSeasonInput(input: CreateSeasonInput): void {
    if (!input.name?.trim()) {
      throw new Error('Season name is required');
    }
    if (input.name.length > 64) {
      throw new Error('Season name cannot exceed 64 characters');
    }
  }
}
