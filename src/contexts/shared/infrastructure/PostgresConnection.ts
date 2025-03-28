import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { DatabaseConfig } from './config/DatabaseConfig';

export class PostgresConnection {
  static async createTestConnection(database: string): Promise<PostgresConnection> {
    const config: DatabaseConfig = {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: Number(process.env.TEST_DB_PORT) || 5432,
      user: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'postgres',
      database
    };
    
    return PostgresConnection.create(config);
  }

  private constructor(
    private readonly connection: Pool | PoolClient,
    private readonly database: string
  ) {}

  static async create(config: DatabaseConfig): Promise<PostgresConnection> {
    const pool = new Pool(config);
    
    try {
      // Test connection
      await pool.query('SELECT NOW()');
      return new PostgresConnection(pool, config.database);
    } catch (error) {
      await pool.end();
      throw error;
    }
  }

  async execute<T extends QueryResultRow = any>(
    query: string,
    values: any[] = []
  ): Promise<QueryResult<T>> {

    try {
      const result = await this.connection.query<T>(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async transaction<T>(callback: (client: PostgresConnection) => Promise<T>): Promise<T> {
    if (!(this.connection instanceof Pool)) {
      throw new Error('Cannot start transaction on non-pool connection');
    }

    const client = await this.connection.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(new PostgresConnection(client, this.database));
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    if (this.connection instanceof Pool) {
      await this.connection.end();
    }
    // PoolClient instances are released in transaction()
  }

  getDatabase(): string {
    return this.database;
  }
}
