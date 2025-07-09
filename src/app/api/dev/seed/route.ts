import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { ClubRole } from '@prisma/client';

// Only allow seeding in development
const isDevelopment = process.env.NODE_ENV === 'development';

// Types for seed data structure
interface SeedClub {
  name: string;
  description: string;
}

interface SeedUser {
  name: string;
  email: string;
  role_description: string;
}

interface SeedRelationship {
  user_index: number;
  club_index: number;
  role: ClubRole;
}

interface SeedData {
  metadata: {
    version: string;
    description: string;
    lastUpdated: string;
  };
  clubs: SeedClub[];
  users: SeedUser[];
  relationships: SeedRelationship[];
}

// Load and validate seed data from YAML file
const loadSeedData = (): SeedData => {
  try {
    const seedFilePath = path.join(process.cwd(), 'prisma', 'seed-data.yaml');
    const fileContents = fs.readFileSync(seedFilePath, 'utf8');
    const data = yaml.load(fileContents) as SeedData;

    // Basic validation
    if (!data.clubs || !data.users || !data.relationships) {
      throw new Error('Invalid seed data structure: missing required sections');
    }

    if (data.clubs.length === 0) {
      throw new Error('Seed data must contain at least one club');
    }

    if (data.users.length === 0) {
      throw new Error('Seed data must contain at least one user');
    }

    // Validate relationships reference valid indices
    for (const rel of data.relationships) {
      if (rel.user_index >= data.users.length || rel.user_index < 0) {
        throw new Error(
          `Invalid user_index ${rel.user_index} in relationships`
        );
      }
      if (rel.club_index >= data.clubs.length || rel.club_index < 0) {
        throw new Error(
          `Invalid club_index ${rel.club_index} in relationships`
        );
      }
      if (!['OWNER', 'ADMIN', 'COACH', 'MEMBER'].includes(rel.role)) {
        throw new Error(`Invalid role ${rel.role} in relationships`);
      }
    }

    console.log(
      `📄 Loaded seed data v${data.metadata.version}: ${data.clubs.length} clubs, ${data.users.length} users, ${data.relationships.length} relationships`
    );
    return data;
  } catch (error) {
    console.error('❌ Failed to load seed data:', error);
    throw new Error(
      `Failed to load seed data: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export async function POST() {
  // Security check - only allow in development
  if (!isDevelopment) {
    return NextResponse.json(
      { error: 'Seeding only allowed in development' },
      { status: 403 }
    );
  }

  try {
    console.log('🌱 Starting database seeding...');

    // Check if data already exists (idempotent)
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log('📊 Database already contains data, skipping seed');
      return NextResponse.json({
        message: 'Database already seeded',
        existingUsers,
        skipped: true,
      });
    }

    // Load seed configuration
    const seedData = loadSeedData();

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 12);
    console.log('🔐 Generated password hash');

    // Create clubs from YAML data
    const clubs = await Promise.all(
      seedData.clubs.map(clubData =>
        prisma.club.create({
          data: {
            name: clubData.name,
            description: clubData.description,
          },
        })
      )
    );

    console.log(`🏃 Created ${clubs.length} clubs`);

    // Create users from YAML data
    const users = await Promise.all(
      seedData.users.map(userData =>
        prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            accounts: {
              create: {
                type: 'credentials',
                provider: 'credentials',
                providerAccountId: userData.email,
                refresh_token: hashedPassword,
              },
            },
          },
        })
      )
    );

    console.log(`👥 Created ${users.length} users`);

    // Create user-club relationships from YAML data
    const relationships = await Promise.all(
      seedData.relationships.map(relData =>
        prisma.userClub.create({
          data: {
            userId: users[relData.user_index].id,
            clubId: clubs[relData.club_index].id,
            role: relData.role,
          },
        })
      )
    );

    console.log(`🔗 Created ${relationships.length} user-club relationships`);

    const summary = {
      message: 'Database seeded successfully',
      seedVersion: seedData.metadata.version,
      created: {
        clubs: clubs.length,
        users: users.length,
        relationships: relationships.length,
      },
      testAccounts: seedData.users.map(user => ({
        email: user.email,
        password: 'password123',
        role: user.role_description,
      })),
    };

    console.log('✅ Database seeding completed successfully');
    console.log(
      `📋 Summary: ${summary.created.users} users, ${summary.created.clubs} clubs, ${summary.created.relationships} relationships`
    );

    return NextResponse.json(summary);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return NextResponse.json(
      {
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
