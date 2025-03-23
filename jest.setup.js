// Import test helper
const { TestHelper } = require('./src/contexts/shared/infrastructure/__tests__/TestHelper');
const fs = require('fs');
const path = require('path');

// Setup default test environment variables
const defaultEnv = {
  DB_HOST: 'localhost',
  ARTICLES_DB_PORT: '5432',
  ARTICLES_DB_NAME: 'test_articles',
  ARTICLES_DB_USER: 'postgres',
  ARTICLES_DB_PASSWORD: 'postgres',
  BOOKS_DB_PORT: '5433',
  BOOKS_DB_NAME: 'test_books',
  BOOKS_DB_USER: 'postgres',
  BOOKS_DB_PASSWORD: 'postgres'
};

// Load environment variables from .env.test if it exists
const envPath = path.join(__dirname, '.env.test');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  // Set default environment variables if .env.test doesn't exist
  Object.entries(defaultEnv).forEach(([key, value]) => {
    process.env[key] = process.env[key] || value;
  });
}

// Increase timeout for tests that need database access
jest.setTimeout(30000);

// Setup global beforeAll
beforeAll(async () => {
  try {
    // Wait for databases to be ready
    await TestHelper.waitForDatabases();
    // console.log('✓ Database connections established');
  } catch (error) {
    console.error('Failed to connect to databases:', error);
    throw error;
  }
});

// Clean database before each test
beforeEach(async () => {
  try {
    await TestHelper.cleanAllDatabases();
  } catch (error) {
    console.error('Failed to clean databases:', error);
    throw error;
  }
});

// Clean up resources after all tests
afterAll(async () => {
  try {
    await TestHelper.closeConnections();
    // console.log('✓ Database connections closed');
  } catch (error) {
    console.error('Failed to close database connections:', error);
    throw error;
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

// Make test helper globally available
global.TestHelper = TestHelper;
