// Import dependencies
const { Logger } = require('./src/contexts/shared/infrastructure/Logger');
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
  DB_NAME: 'test_blog',
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
    const blogMigrations = new PostgresMigrations('test_blog')
    await blogMigrations.setup();

    // Wait for databases to be ready
    await TestHelper.waitForDatabases();
    Logger.info('✓ Database connections established and schemas created');
  } catch (error) {
    Logger.error('Failed to setup databases:', error);
    throw error;
  }
});

// Clean database before each test
beforeEach(async () => {
  try {
    await TestHelper.cleanAllDatabases();
  } catch (error) {
    Logger.error('Failed to clean databases:', error);
    throw error;
  }
});

// Clean up resources after all tests
afterAll(async () => {
  try {
    await TestHelper.closeConnections();
    Logger.info('✓ Database connections closed');
  } catch (error) {
    Logger.error('Failed to close database connections:', error);
    throw error;
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  Logger.error('Unhandled promise rejection:', error);
  process.exit(1);
});

// Make test helper globally available
global.TestHelper = TestHelper;
