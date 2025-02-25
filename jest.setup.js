// Increase timeout for tests that need database access
jest.setTimeout(10000);

// Clean up database connections after all tests
afterAll(async () => {
  // Close all database connections
  const pools = global.__TEST_POOLS__;
  if (pools) {
    await Promise.all(
      Object.values(pools).map(pool => pool.end())
    );
  }
});

// Set test environment variables
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.ARTICLES_DB_NAME = 'test_articles';
process.env.ARTICLES_DB_USER = 'postgres';
process.env.ARTICLES_DB_PASSWORD = 'postgres';
process.env.BOOKS_DB_NAME = 'test_books';
process.env.BOOKS_DB_USER = 'postgres';
process.env.BOOKS_DB_PASSWORD = 'postgres';
