import { PostgresConnection } from '../persistence/PostgresConnection';
import { PostgresMigrations } from '../PostgresMigrations';
import { getTestConfig } from '../config/DatabaseConfig';
import { Logger } from '../Logger';

export class TestDatabase {
  private static connections: Record<string, PostgresConnection> = {};

  static async createTestDatabase(dbName: string): Promise<void> {
    const pgConnection = await PostgresConnection.create(getTestConfig('postgres'));
    try {
      // Solo crear la base de datos si no existe
      const result = await pgConnection.execute(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
      if (!result.rows || result.rows.length === 0) {
        await pgConnection.execute(`CREATE DATABASE ${dbName}`);
      }
    } finally {
      await pgConnection.close();
    }
  }

  static async setupTestDatabase(dbName: string): Promise<void> {
    const migrations = new PostgresMigrations(dbName);
    await migrations.setup();
  }

  static async getArticlesConnection(): Promise<PostgresConnection> {
    if (!this.connections.articles) {
      await this.createTestDatabase('test_blog');
      await this.setupTestDatabase('test_blog');
      this.connections.articles = await PostgresConnection.create(
        getTestConfig('test_blog')
      );
    }
    return this.connections.articles;
  }

  static async closeAll(): Promise<void> {
    for (const conn of Object.values(this.connections)) {
      await conn.close();
    }
    this.connections = {};
  }

  static async cleanArticles(): Promise<void> {
    const conn = await this.getArticlesConnection();
    await conn.execute('DELETE FROM articles');
    await conn.execute('DELETE FROM books');
  }

  // static async cleanAuth(): Promise<void> {
  //   try {
  //     const conn = await this.getAuthConnection();
  //     await conn.execute('DELETE FROM users');
  //   } catch (error) {
  //     Logger.error('Error cleaning auth database:', error);
  //     throw error;
  //   }
  // }

  static async beginTransaction(): Promise<void> {
    for (const conn of Object.values(this.connections)) {
      await conn.execute('BEGIN');
    }
  }

  static async commitTransaction(): Promise<void> {
    for (const conn of Object.values(this.connections)) {
      await conn.execute('COMMIT');
    }
  }

  static async rollbackTransaction(): Promise<void> {
    for (const conn of Object.values(this.connections)) {
      await conn.execute('ROLLBACK');
    }
  }

  static async cleanAll(): Promise<void> {
    try {
      // Asegurar que tenemos todas las conexiones
      await Promise.all([
        this.getArticlesConnection(),
        // this.getAuthConnection()
      ]);

      // Iniciar transacción
      await this.beginTransaction();

      // Limpiar tablas dentro de la transacción
      await Promise.all([
        this.cleanArticles(),
        // this.cleanAuth()
      ]);

      // Commit de la transacción
      await this.commitTransaction();
    } catch (error) {
      // Rollback en caso de error
      await this.rollbackTransaction().catch(() => {});
      Logger.error('Error cleaning databases:', error);
      throw error;
    }
  }
}
