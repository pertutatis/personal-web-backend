// Import dependencies
const { TestHelper } = require('./src/contexts/shared/infrastructure/__tests__/TestHelper');
const { PostgresMigrations } = require('./src/contexts/shared/infrastructure/PostgresMigrations');
const fs = require('fs');
const path = require('path');

// Setup default test environment variables
const defaultEnv = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'postgres',
  DB_PASSWORD: 'postgres',
  BLOG_DB_NAME: 'test_articles',
  AUTH_DB_NAME: 'auth_test',
  NODE_ENV: { value: 'test', writable: true },
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
    const blogMigrations = new PostgresMigrations('test_articles')
    // const booksMigrations = new PostgresMigrations('test_books')
    const authMigrations = new PostgresMigrations('auth_test')

    await Promise.all([
      blogMigrations.setup(),
      authMigrations.setup()
    ])

    // Wait for databases to be ready
    await TestHelper.waitForDatabases();
    console.log('✓ Database connections established and schemas created');
  } catch (error) {
    console.error('Failed to setup databases:', error);
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
