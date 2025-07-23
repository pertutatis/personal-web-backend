import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from './config'

export class PostgresTestSetup {
  static async setupTestDatabases(): Promise<void> {
    try {
      const baseConfig = {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: 'postgres'
      }

      // Setup Auth Database
      console.log('🔄 Terminando conexiones previas a la base de datos auth_test...')
      const authPool = new Pool(baseConfig)
      await this.terminateConnections(authPool, config.databases.auth)
      console.log('🔄 Eliminando base de datos auth_test si existe...')
      await this.runQuery(authPool, `DROP DATABASE IF EXISTS ${config.databases.auth}`)
      console.log('🔄 Creando base de datos auth_test...')
      await this.runQuery(authPool, `CREATE DATABASE ${config.databases.auth}`)
      await authPool.end()

      // Configurar esquema de auth
      console.log('🔄 Configurando esquema de la base de datos auth_test...')
      const authDbPool = new Pool({
        ...baseConfig,
        database: config.databases.auth
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
      console.log('✅ auth_test creada y configurada correctamente.')

  // Setup Articles Database (incluye tabla books)
  console.log('🔄 Terminando conexiones previas a la base de datos test_articles...')
  const articlesPool = new Pool(baseConfig)
  await this.terminateConnections(articlesPool, config.databases.articles)
  console.log('🔄 Eliminando base de datos test_articles si existe...')
  await this.runQuery(articlesPool, `DROP DATABASE IF EXISTS ${config.databases.articles}`)
  console.log('🔄 Creando base de datos test_articles...')
  await this.runQuery(articlesPool, `CREATE DATABASE ${config.databases.articles}`)
  await articlesPool.end()

      const articlesDbPool = new Pool({
        ...baseConfig,
        database: config.databases.articles
      })

      console.log('🔄 Configurando esquema de la base de datos test_articles...')
      // Crear tabla articles
      const articlesSchema = readFileSync(
        join(process.cwd(), 'databases/articles.sql'),
        'utf-8'
      )
      await articlesDbPool.query(articlesSchema)

      // Añadir related_links y slug (ignorar error si ya existe)
      const relatedLinksAndSlugMigration = readFileSync(
        join(process.cwd(), 'databases/migrations/004-add-related-links-and-slug-to-articles.sql'),
        'utf-8'
      )
      await this.runQuery(
        articlesDbPool, 
        relatedLinksAndSlugMigration,
        'Related links columns might already exist'
      )

      console.log('🔄 Configurando tabla books en test_articles...')
      // Crear tabla books en la misma base de datos
      const booksSchema = `
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
      `
      await articlesDbPool.query(booksSchema)
      await articlesDbPool.end()
      console.log('✅ test_articles creada y configurada correctamente.')

  console.log('\u2705 Test databases created and initialized successfully')
    } catch (error) {
      console.error('❌ Error setting up test databases:', error)
      throw error
    }
  }

  private static async terminateConnections(pool: Pool, database: string): Promise<void> {
    const query = `
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${database}'
      AND pid <> pg_backend_pid();
    `;
    try {
      await pool.query(query);
    } catch (error) {
      // Ignore errors here as the database might not exist yet
      console.log(`Note: Could not terminate connections for ${database} - might not exist yet`);
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
