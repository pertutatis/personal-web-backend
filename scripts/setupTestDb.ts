import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const TEST_CONFIG_ARTICLES = {
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres'
};

const TEST_CONFIG_BOOKS = {
  host: 'localhost',
  port: 5433,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres'
};

async function setupTestDatabases() {
  // Inicializar base de datos de artículos
  const articlesPool = new Pool(TEST_CONFIG_ARTICLES);

  try {
    // Drop y create de la base de datos de artículos
    await articlesPool.query('DROP DATABASE IF EXISTS test_articles');
    await articlesPool.query('CREATE DATABASE test_articles');
    await articlesPool.end();

    // Configurar la base de datos de artículos
    const articlesDbPool = new Pool({
      ...TEST_CONFIG_ARTICLES,
      database: 'test_articles'
    });

    // Inicializar esquema base
    const articlesSchema = readFileSync(
      join(__dirname, '../databases/articles.sql'),
      'utf-8'
    );
    await articlesDbPool.query(articlesSchema);

    // Añadir related_links y slug
    const relatedLinksAndSlugMigration = readFileSync(
      join(__dirname, '../databases/migrations/004-add-related-links-and-slug-to-articles.sql'),
      'utf-8'
    );
    await articlesDbPool.query(relatedLinksAndSlugMigration);

    await articlesDbPool.end();

    // Inicializar base de datos de libros
    const booksPool = new Pool(TEST_CONFIG_BOOKS);

    // Drop y create de la base de datos de libros
    await booksPool.query('DROP DATABASE IF EXISTS test_books');
    await booksPool.query('CREATE DATABASE test_books');
    await booksPool.end();

    // Inicializar esquema de libros
    const booksSchema = readFileSync(
      join(__dirname, '../databases/books.sql'),
      'utf-8'
    );

    const booksDbPool = new Pool({
      ...TEST_CONFIG_BOOKS,
      database: 'test_books'
    });

    await booksDbPool.query(booksSchema);
    await booksDbPool.end();

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
