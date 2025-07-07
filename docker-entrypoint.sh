#!/bin/bash
set -e

echo "🔄 Starting database migration process..."

# Wait for the database to be ready
echo "⏳ Waiting for database to be ready..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
  echo "🔄 Attempt $attempt/$max_attempts - Testing database connection..."
  
  if npx prisma db push --accept-data-loss; then
    echo "✅ Database migration completed successfully!"
    break
  else
    echo "❌ Migration failed on attempt $attempt, error details above"
    if [ $attempt -eq $max_attempts ]; then
      echo "💥 Failed to migrate database after $max_attempts attempts"
      exit 1
    fi
    echo "⏳ Waiting 3 seconds before retry..."
    sleep 3
    attempt=$((attempt + 1))
  fi
done

# Start the Next.js application
echo "🚀 Starting Next.js application..."
exec "$@" 