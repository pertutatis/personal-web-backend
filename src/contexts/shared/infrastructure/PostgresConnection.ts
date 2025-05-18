import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg'

export class PostgresConnection {
  private client: Pool
  private database: string

  private constructor(client: Pool, database: string) {
    this.client = client
    this.database = database
  }

  static async create(config: {
    host: string
    port: number
    user: string
    password: string
    database: string
  }): Promise<PostgresConnection> {
    try {
      // console.log('Creating postgres connection with config:', {
      //   ...config,
      //   password: '***'
      // })

      const pool = new Pool(config)

      // Verify connection
      const client = await pool.connect()
      // console.log('Database connection established successfully')
      await client.query('SELECT 1')
      client.release()

      return new PostgresConnection(pool, config.database)
    } catch (error) {
      console.error('Error creating postgres connection:', error)
      throw error
    }
  }

  static async createTestConnection(database: string): Promise<PostgresConnection> {
    return this.create({
      host: process.env.TEST_DB_HOST || 'localhost',
      port: Number(process.env.TEST_DB_PORT) || 5432,
      user: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'postgres',
      database
    })
  }

  async execute<T extends QueryResultRow = any>(
    query: string,
    values?: any[]
  ): Promise<QueryResult<T>> {
    let client: PoolClient | null = null
    try {
      // console.log('Executing query:', query.trim(), 'with values:', values)
      
      client = await this.client.connect()
      const result = await client.query<T>(query, values)
      
      // console.log('Query executed successfully. Row count:', result.rowCount)
      return result
    } catch (error) {
      console.error('Error executing query:', error)
      throw error
    } finally {
      if (client) {
        // console.log('Releasing database client')
        client.release()
      }
    }
  }

  async close(): Promise<void> {
    try {
      // console.log('Closing database connection')
      if (this.client) {
        const clients = await this.client.connect()
        await clients.release()
        await this.client.end()
      }
      // console.log('Database connection closed successfully')
    } catch (error) {
      console.error('Error closing database connection:', error)
      throw error
    }
  }

  getDatabase(): string {
    return this.database
  }

  getPool(): Pool {
    return this.client
  }
}
