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
      const authPool = new Pool(baseConfig)
      await this.runQuery(authPool, `DROP DATABASE IF EXISTS ${config.databases.auth}`)
      await this.runQuery(authPool, `CREATE DATABASE ${config.databases.auth}`)
      await authPool.end()

      // Configurar esquema de auth
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

      // Setup Articles Database
      const articlesPool = new Pool(baseConfig)
      await this.runQuery(articlesPool, `DROP DATABASE IF EXISTS ${config.databases.articles}`)
      await this.runQuery(articlesPool, `CREATE DATABASE ${config.databases.articles}`)
      await articlesPool.end()

      const articlesDbPool = new Pool({
        ...baseConfig,
        database: config.databases.articles
      })

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
      await articlesDbPool.end()

      // Setup Books Database
      const booksPool = new Pool(baseConfig)
      await this.runQuery(booksPool, `DROP DATABASE IF EXISTS ${config.databases.books}`)
      await this.runQuery(booksPool, `CREATE DATABASE ${config.databases.books}`)
      await booksPool.end()

      const booksDbPool = new Pool({
        ...baseConfig,
        database: config.databases.books
      })

      const booksSchema = readFileSync(
        join(process.cwd(), 'databases/books.sql'),
        'utf-8'
      )
      await booksDbPool.query(booksSchema)
      await booksDbPool.end()

      console.log('✅ Test databases created and initialized successfully')
    } catch (error) {
      console.error('❌ Error setting up test databases:', error)
      throw error
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
