import { Pool } from 'pg';
import { Collection } from '@/contexts/shared/domain/Collection';
import { getTestConfig } from '../config/DatabaseConfig';

export class TestHelper {
  private static pools: Record<string, Pool> = {};

  static async getPool(database: string): Promise<Pool> {
    if (!this.pools[database]) {
      const config = getTestConfig(database);
      this.pools[database] = new Pool({
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password
      });

      // Verificar conexión
      try {
        const client = await this.pools[database].connect();
        await client.query('SELECT 1');
        client.release();
      } catch (error) {
        console.error(`Failed to connect to ${database}:`, error);
        throw error;
      }
    }
    return this.pools[database];
  }

  static async closeConnections(): Promise<void> {
    await Promise.all(
      Object.values(this.pools).map(async (pool) => {
        try {
          await pool.end();
        } catch (error) {
          console.error('Error closing pool:', error);
        }
      })
    );
    this.pools = {};
  }

  static async cleanDatabase(database: string): Promise<void> {
    const pool = await this.getPool(database);
    try {
      switch (database) {
        case 'test_articles':
          await pool.query('TRUNCATE articles CASCADE');
          break;
        case 'test_books':
          await pool.query('TRUNCATE books CASCADE');
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
        const pool1 = await this.getPool('test_articles');
        const pool2 = await this.getPool('test_books');

        const client1 = await pool1.connect();
        const client2 = await pool2.connect();

        await client1.query('SELECT 1');
        await client2.query('SELECT 1');

        client1.release();
        client2.release();

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
}
