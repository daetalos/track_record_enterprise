// Performance validation functions for athlete performance recording

import { z } from 'zod';
import { prisma } from '@/lib/db';
import {
  PerformanceCreateData,
  PerformanceUpdateData,
  PerformanceValidationResult,
  PerformanceValueValidation,
  DuplicatePerformanceCheck,
  TeamPerformanceValidation,
  PERFORMANCE_VALIDATION,
} from '@/types/performance';

// Zod schema for performance creation
export const PerformanceCreateSchema = z.object({
  athleteId: z.string().min(1, 'Athlete is required'),
  disciplineId: z.string().min(1, 'Discipline is required'),
  ageGroupId: z.string().min(1, 'Age group is required'),
  genderId: z.string().min(1, 'Gender is required'),
  medalId: z.string().optional(),
  timeSeconds: z
    .number()
    .min(PERFORMANCE_VALIDATION.MIN_TIME_SECONDS, 'Time must be greater than 0')
    .max(PERFORMANCE_VALIDATION.MAX_TIME_SECONDS, 'Time is unreasonably large')
    .optional(),
  distanceMeters: z
    .number()
    .min(
      PERFORMANCE_VALIDATION.MIN_DISTANCE_METERS,
      'Distance must be greater than 0'
    )
    .max(
      PERFORMANCE_VALIDATION.MAX_DISTANCE_METERS,
      'Distance is unreasonably large'
    )
    .optional(),
  date: z.string().refine(date => {
    const parsedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    return parsedDate <= today;
  }, 'Performance date cannot be in the future'),
  eventDetails: z
    .string()
    .min(1, 'Event details are required')
    .max(
      PERFORMANCE_VALIDATION.MAX_EVENT_DETAILS_LENGTH,
      'Event details are too long'
    ),
  proofFileUrl: z.string().url().optional(),
  proofFileName: z.string().optional(),
  teamMembers: z.array(z.string()).optional(),
});

// Zod schema for performance updates
export const PerformanceUpdateSchema = z.object({
  medalId: z.string().optional(),
  timeSeconds: z
    .number()
    .min(PERFORMANCE_VALIDATION.MIN_TIME_SECONDS)
    .max(PERFORMANCE_VALIDATION.MAX_TIME_SECONDS)
    .optional(),
  distanceMeters: z
    .number()
    .min(PERFORMANCE_VALIDATION.MIN_DISTANCE_METERS)
    .max(PERFORMANCE_VALIDATION.MAX_DISTANCE_METERS)
    .optional(),
  date: z
    .string()
    .refine(date => {
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return parsedDate <= today;
    }, 'Performance date cannot be in the future')
    .optional(),
  eventDetails: z
    .string()
    .min(1, 'Event details are required')
    .max(
      PERFORMANCE_VALIDATION.MAX_EVENT_DETAILS_LENGTH,
      'Event details are too long'
    )
    .optional(),
  proofFileUrl: z.string().url().optional(),
  proofFileName: z.string().optional(),
  teamMembers: z.array(z.string()).optional(),
});

/**
 * Validate performance value against discipline type
 */
