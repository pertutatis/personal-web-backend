import { Pool } from 'pg'
import { PostgresConnection } from './PostgresConnection'
import { Logger } from './Logger'

export class PostgresMigrations {
  private connection: PostgresConnection | null = null
  
  constructor(private readonly databaseName: string) {}

  async getPool(): Promise<Pool> {
    if (!this.connection) {
      this.connection = await PostgresConnection.createTestConnection(this.databaseName)
    }
    return this.connection.getPool()
  }

  async execute(sql: string): Promise<void> {
    let conn: PostgresConnection | null = null
    try {
      conn = await PostgresConnection.createTestConnection(this.databaseName)
      await conn.execute(sql)
    } catch (error) {
      Logger.error('Error executing migration:', error)
      throw error
    } finally {
      if (conn) {
        await conn.close()
      }
    }
  }

  async clean(): Promise<void> {
    try {
      // Logger.info('Cleaning database directly with SQL...')

      // Connect to postgres database first
      let conn = await PostgresConnection.createTestConnection('postgres')
      
      try {
        // Force close all connections to the target database
        await conn.execute(`
          SELECT pg_terminate_backend(pg_stat_activity.pid)
          FROM pg_stat_activity
          WHERE pg_stat_activity.datname = $1
          AND pid <> pg_backend_pid()
        `, [this.databaseName])

        // Now we can safely drop the database
        await conn.execute(`DROP DATABASE IF EXISTS ${this.databaseName}`)
      } finally {
        await conn.close()
      }

      // Create test database
      conn = await PostgresConnection.createTestConnection('postgres')
      try {
        await conn.execute(`CREATE DATABASE ${this.databaseName}`)
      } finally {
        await conn.close()
      }

      // Logger.info('Database cleaned successfully')
    } catch (error) {
      Logger.error('Error cleaning database:', error)
      throw error
    }
  }

  async setup(): Promise<void> {
    try {
      // First create database
      let conn = await PostgresConnection.createTestConnection('postgres')
      try {
        await conn.execute(`DROP DATABASE IF EXISTS ${this.databaseName}`)
        await conn.execute(`CREATE DATABASE ${this.databaseName}`)
      } finally {
        await conn.close()
      }

      // Then create tables
      conn = await PostgresConnection.createTestConnection(this.databaseName)
      try {
        if (this.databaseName === 'auth_test') {
          await this.setupAuthTables(conn)
        } else if (this.databaseName === 'test_articles') {
          await this.setupArticlesTables(conn)
        } else if (this.databaseName === 'test_books') {
          await this.setupBooksTables(conn)
        }
      } finally {
        await conn.close()
      }
    } catch (error) {
      Logger.error('Error setting up database:', error)
      throw error
    }
  }

  private async setupAuthTables(conn: PostgresConnection): Promise<void> {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL
      )
    `)
    await conn.execute('DELETE FROM users')
  }

  private async setupArticlesTables(conn: PostgresConnection): Promise<void> {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        book_ids TEXT[] DEFAULT '{}',
        related_links JSONB DEFAULT '[]',
        slug VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT articles_title_not_empty CHECK (length(trim(title)) > 0),
        CONSTRAINT articles_excerpt_not_empty CHECK (length(trim(excerpt)) > 0),
        CONSTRAINT articles_content_not_empty CHECK (length(trim(content)) > 0),
        CONSTRAINT articles_slug_not_empty CHECK (length(trim(slug)) > 0),
        CONSTRAINT articles_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
      );

      CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles (slug);
      CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles (created_at DESC);
      CREATE INDEX IF NOT EXISTS articles_book_ids_idx ON articles USING gin(book_ids);

      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
      CREATE TRIGGER update_articles_updated_at
          BEFORE UPDATE ON articles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `)
    await conn.execute('DELETE FROM articles')
  }

  private async setupBooksTables(conn: PostgresConnection): Promise<void> {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(20) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        purchase_link TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS books_title_idx ON books (title);
      CREATE INDEX IF NOT EXISTS books_author_idx ON books (author);
      CREATE INDEX IF NOT EXISTS books_isbn_idx ON books (isbn);
      CREATE INDEX IF NOT EXISTS books_created_at_idx ON books (created_at DESC);
      
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_books_updated_at ON books;
      CREATE TRIGGER update_books_updated_at
          BEFORE UPDATE ON books
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

      ALTER TABLE books
        ADD CONSTRAINT books_title_not_empty CHECK (length(trim(title)) > 0),
        ADD CONSTRAINT books_author_not_empty CHECK (length(trim(author)) > 0),
        ADD CONSTRAINT books_isbn_valid CHECK (length(replace(replace(isbn, '-', ''), ' ', '')) IN (10, 13)),
        ADD CONSTRAINT books_description_not_empty CHECK (length(trim(description)) > 0),
        ADD CONSTRAINT books_description_length CHECK (length(description) <= 1000),
        ADD CONSTRAINT books_purchase_link_length CHECK (purchase_link IS NULL OR length(purchase_link) <= 2000),
        ADD CONSTRAINT books_purchase_link_format CHECK (
            purchase_link IS NULL OR
            purchase_link ~* '^https?://[^\\s/$.?#].[^\\s]*$'
        );
    `)
    await conn.execute('DELETE FROM books')
  }
}
