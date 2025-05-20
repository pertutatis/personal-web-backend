#!/bin/bash
set -e

echo "🧹 Cleaning up previous environment..."
rm -rf .next
npm run test:clean

echo "🔧 Setting up test environment..."
# Configurar variables de entorno para tests
export NODE_ENV=test # Usar test para que se use la configuración de test
export LOG_LEVEL=debug
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=postgres
export PORT=3000
export JWT_SECRET=test_secret
export JWT_EXPIRES_IN=3600
export AUTH_DB_NAME=auth_test
export ARTICLES_DB_NAME=test_articles
export BOOKS_DB_NAME=test_books

# Display current environment
echo "📋 Environment variables:"
echo "NODE_ENV=$NODE_ENV"
echo "JWT_SECRET=$JWT_SECRET"
echo "JWT_EXPIRES_IN=$JWT_EXPIRES_IN"
echo "DB_HOST=$DB_HOST"
echo "DB_PORT=$DB_PORT"
echo "AUTH_DB_NAME=$AUTH_DB_NAME"
echo "ARTICLES_DB_NAME=$ARTICLES_DB_NAME"
echo "BOOKS_DB_NAME=$BOOKS_DB_NAME"

echo "🔧 Setting up test databases..."
NODE_ENV=test ts-node tests/e2e/setup/setupTestDb.ts

echo "🚀 Starting development server..."
# Iniciar el servidor en modo desarrollo
NODE_ENV=test env-cmd -f .env.test npm run dev &

SERVER_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
until $(curl --output /dev/null --silent --head --fail http://localhost:3000/api/health); do
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
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000 \
NODE_ENV=test \
JWT_SECRET=test_secret \
JWT_EXPIRES_IN=1h \
npx playwright test

# Store the test exit code
TEST_EXIT_CODE=$?

echo "🧹 Cleaning up..."

# Kill any process using port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Kill the server process
kill $SERVER_PID 2>/dev/null || true

# Set up trap to clean up on exit
trap "lsof -ti:3000 | xargs kill -9 2>/dev/null || true; kill $SERVER_PID 2>/dev/null || true" EXIT

exit $TEST_EXIT_CODE
