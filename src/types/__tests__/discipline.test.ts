import { describe, it, expect } from 'vitest';
import {
  DisciplineValidation,
  SeasonValidation,
  CreateDisciplineInput,
  CreateSeasonInput,
} from '../discipline';

describe('DisciplineValidation', () => {
  describe('validateTypeExclusivity', () => {
    it('should pass when discipline is timed only', () => {
      expect(() => {
        DisciplineValidation.validateTypeExclusivity(true, false);
      }).not.toThrow();
    });

    it('should pass when discipline is measured only', () => {
      expect(() => {
        DisciplineValidation.validateTypeExclusivity(false, true);
      }).not.toThrow();
    });

    it('should throw error when discipline is both timed and measured', () => {
      expect(() => {
        DisciplineValidation.validateTypeExclusivity(true, true);
      }).toThrow('Discipline cannot be both timed and measured');
    });

    it('should throw error when discipline is neither timed nor measured', () => {
      expect(() => {
        DisciplineValidation.validateTypeExclusivity(false, false);
      }).toThrow('Discipline must be either timed or measured');
    });
  });

  describe('validateTeamSize', () => {
    it('should pass when team size is undefined (individual event)', () => {
      expect(() => {
        DisciplineValidation.validateTeamSize(undefined);
      }).not.toThrow();
    });

    it('should pass when team size is null (individual event)', () => {
      expect(() => {
        DisciplineValidation.validateTeamSize(null as any);
      }).not.toThrow();
    });

    it('should pass with valid team sizes', () => {
      expect(() => {
        DisciplineValidation.validateTeamSize(1);
      }).not.toThrow();

      expect(() => {
        DisciplineValidation.validateTeamSize(4);
      }).not.toThrow();

      expect(() => {
        DisciplineValidation.validateTeamSize(10);
      }).not.toThrow();
    });

    it('should throw error when team size is less than 1', () => {
      expect(() => {
        DisciplineValidation.validateTeamSize(0);
      }).toThrow('Team size must be at least 1');

      expect(() => {
        DisciplineValidation.validateTeamSize(-1);
      }).toThrow('Team size must be at least 1');
    });

    it('should throw error when team size exceeds 10', () => {
      expect(() => {
        DisciplineValidation.validateTeamSize(11);
      }).toThrow('Team size cannot exceed 10 members');

      expect(() => {
        DisciplineValidation.validateTeamSize(15);
      }).toThrow('Team size cannot exceed 10 members');
    });
  });

  describe('getComparisonDirection', () => {
    it('should return true (smaller is better) for timed events', () => {
      const result = DisciplineValidation.getComparisonDirection(true, false);
      expect(result).toBe(true);
    });

    it('should return false (larger is better) for measured events', () => {
      const result = DisciplineValidation.getComparisonDirection(false, true);
      expect(result).toBe(false);
    });

    it('should throw error when both timed and measured', () => {
      expect(() => {
        DisciplineValidation.getComparisonDirection(true, true);
      }).toThrow('Discipline cannot be both timed and measured');
    });

    it('should throw error when neither timed nor measured', () => {
      expect(() => {
        DisciplineValidation.getComparisonDirection(false, false);
      }).toThrow('Discipline must be either timed or measured');
    });
  });

  describe('validateDisciplineInput', () => {
    const validInput: CreateDisciplineInput = {
      seasonId: 'season-123',
      name: '100m Sprint',
      description: 'Men and women 100 meter sprint',
      isTimed: true,
      isMeasured: false,
      teamSize: undefined,
    };

    it('should pass with valid timed individual discipline', () => {
      expect(() => {
        DisciplineValidation.validateDisciplineInput(validInput);
      }).not.toThrow();
    });

    it('should pass with valid measured team discipline', () => {
      const measuredTeamInput: CreateDisciplineInput = {
        seasonId: 'season-123',
        name: '4x100m Relay',
        description: 'Mixed 4x100m relay race',
        isTimed: false,
        isMeasured: true,
        teamSize: 4,
      };

      expect(() => {
        DisciplineValidation.validateDisciplineInput(measuredTeamInput);
      }).not.toThrow();
    });

    it('should throw error when season ID is missing', () => {
      const input = { ...validInput, seasonId: '' };
      expect(() => {
        DisciplineValidation.validateDisciplineInput(input);
      }).toThrow('Season ID is required');
    });

    it('should throw error when season ID is only whitespace', () => {
      const input = { ...validInput, seasonId: '   ' };
      expect(() => {
        DisciplineValidation.validateDisciplineInput(input);
      }).toThrow('Season ID is required');
    });

    it('should throw error when name is missing', () => {
      const input = { ...validInput, name: '' };
      expect(() => {
        DisciplineValidation.validateDisciplineInput(input);
      }).toThrow('Discipline name is required');
    });

    it('should throw error when name is only whitespace', () => {
      const input = { ...validInput, name: '   ' };
      expect(() => {
        DisciplineValidation.validateDisciplineInput(input);
      }).toThrow('Discipline name is required');
    });

    it('should throw error when name exceeds 128 characters', () => {
      const longName = 'A'.repeat(129);
      const input = { ...validInput, name: longName };
      expect(() => {
        DisciplineValidation.validateDisciplineInput(input);
      }).toThrow('Discipline name cannot exceed 128 characters');
    });

    it('should throw error for invalid type exclusivity', () => {
      const input = { ...validInput, isTimed: true, isMeasured: true };
      expect(() => {
        DisciplineValidation.validateDisciplineInput(input);
      }).toThrow('Discipline cannot be both timed and measured');
    });

    it('should throw error for invalid team size', () => {
      const input = { ...validInput, teamSize: -1 };
      expect(() => {
        DisciplineValidation.validateDisciplineInput(input);
      }).toThrow('Team size must be at least 1');
    });
  });

  describe('prepareDisciplineForCreation', () => {
    it('should prepare timed discipline with correct comparison direction', () => {
      const input: CreateDisciplineInput = {
        seasonId: 'season-123',
        name: '100m Sprint',
        isTimed: true,
        isMeasured: false,
      };

      const result = DisciplineValidation.prepareDisciplineForCreation(input);

      expect(result).toEqual({
        ...input,
        isSmallerBetter: true, // Smaller is better for timed events
      });
    });

    it('should prepare measured discipline with correct comparison direction', () => {
      const input: CreateDisciplineInput = {
        seasonId: 'season-123',
        name: 'Shot Put',
        isTimed: false,
        isMeasured: true,
      };

      const result = DisciplineValidation.prepareDisciplineForCreation(input);

      expect(result).toEqual({
        ...input,
        isSmallerBetter: false, // Larger is better for measured events
      });
    });

    it('should prepare team discipline with team size', () => {
      const input: CreateDisciplineInput = {
        seasonId: 'season-123',
        name: '4x100m Relay',
        isTimed: true,
        isMeasured: false,
        teamSize: 4,
      };

      const result = DisciplineValidation.prepareDisciplineForCreation(input);

      expect(result).toEqual({
        ...input,
        isSmallerBetter: true,
      });
      expect(result.teamSize).toBe(4);
    });

    it('should throw error for invalid input', () => {
      const input: CreateDisciplineInput = {
        seasonId: '',
        name: '100m Sprint',
        isTimed: true,
        isMeasured: false,
      };

      expect(() => {
        DisciplineValidation.prepareDisciplineForCreation(input);
      }).toThrow('Season ID is required');
    });
  });
});

