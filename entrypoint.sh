#!/bin/bash
set -e

echo "Starting database migration process..."

# Wait for database to be ready and run migration
npx prisma db push --accept-data-loss

echo "Database migration completed successfully!"

# Run database seeding for development
if [ "$NODE_ENV" != "production" ]; then
  echo "Running database seeding for development..."
  npm run db:seed
  echo "Database seeding completed!"
else
  echo "Skipping database seeding in production environment"
fi

# Start the Next.js application
echo "Starting Next.js application..."
exec "$@" 