export async function validatePerformanceValue(
  disciplineId: string,
  timeSeconds?: number,
  distanceMeters?: number,
  medalId?: string
): Promise<PerformanceValueValidation> {
  try {
    // Get discipline information
    const discipline = await prisma.discipline.findUnique({
      where: { id: disciplineId },
      select: {
        id: true,
        name: true,
        isTimed: true,
        isMeasured: true,
      },
    });

    if (!discipline) {
      return {
        isValid: false,
        hasTimeValue: !!timeSeconds,
        hasDistanceValue: !!distanceMeters,
        hasMedal: !!medalId,
        disciplineType: 'unknown',
        errors: ['Invalid discipline selected'],
      };
    }

    const hasTimeValue = timeSeconds !== undefined && timeSeconds !== null;
    const hasDistanceValue =
      distanceMeters !== undefined && distanceMeters !== null;
    const hasMedal =
      medalId !== undefined && medalId !== null && medalId !== '';
    const errors: string[] = [];

    let disciplineType: 'timed' | 'measured' | 'unknown' = 'unknown';
    if (discipline.isTimed) disciplineType = 'timed';
    else if (discipline.isMeasured) disciplineType = 'measured';

    // Must have either a performance value OR a medal (or both)
    if (!hasTimeValue && !hasDistanceValue && !hasMedal) {
      errors.push('Must provide either a performance value or a medal');
    }

    // Timed disciplines should only accept time values
    if (discipline.isTimed && hasDistanceValue) {
      errors.push('Timed disciplines cannot have distance values');
    }

    // Measured disciplines should only accept distance values
    if (discipline.isMeasured && hasTimeValue) {
      errors.push('Measured disciplines cannot have time values');
    }

    // If discipline is timed, time value should be provided (unless medal-only)
    if (discipline.isTimed && !hasTimeValue && !hasMedal) {
      errors.push('Timed disciplines require a time value or medal');
    }

    // If discipline is measured, distance value should be provided (unless medal-only)
    if (discipline.isMeasured && !hasDistanceValue && !hasMedal) {
      errors.push('Measured disciplines require a distance value or medal');
    }

    return {
      isValid: errors.length === 0,
      hasTimeValue,
      hasDistanceValue,
      hasMedal,
      disciplineType,
      errors,
    };
  } catch (error) {
    console.error('Error validating performance value:', error);
    return {
      isValid: false,
      hasTimeValue: !!timeSeconds,
      hasDistanceValue: !!distanceMeters,
      hasMedal: !!medalId,
      disciplineType: 'unknown',
      errors: ['Failed to validate performance value'],
    };
  }
}

/**
 * Check for duplicate performance
 */
export async function checkDuplicatePerformance(
  data: DuplicatePerformanceCheck
): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingPerformance = await (prisma as any).performance.findFirst({
      where: {
        athleteId: data.athleteId,
        disciplineId: data.disciplineId,
        ageGroupId: data.ageGroupId,
        genderId: data.genderId,
        date: new Date(data.date),
        eventDetails: data.eventDetails,
        ...(data.excludeId && { NOT: { id: data.excludeId } }),
      },
    });

    return !!existingPerformance;
  } catch (error) {
    console.error('Error checking duplicate performance:', error);
    return false;
  }
}

/**
 * Validate timed discipline performance
 */
