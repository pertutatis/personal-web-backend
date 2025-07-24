#!/bin/bash
set -e

echo "Setting up test environment..."

# Setup articles database
echo "Setting up articles database..."
ts-node scripts/setupTestDb.ts articles test_blog

# Run migrations
echo "Running migrations..."
ts-node scripts/verify-test-env.ts

echo "Test environment setup completed"
