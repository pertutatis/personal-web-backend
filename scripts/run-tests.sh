#!/bin/bash
set -e

echo "🧹 Cleaning up previous environment..."
pkill -f "next" || true
rm -rf .next || true
rm -rf test-results playwright-report || true
find . -name "*.log" -type f -delete

echo "🔧 Setting up test environment..."
NODE_ENV=test npm run test:clean
NODE_ENV=test npm run test:verify

# Asegurarnos de que tenemos las variables de entorno correctas
echo "🔑 Setting up environment variables..."
if [ ! -f ".env.test" ]; then
  echo "❌ .env.test file not found"
  exit 1
fi

cp .env.test .env.local

echo "🏗️ Building application..."
NODE_ENV=test NEXT_RUNTIME=nodejs npm run build

echo "🚀 Starting server in development mode..."
DEBUG=* NODE_ENV=test NODE_OPTIONS='--inspect' npm run dev > server.log 2>&1 &
SERVER_PID=$!

# Función para limpiar al salir
cleanup() {
  echo "🧹 Cleaning up..."
  if [ -n "$SERVER_PID" ]; then
    echo "Stopping server (PID: $SERVER_PID)..."
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
  fi
  rm -f server.log
  rm -f .env.local
  exit ${1:-0}
}

trap cleanup EXIT INT TERM

echo "⏳ Waiting for server to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

while ! curl -s http://localhost:3000/api/blog/articles > /dev/null; do
  if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Server failed to start after $MAX_RETRIES attempts"
    echo "Last server logs:"
    tail -n 50 server.log
    cleanup 1
  fi
  echo "Waiting for server... ($(($RETRY_COUNT + 1))/$MAX_RETRIES)"
  if [ $RETRY_COUNT -eq 0 ]; then
    echo "Initial server logs:"
    tail -n 10 server.log
  fi
  sleep 1
  RETRY_COUNT=$((RETRY_COUNT + 1))
done

echo "✅ Server is ready!"

echo "🧪 Running E2E tests..."
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000 \
NODE_ENV=test \
DEBUG=pw:api \
npx playwright test

TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -ne 0 ]; then
  echo "❌ Tests failed"
  echo "Last server logs:"
  tail -n 50 server.log
fi

cleanup $TEST_EXIT_CODE
