/**
 * Test Fixtures for Club Management BDD Scenarios
 *
 * Provides structured test data and setup utilities for club management testing
 */

export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TestClub {
  name: string;
  description?: string;
}

export interface ClubTestData {
  singleClubUser: TestUser & { club: TestClub };
  multiClubUser: TestUser & { clubs: TestClub[] };
  unauthorizedUser: TestUser & { club: TestClub };
  testClubs: TestClub[];
}

/**
 * Primary test data for club management scenarios
 * Uses existing seed data users and clubs for consistent testing
 */
export const clubTestData: ClubTestData = {
  singleClubUser: {
    email: 'sarah.athlete@trackrecord.dev',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Athlete',
    club: {
      name: 'Metro Runners',
      description: 'Community-focused running club for all skill levels',
    },
  },

  multiClubUser: {
    email: 'admin@trackrecord.dev',
    password: 'password123',
    firstName: 'Track',
    lastName: 'Admin',
    clubs: [
      {
        name: 'Elite Athletics Club',
        description: 'Premier track and field club for competitive athletes',
      },
      {
        name: 'Metro Runners',
        description: 'Community-focused running club for all skill levels',
      },
    ],
  },

  unauthorizedUser: {
    email: 'lisa.runner@trackrecord.dev',
    password: 'password123',
    firstName: 'Lisa',
    lastName: 'Runner',
    club: {
      name: 'Peak Performance Academy',
      description: 'High-performance training facility',
    },
  },

  testClubs: [
    {
      name: 'Elite Athletics Club',
      description: 'Premier track and field club for competitive athletes',
    },
    {
      name: 'Metro Runners',
      description: 'Community-focused running club for all skill levels',
    },
    {
      name: 'Peak Performance Academy',
      description: 'High-performance training facility',
    },
    {
      name: 'University Track Team',
      description: 'Collegiate track and field program',
    },
  ],
};

/**
 * Test athlete data for club isolation testing
 */
export interface TestAthlete {
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  clubName: string;
}

export const testAthletes: TestAthlete[] = [
  // Elite Athletics Club athletes
  {
    firstName: 'John',
    lastName: 'Elite',
    gender: 'M',
    clubName: 'Elite Athletics Club',
  },
  {
    firstName: 'Jane',
    lastName: 'Elite',
    gender: 'F',
    clubName: 'Elite Athletics Club',
  },

  // Metro Runners athletes
  {
    firstName: 'Mike',
    lastName: 'Runner',
    gender: 'M',
    clubName: 'Metro Runners',
  },
  {
    firstName: 'Anna',
    lastName: 'Runner',
    gender: 'F',
    clubName: 'Metro Runners',
  },
];

/**
 * Database seeding utilities for test setup
 * Uses the existing dev seeding endpoint for consistent data creation
 */
export class ClubTestDataSeeder {
  static async seedTestData(): Promise<void> {
    try {
      // Use the existing dev seeding endpoint
      const response = await fetch('http://localhost:3000/api/dev/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Seeding failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Test data seeded successfully:', result.message);
    } catch (error) {
      console.error('❌ Failed to seed test data:', error);
      throw error;
    }
  }

  static async cleanupTestData(): Promise<void> {
    // For now, we'll rely on the database being reset between test runs
    // In a production test environment, you might implement specific cleanup
    console.log('ℹ️ Test data cleanup - relying on test database reset');
  }

  static async createTestUser(userData: TestUser): Promise<void> {
    // Test users will be created via the registration flow in tests
    // This maintains consistency with the actual user registration process
    console.log(
      `ℹ️ Test user ${userData.email} will be created via registration flow`
    );
  }

  static async createTestClub(clubData: TestClub): Promise<void> {
    // Test clubs are created via the existing seeding process
    // This ensures consistency with the development environment
    console.log(
      `ℹ️ Test club ${clubData.name} will be created via seeding process`
    );
  }
}
