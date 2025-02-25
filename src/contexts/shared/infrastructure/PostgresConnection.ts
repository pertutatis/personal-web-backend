import pg from 'pg';

export class PostgresConnection {
  private client: pg.Client;

  private constructor(client: pg.Client) {
    this.client = client;
  }

  static async create(config: pg.ClientConfig): Promise<PostgresConnection> {
    const client = new pg.Client(config);
    await client.connect();
    return new PostgresConnection(client);
  }

  async close(): Promise<void> {
    await this.client.end();
  }

  async execute(query: string, values: any[] = []): Promise<void> {
    await this.client.query(query, values);
  }

  async query<T>(query: string, values: any[] = []): Promise<T[]> {
    const result = await this.client.query<T>(query, values);
    return result.rows;
  }

  async queryOne<T>(query: string, values: any[] = []): Promise<T | null> {
    const result = await this.client.query<T>(query, values);
    return result.rows[0] || null;
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    try {
      await this.execute('BEGIN');
      const result = await callback();
      await this.execute('COMMIT');
      return result;
    } catch (error) {
      await this.execute('ROLLBACK');
      throw error;
    }
  }
}
