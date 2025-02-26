import { PostgresConnection } from '../PostgresConnection';
import { Collection } from '@/contexts/shared/domain/Collection';
import { getTestConfig } from '../config/DatabaseConfig';

export class TestHelper {
  private static connections: Record<string, PostgresConnection> = {};

  static async getConnection(database: string): Promise<PostgresConnection> {
    if (!this.connections[database]) {
      const config = getTestConfig(database);
      try {
        this.connections[database] = await PostgresConnection.create(config);
      } catch (error) {
        console.error(`Failed to connect to ${database}:`, error);
        throw error;
      }
    }
    return this.connections[database];
  }

  static async closeConnections(): Promise<void> {
    await Promise.all(
      Object.values(this.connections).map(async (conn) => {
        try {
          await conn.close();
        } catch (error) {
          console.error('Error closing connection:', error);
        }
      })
    );
    this.connections = {};
  }

  static async cleanDatabase(database: string): Promise<void> {
    const connection = await this.getConnection(database);
    try {
      switch (database) {
        case 'test_articles':
          await connection.execute('DELETE FROM articles');
          break;
        case 'test_books':
          await connection.execute('DELETE FROM books');
          break;
        default:
          throw new Error(`Unknown database: ${database}`);
      }
    } catch (error) {
      console.error(`Failed to clean database ${database}:`, error);
      throw error;
    }
  }

  static async cleanAllDatabases(): Promise<void> {
    try {
      await Promise.all([
        this.cleanDatabase('test_articles'),
        this.cleanDatabase('test_books')
      ]);
    } catch (error) {
      console.error('Failed to clean all databases:', error);
      throw error;
    }
  }

  static async waitForDatabases(): Promise<void> {
    const maxRetries = 10;
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.getConnection('test_articles');
        await this.getConnection('test_books');
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error('Unable to connect to databases after maximum retries');
        }
        console.log(`Waiting for databases (attempt ${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  static createPagination(page: number = 1, limit: number = 10, total: number = 0): Collection<any> {
    return Collection.create([], {
      page,
      limit,
      total
    });
  }
}
