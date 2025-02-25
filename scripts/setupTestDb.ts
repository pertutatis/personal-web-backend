import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const TEST_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres'
};

async function setupTestDatabases() {
  const pool = new Pool(TEST_CONFIG);

  try {
    // Drop test databases if they exist
    await pool.query('DROP DATABASE IF EXISTS test_articles');
    await pool.query('DROP DATABASE IF EXISTS test_books');

    // Create test databases
    await pool.query('CREATE DATABASE test_articles');
    await pool.query('CREATE DATABASE test_books');

    // Close connection to postgres database
    await pool.end();

    // Read SQL schemas
    const articlesSchema = readFileSync(
      join(__dirname, '../databases/articles.sql'),
      'utf-8'
    );
    
    const booksSchema = readFileSync(
      join(__dirname, '../databases/books.sql'),
      'utf-8'
    );

    // Initialize articles schema
    const articlesPool = new Pool({
      ...TEST_CONFIG,
      database: 'test_articles'
    });

    await articlesPool.query(articlesSchema);
    await articlesPool.end();

    // Initialize books schema
    const booksPool = new Pool({
      ...TEST_CONFIG,
      database: 'test_books'
    });

    await booksPool.query(booksSchema);
    await booksPool.end();

    console.log('✅ Test databases created and initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up test databases:', error);
    process.exit(1);
  }
}

setupTestDatabases().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
