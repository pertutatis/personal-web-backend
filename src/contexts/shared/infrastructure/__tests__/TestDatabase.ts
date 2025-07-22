import { PostgresConnection } from '../PostgresConnection';
import { PostgresMigrations } from '../PostgresMigrations';
import { getTestConfig } from '../config/DatabaseConfig';
import { Logger } from '../Logger';

export class TestDatabase {
  private static connections: Record<string, PostgresConnection> = {};

  static async createTestDatabase(dbName: string): Promise<void> {
    const pgConnection = await PostgresConnection.create(getTestConfig('postgres'));
    try {
      // Terminar conexiones activas antes de eliminar la base de datos
      await pgConnection.execute(`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = '${dbName}' AND pid <> pg_backend_pid();
      `);
      await pgConnection.execute(`DROP DATABASE IF EXISTS ${dbName}`);
      await pgConnection.execute(`CREATE DATABASE ${dbName}`);
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
      await this.createTestDatabase('test_articles');
      await this.setupTestDatabase('test_articles');
      this.connections.articles = await PostgresConnection.create(
        getTestConfig('test_articles')
      );
    }
    return this.connections.articles;
  }

  static async getAuthConnection(): Promise<PostgresConnection> {
    if (!this.connections.auth) {
      await this.createTestDatabase('auth_test');
      await this.setupTestDatabase('auth_test');
      this.connections.auth = await PostgresConnection.create(
        getTestConfig('auth_test')
      );
    }
    return this.connections.auth;
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

  static async cleanAuth(): Promise<void> {
    try {
      const conn = await this.getAuthConnection();
      await conn.execute('DELETE FROM users');
    } catch (error) {
      Logger.error('Error cleaning auth database:', error);
      throw error;
    }
  }

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
        this.getAuthConnection()
      ]);

      // Iniciar transacción
      await this.beginTransaction();

      // Limpiar tablas dentro de la transacción
      await Promise.all([
        this.cleanArticles(),
        this.cleanAuth()
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
