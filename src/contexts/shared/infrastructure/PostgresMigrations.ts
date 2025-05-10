import { PostgresConnection } from './PostgresConnection'
import { Logger } from './Logger'

export class PostgresMigrations {
  constructor(private readonly databaseName: string) {}

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
      Logger.info('Cleaning database directly with SQL...')

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

      Logger.info('Database cleaned successfully')
    } catch (error) {
      Logger.error('Error cleaning database:', error)
      throw error
    }
  }

  async setup(): Promise<void> {
    try {
      // Create tables
      const conn = await PostgresConnection.createTestConnection(this.databaseName)
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
        content TEXT NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        tags TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
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
        purchase_link VARCHAR(2048),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await conn.execute('DELETE FROM books')
  }
}
