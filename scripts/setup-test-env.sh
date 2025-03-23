#!/bin/bash
set -e

echo "🔧 Setting up test environment..."

# Limpiar procesos previos
echo "🧹 Cleaning up previous processes..."
pkill -f "next start" || true
lsof -ti:3000 | xargs kill -9 || true

# Inicializar bases de datos de prueba
echo "📦 Setting up test databases..."
npx ts-node scripts/setupTestDb.ts

# Construir la aplicación Next.js
echo "🏗️ Building Next.js application..."
npm run build

# Copiar variables de entorno para los tests
echo "🔑 Setting up test environment variables..."
cp .env.test .env.local

echo "✅ Test environment setup complete!"
