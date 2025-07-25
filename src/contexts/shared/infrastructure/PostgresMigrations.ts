import { Pool } from 'pg'
import { PostgresConnection } from './persistence/PostgresConnection'
import { Logger } from './Logger'

export class PostgresMigrations {
  private connection: PostgresConnection | null = null
  
  constructor(private readonly databaseName: string) {}

  async getPool(): Promise<Pool> {
    if (!this.connection) {
      this.connection = await PostgresConnection.createTestConnection(this.databaseName) as PostgresConnection
    }
    return this.connection.getPool()
  }

  async execute(sql: string): Promise<void> {
    let conn: PostgresConnection | null = null
    try {
      conn = await PostgresConnection.createTestConnection(this.databaseName) as PostgresConnection
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
      Logger.info('Cleaning database directly with SQL...')

      // Connect to postgres database first
      let conn = await PostgresConnection.createTestConnection('postgres')
      
      try {
    // Eliminado para evitar cierre abrupto de conexiones

        // Now we can safely drop the database
    // Eliminado para evitar cierre abrupto de conexiones
      } finally {
        await conn.close()
      }

      // Solo crear la base de datos si no existe
      conn = await PostgresConnection.createTestConnection('postgres')
      try {
        const result = await conn.execute(`SELECT 1 FROM pg_database WHERE datname = '${this.databaseName}'`)
        if (!result.rows || result.rows.length === 0) {
          await conn.execute(`CREATE DATABASE ${this.databaseName}`)
        }
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
      // Solo crear la base de datos si no existe
      let conn = await PostgresConnection.createTestConnection('postgres')
      try {
        const result = await conn.execute(`SELECT 1 FROM pg_database WHERE datname = '${this.databaseName}'`)
        if (!result.rows || result.rows.length === 0) {
          await conn.execute(`CREATE DATABASE ${this.databaseName}`)
        }
      } finally {
        await conn.close()
      }

      // Then create tables
      conn = await PostgresConnection.createTestConnection(this.databaseName) as PostgresConnection
      try {
        if (this.databaseName === 'test_blog') {
          await this.setupAuthTables(conn as PostgresConnection)
          await this.setupArticlesTables(conn as PostgresConnection)
          await this.setupBooksTables(conn as PostgresConnection)
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
    `)
    // Añadir restricciones solo si no existen
    const constraints = [
      { name: 'books_title_not_empty', sql: `ALTER TABLE books ADD CONSTRAINT books_title_not_empty CHECK (length(trim(title)) > 0);` },
      { name: 'books_author_not_empty', sql: `ALTER TABLE books ADD CONSTRAINT books_author_not_empty CHECK (length(trim(author)) > 0);` },
      { name: 'books_isbn_valid', sql: `ALTER TABLE books ADD CONSTRAINT books_isbn_valid CHECK (length(replace(replace(isbn, '-', ''), ' ', '')) IN (10, 13));` },
      { name: 'books_description_not_empty', sql: `ALTER TABLE books ADD CONSTRAINT books_description_not_empty CHECK (length(trim(description)) > 0);` },
      { name: 'books_description_length', sql: `ALTER TABLE books ADD CONSTRAINT books_description_length CHECK (length(description) <= 1000);` },
      { name: 'books_purchase_link_length', sql: `ALTER TABLE books ADD CONSTRAINT books_purchase_link_length CHECK (purchase_link IS NULL OR length(purchase_link) <= 2000);` },
      { name: 'books_purchase_link_format', sql: `ALTER TABLE books ADD CONSTRAINT books_purchase_link_format CHECK (purchase_link IS NULL OR purchase_link ~* '^https?://[^\\s/$.?#].[^\\s]*$');` },
    ];
    for (const { name, sql } of constraints) {
      const res = await conn.execute(`SELECT 1 FROM pg_constraint WHERE conname = '${name}'`);
      if (!res.rows || res.rows.length === 0) {
        await conn.execute(sql);
      }
    }
    await conn.execute('DELETE FROM books')
  }
}
