#!/bin/bash
set -e

echo "Setting up test environment..."

# Setup auth database
echo "Setting up auth database..."
ts-node scripts/setupAuthDb.ts

# Setup articles database
echo "Setting up articles database..."
ts-node scripts/setupTestDb.ts articles test_articles

# Setup books database
echo "Setting up books database..."
ts-node scripts/setupTestDb.ts books test_books

# Run migrations
echo "Running migrations..."
ts-node scripts/verify-test-env.ts

echo "Test environment setup completed"
