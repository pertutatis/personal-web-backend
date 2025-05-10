#!/bin/bash
set -e

echo "🧹 Cleaning up previous environment..."
npm run test:clean

echo "🔧 Setting up test environment..."
export NODE_ENV=test
export LOG_LEVEL=debug
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=postgres
export PORT=3000

echo "🏗️ Building application..."
npm run build

echo "🚀 Starting server..."
NODE_ENV=test npx next start &
SERVER_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
until $(curl --output /dev/null --silent --fail http://localhost:3000/api/health); do
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "❌ Server failed to start after $MAX_RETRIES attempts"
        kill $SERVER_PID
        exit 1
    fi
    RETRY_COUNT=$((RETRY_COUNT+1))
    echo "Attempt $RETRY_COUNT of $MAX_RETRIES: Server not ready yet..."
    sleep 2
done

echo "✅ Server is ready"

echo "🚀 Starting tests..."
DEBUG=pw:api*,app:* NODE_OPTIONS='--inspect' NODE_ENV=test playwright test "$@"

# Store the test exit code
TEST_EXIT_CODE=$?

echo "🧹 Cleaning up..."
kill $SERVER_PID 2>/dev/null || true
trap "kill $SERVER_PID 2>/dev/null || true" EXIT

# Check if we're running in debug mode
if [[ "$*" == *"--debug"* ]]; then
  echo "🔍 Debug mode enabled"
  # Keep the server running for debugging
  echo "Press Ctrl+C to quit..."
  wait
else
  # Exit with the test exit code
  exit $TEST_EXIT_CODE
fi
