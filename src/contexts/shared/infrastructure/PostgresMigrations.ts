import { PostgresConnection } from './PostgresConnection';
import * as fs from 'fs';
import * as path from 'path';

export const ARTICLES_SCHEMA = `
CREATE TABLE IF NOT EXISTS articles (
  id VARCHAR(255) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  book_ids TEXT[],
  related_links JSONB,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
`;

export const BOOKS_SCHEMA = `
CREATE TABLE IF NOT EXISTS books (
  id VARCHAR(255) PRIMARY KEY,
  isbn VARCHAR(13) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  purchase_link TEXT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
`;

export class PostgresMigrations {
  private readonly migrationsPath: string;

  constructor(private connection: PostgresConnection) {
    this.migrationsPath = path.join(process.cwd(), 'databases', 'migrations');
  }

  private async executeWithNewConnection(sql: string): Promise<void> {
    const conn = await PostgresConnection.createTestConnection(this.connection.getDatabase());
    try {
      await conn.execute(sql);
    } finally {
      await conn.close();
    }
  }

  async apply(): Promise<void> {
    try {
      // 1. Terminar conexiones existentes
      await this.executeWithNewConnection(`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE pid <> pg_backend_pid()
        AND datname = current_database();
      `);

      // 2. Recrear esquema
      await this.executeWithNewConnection(`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO public;
        ALTER SCHEMA public OWNER TO postgres;
      `);

      // 3. Crear tablas
      await this.executeWithNewConnection(ARTICLES_SCHEMA);
      await this.executeWithNewConnection(BOOKS_SCHEMA);

      // 4. Aplicar migraciones adicionales
      const files = fs.readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();

      for (const file of files) {
        const sql = fs.readFileSync(path.join(this.migrationsPath, file), 'utf8');
        await this.executeWithNewConnection(sql);
      }

    } catch (error) {
      console.error('Error applying migrations:', error);
      throw error;
    }
  }

  static async createAndApply(connection: PostgresConnection): Promise<void> {
    const migrations = new PostgresMigrations(connection);
    await migrations.apply();
  }
}
