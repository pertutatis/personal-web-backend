import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'

type StringValue = { toString(): string }

export class PostgresTestSetup {
  static readonly TEST_CONFIG = {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: Number(process.env.TEST_DB_PORT) || 5432,
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
    database: 'postgres'
  }

  static async setupTestDatabases(): Promise<void> {
    try {
      // Setup Auth Database
      const authPool = new Pool(this.TEST_CONFIG)
      await this.runQuery(authPool, 'DROP DATABASE IF EXISTS auth_test')
      await this.runQuery(authPool, 'CREATE DATABASE auth_test')
      await authPool.end()

      // Configurar esquema de auth
      const authDbPool = new Pool({
        ...this.TEST_CONFIG,
        database: 'auth_test'
      })

      const authSchema = `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
      `
      await authDbPool.query(authSchema)
      await authDbPool.end()

      // Setup Articles Database
      const articlesPool = new Pool(this.TEST_CONFIG)
      await this.runQuery(articlesPool, 'DROP DATABASE IF EXISTS test_articles')
      await this.runQuery(articlesPool, 'CREATE DATABASE test_articles')
      await articlesPool.end()

      const articlesDbPool = new Pool({
        ...this.TEST_CONFIG,
        database: 'test_articles'
      })

      const articlesSchema = readFileSync(
        join(__dirname, '../databases/articles.sql'),
        'utf-8'
      )
      await articlesDbPool.query(articlesSchema)

      // Añadir related_links y slug (ignorar error si ya existe)
      const relatedLinksAndSlugMigration = readFileSync(
        join(__dirname, '../databases/migrations/004-add-related-links-and-slug-to-articles.sql'),
        'utf-8'
      )
      await this.runQuery(
        articlesDbPool, 
        relatedLinksAndSlugMigration,
        'Related links columns might already exist'
      )
      await articlesDbPool.end()

      // Setup Books Database
      const booksPool = new Pool(this.TEST_CONFIG)
      await this.runQuery(booksPool, 'DROP DATABASE IF EXISTS test_books')
      await this.runQuery(booksPool, 'CREATE DATABASE test_books')
      await booksPool.end()

      const booksDbPool = new Pool({
        ...this.TEST_CONFIG,
        database: 'test_books'
      })

      const booksSchema = readFileSync(
        join(__dirname, '../databases/books.sql'),
        'utf-8'
      )
      await booksDbPool.query(booksSchema)
      await booksDbPool.end()

      console.log('✅ Test databases created and initialized successfully')
      process.exit(0)
    } catch (error) {
      console.error('❌ Error setting up test databases:', error)
      process.exit(1)
    }
  }

  private static async runQuery(pool: Pool, query: string, errorMessage?: string): Promise<void> {
    try {
      await pool.query(query)
    } catch (error) {
      if (errorMessage) {
        console.warn(`Warning: ${errorMessage}`, error instanceof Error ? error.message : String(error))
      } else {
        throw error
      }
    }
  }
}

PostgresTestSetup.setupTestDatabases().catch(error => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
