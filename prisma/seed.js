/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const prisma = new PrismaClient();

// Only allow seeding in development
const isDevelopment = process.env.NODE_ENV === 'development';

// Load and validate seed data from YAML file
const loadSeedData = () => {
  try {
    const seedFilePath = path.join(__dirname, 'seed-data.yaml');
    const fileContents = fs.readFileSync(seedFilePath, 'utf8');
    const data = yaml.load(fileContents);

    // Basic validation
    if (!data.clubs || !data.users || !data.relationships) {
      throw new Error('Invalid seed data structure: missing required sections');
    }

    if (!data.seasons) {
      throw new Error('Invalid seed data structure: missing seasons section');
    }

    if (data.seasons.length === 0) {
      throw new Error('Seed data must contain at least one season');
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
      `📄 Loaded seed data v${data.metadata.version}: ${data.seasons.length} seasons, ${data.clubs.length} clubs, ${data.users.length} users, ${data.relationships.length} relationships`
    );
    return data;
  } catch (error) {
    console.error('❌ Failed to load seed data:', error);
    throw new Error(`Failed to load seed data: ${error.message}`);
  }
};

async function main() {
  // Security check - only allow in development
  if (!isDevelopment) {
    console.log(
      '⚠️  Seeding skipped - only allowed in development environment'
    );
    return;
  }

  console.log('🌱 Starting database seeding...');

  // Check if data already exists (idempotent)
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('📊 Database already contains data, skipping seed');
    console.log(`   Found ${existingUsers} existing users`);
    return;
  }

  // Load seed configuration
  const seedData = loadSeedData();

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 12);
  console.log('🔐 Generated password hash');

  // Create gender data (system-wide data)
  console.log('⚧ Creating gender data...');
  const genders = await Promise.all([
    prisma.gender.upsert({
      where: { name: 'Male' },
      update: {},
      create: {
        name: 'Male',
        initial: 'M',
      },
    }),
    prisma.gender.upsert({
      where: { name: 'Female' },
      update: {},
      create: {
        name: 'Female',
        initial: 'F',
      },
    }),
  ]);
  console.log(`✅ Created/verified ${genders.length} gender entries`);

  // Create seasons from YAML data
  console.log('🏃‍♂️ Creating seasons...');
  const seasons = await Promise.all(
    seedData.seasons.map(seasonData =>
      prisma.season.upsert({
        where: { name: seasonData.name },
        update: {
          description: seasonData.description,
        },
        create: {
          name: seasonData.name,
          description: seasonData.description,
        },
      })
    )
  );
  console.log(`✅ Created/verified ${seasons.length} seasons`);

  // Create clubs from YAML data
  console.log('🏃 Creating clubs...');
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
  console.log(`✅ Created ${clubs.length} clubs`);

  // Create users from YAML data
  console.log('👥 Creating users...');
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
  console.log(`✅ Created ${users.length} users`);

  // Create user-club relationships from YAML data
  console.log('🔗 Creating user-club relationships...');
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
  console.log(`✅ Created ${relationships.length} user-club relationships`);

  // Print summary
  console.log('\n📋 Seed Data Summary:');
  console.log(`   ⚧ Genders: ${genders.length}`);
  console.log(`   🏃‍♂️ Seasons: ${seasons.length}`);
  console.log(`   🏃 Clubs: ${clubs.length}`);
  console.log(`   👥 Users: ${users.length}`);
  console.log(`   🔗 Relationships: ${relationships.length}`);

  console.log('\n🔑 Test Accounts:');
  seedData.users.forEach(user => {
    console.log(
      `   📧 ${user.email} (password: password123) - ${user.role_description}`
    );
  });

  console.log('\n✅ Database seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
