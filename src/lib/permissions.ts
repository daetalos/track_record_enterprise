import { ClubRole } from '@prisma/client';
import { getUserClubRole } from './db';

/**
 * Check if user role allows age group management
 * Only ADMIN and OWNER roles can manage age groups
 */
export const canManageAgeGroups = (userRole: ClubRole): boolean => {
  return userRole === 'ADMIN' || userRole === 'OWNER';
};

/**
 * Check if user role allows athlete creation
 * All authenticated club members can create athletes
 */
export const canCreateAthletes = (userRole: ClubRole): boolean => {
  return userRole === 'ADMIN' || userRole === 'OWNER' || userRole === 'MEMBER';
};

/**
 * Verify user has permission to manage age groups for a specific club
 */
export const verifyAgeGroupManagementPermission = async (
  userId: string,
  clubId: string
): Promise<{ hasPermission: boolean; userRole?: ClubRole; error?: string }> => {
  try {
    const userRole = await getUserClubRole(userId, clubId);

    if (!userRole) {
      return {
        hasPermission: false,
        error: 'User does not have access to this club',
      };
    }

    const hasPermission = canManageAgeGroups(userRole);

    return {
      hasPermission,
      userRole,
      error: hasPermission
        ? undefined
        : 'Insufficient permissions for age group management',
    };
  } catch (error) {
    console.error('Error verifying age group management permission:', error);
    return {
      hasPermission: false,
      error: 'Failed to verify permissions',
    };
  }
};

/**
 * Verify user has permission to create/edit athletes for a specific club
 */
export const verifyAthleteManagementPermission = async (
  userId: string,
  clubId: string
): Promise<{ hasPermission: boolean; userRole?: ClubRole; error?: string }> => {
  try {
    const userRole = await getUserClubRole(userId, clubId);

    if (!userRole) {
      return {
        hasPermission: false,
        error: 'User does not have access to this club',
      };
    }

    const hasPermission = canCreateAthletes(userRole);

    return {
      hasPermission,
      userRole,
      error: hasPermission
        ? undefined
        : 'Insufficient permissions for athlete management',
    };
  } catch (error) {
    console.error('Error verifying athlete management permission:', error);
    return {
      hasPermission: false,
      error: 'Failed to verify permissions',
    };
  }
};