export function validateTimedDiscipline(
  timeSeconds: number
): PerformanceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (timeSeconds < PERFORMANCE_VALIDATION.MIN_TIME_SECONDS) {
    errors.push('Time must be greater than 0.01 seconds');
  }

  if (timeSeconds > PERFORMANCE_VALIDATION.MAX_TIME_SECONDS) {
    errors.push('Time cannot exceed 24 hours');
  }

  // Warning for unreasonably fast times
  if (timeSeconds < 1.0) {
    warnings.push('This time seems very fast. Please confirm it is correct.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate measured discipline performance
 */
export function validateMeasuredDiscipline(
  distanceMeters: number
): PerformanceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (distanceMeters < PERFORMANCE_VALIDATION.MIN_DISTANCE_METERS) {
    errors.push('Distance must be greater than 0.01 meters');
  }

  if (distanceMeters > PERFORMANCE_VALIDATION.MAX_DISTANCE_METERS) {
    errors.push('Distance cannot exceed 10,000 meters');
  }

  // Warning for unreasonably large distances
  if (distanceMeters > 1000) {
    warnings.push(
      'This distance seems very large. Please confirm it is correct.'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate team performance
 */
export async function validateTeamPerformance(
  disciplineId: string,
  teamMembers?: string[]
): Promise<TeamPerformanceValidation> {
  try {
    // Get discipline information
    const discipline = await prisma.discipline.findUnique({
      where: { id: disciplineId },
      select: {
        id: true,
        name: true,
        teamSize: true,
      },
    });

    if (!discipline) {
      return {
        isValid: false,
        requiredTeamSize: 0,
        providedTeamSize: 0,
        errors: ['Invalid discipline selected'],
      };
    }

    const requiredTeamSize = discipline.teamSize || 0;
    const providedTeamSize = teamMembers?.length || 0;
    const errors: string[] = [];

    // If discipline has team size requirement
    if (requiredTeamSize > 0) {
      if (!teamMembers || teamMembers.length === 0) {
        errors.push(
          `Team discipline "${discipline.name}" requires ${requiredTeamSize} team members`
        );
      } else if (teamMembers.length !== requiredTeamSize) {
        errors.push(
          `Team discipline "${discipline.name}" requires exactly ${requiredTeamSize} team members, but ${teamMembers.length} were provided`
        );
      }

      // Check for duplicate team members
      const uniqueMembers = new Set(teamMembers);
      if (uniqueMembers.size !== teamMembers?.length) {
        errors.push('Team members must be unique');
      }
    } else {
      // Individual discipline should not have team members
      if (teamMembers && teamMembers.length > 0) {
        errors.push(
          `Individual discipline "${discipline.name}" cannot have team members`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      requiredTeamSize,
      providedTeamSize,
      errors,
    };
  } catch (error) {
    console.error('Error validating team performance:', error);
    return {
      isValid: false,
      requiredTeamSize: 0,
      providedTeamSize: 0,
      errors: ['Failed to validate team performance'],
    };
  }
}

/**
 * Validate medal assignment
 */
export async function validateMedalAssignment(
  medalId: string
): Promise<PerformanceValidationResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const medal = await (prisma as any).medal.findUnique({
      where: { id: medalId },
    });

    if (!medal) {
      return {
        isValid: false,
        errors: ['Invalid medal selected'],
        warnings: [],
      };
    }

    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  } catch (error) {
    console.error('Error validating medal assignment:', error);
    return {
      isValid: false,
      errors: ['Failed to validate medal assignment'],
      warnings: [],
    };
  }
}

/**
 * Comprehensive performance validation
 */
export async function validatePerformanceData(
  data: PerformanceCreateData | PerformanceUpdateData
): Promise<PerformanceValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Validate performance value against discipline
    if ('disciplineId' in data) {
      const valueValidation = await validatePerformanceValue(
        data.disciplineId,
        data.timeSeconds,
        data.distanceMeters,
        data.medalId
      );
      errors.push(...valueValidation.errors);
    }

    // Validate team performance
    if ('disciplineId' in data && data.teamMembers) {
      const teamValidation = await validateTeamPerformance(
        data.disciplineId,
        data.teamMembers
      );
      errors.push(...teamValidation.errors);
    }

    // Validate medal assignment
    if (data.medalId) {
      const medalValidation = await validateMedalAssignment(data.medalId);
      errors.push(...medalValidation.errors);
      warnings.push(...medalValidation.warnings);
    }

    // Validate timed discipline
    if (data.timeSeconds !== undefined) {
      const timedValidation = validateTimedDiscipline(data.timeSeconds);
      errors.push(...timedValidation.errors);
      warnings.push(...timedValidation.warnings);
    }

    // Validate measured discipline
    if (data.distanceMeters !== undefined) {
      const measuredValidation = validateMeasuredDiscipline(
        data.distanceMeters
      );
      errors.push(...measuredValidation.errors);
      warnings.push(...measuredValidation.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    console.error('Error validating performance data:', error);
    return {
      isValid: false,
      errors: ['Failed to validate performance data'],
      warnings: [],
    };
  }
}

/**
 * Validate file upload
 */
export function validateProofFile(file: File): PerformanceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file size
  if (file.size > PERFORMANCE_VALIDATION.MAX_PROOF_FILE_SIZE) {
    errors.push('Proof file size cannot exceed 10MB');
  }

  // Check file type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (
    !PERFORMANCE_VALIDATION.ALLOWED_PROOF_FILE_TYPES.includes(file.type as any)
  ) {
    errors.push('Proof file must be an image (JPEG, PNG, GIF, or WebP)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
