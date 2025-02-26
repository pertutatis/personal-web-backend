import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { DatabaseConfig } from './config/DatabaseConfig';

export class PostgresConnection {
  private constructor(private readonly connection: Pool | PoolClient) {}

  static async create(config: DatabaseConfig): Promise<PostgresConnection> {
    const pool = new Pool(config);
    
    try {
      // Test connection
      await pool.query('SELECT NOW()');
      return new PostgresConnection(pool);
    } catch (error) {
      await pool.end();
      throw error;
    }
  }

  async execute<T extends QueryResultRow = any>(
    query: string, 
    values: any[] = []
  ): Promise<QueryResult<T>> {
    return this.connection.query<T>(query, values);
  }

  async transaction<T>(callback: (client: PostgresConnection) => Promise<T>): Promise<T> {
    if (!(this.connection instanceof Pool)) {
      throw new Error('Cannot start transaction on non-pool connection');
    }

    const client = await this.connection.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(new PostgresConnection(client));
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
}
