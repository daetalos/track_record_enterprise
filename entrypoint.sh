#!/bin/bash
set -e

echo "Starting database migration process..."

# Wait for database to be ready and run migration
npx prisma db push --accept-data-loss

echo "Database migration completed successfully!"

# Start the Next.js application
echo "Starting Next.js application..."
exec "$@" 