describe('SeasonValidation', () => {
  describe('validateSeasonInput', () => {
    it('should pass with valid season input', () => {
      const input: CreateSeasonInput = {
        name: 'Track & Field',
        description: 'Outdoor track and field season',
      };

      expect(() => {
        SeasonValidation.validateSeasonInput(input);
      }).not.toThrow();
    });

    it('should pass with name only', () => {
      const input: CreateSeasonInput = {
        name: 'Track & Field',
      };

      expect(() => {
        SeasonValidation.validateSeasonInput(input);
      }).not.toThrow();
    });

    it('should throw error when name is missing', () => {
      const input: CreateSeasonInput = {
        name: '',
      };

      expect(() => {
        SeasonValidation.validateSeasonInput(input);
      }).toThrow('Season name is required');
    });

    it('should throw error when name is only whitespace', () => {
      const input: CreateSeasonInput = {
        name: '   ',
      };

      expect(() => {
        SeasonValidation.validateSeasonInput(input);
      }).toThrow('Season name is required');
    });

    it('should throw error when name exceeds 64 characters', () => {
      const longName = 'A'.repeat(65);
      const input: CreateSeasonInput = {
        name: longName,
      };

      expect(() => {
        SeasonValidation.validateSeasonInput(input);
      }).toThrow('Season name cannot exceed 64 characters');
    });

    it('should accept name at 64 characters exactly', () => {
      const exactLengthName = 'A'.repeat(64);
      const input: CreateSeasonInput = {
        name: exactLengthName,
      };

      expect(() => {
        SeasonValidation.validateSeasonInput(input);
      }).not.toThrow();
    });
  });
});
