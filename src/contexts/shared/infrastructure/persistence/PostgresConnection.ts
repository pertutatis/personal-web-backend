import { Pool, QueryResult, QueryResultRow } from 'pg'
import { DatabaseConnection } from './DatabaseConnection'
import { Logger } from '../Logger'

export class PostgresConnection implements DatabaseConnection {
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
    ssl?: any
    max?: number
  }): Promise<DatabaseConnection> {
    try {
      // Si estamos en producción, forzamos SSL para Supabase y otros proveedores que lo requieran
      const isProduction = process.env.NODE_ENV === 'production'
      const poolConfig = { ...config }
      if (isProduction) {
        poolConfig['ssl'] = { rejectUnauthorized: false }
        poolConfig['max'] = 2 // Limitar conexiones en producción
      }
      const pool = new Pool(poolConfig)
      const client = await pool.connect()
      await client.query('SELECT 1')
      client.release()

      Logger.info('PostgreSQL connection established', {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        ssl: isProduction ? 'enabled' : 'disabled'
      })

      return new PostgresConnection(pool, config.database)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)

      if (errorMsg.includes('database') && errorMsg.includes('does not exist')) {
        const error = new Error('DatabaseConnectionError')
        error.name = 'DatabaseConnectionError'
        error.message = `La base de datos "${config.database}" no existe o no es accesible. Por favor, verifica la configuración y los permisos.`
        throw error
      }

      Logger.error('Error creating postgres connection:', {
        error: errorMsg,
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user
      })

      throw new Error(`Failed to connect to database: ${errorMsg}`)
    }
  }

  static async createTestConnection(database: string): Promise<DatabaseConnection> {
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
    try {
      return await this.client.query<T>(query, values)
    } catch (error) {
      Logger.error('Error executing query:', {
        error: error instanceof Error ? error.message : String(error),
        database: this.database,
        query: query.trim().slice(0, 100) + '...'
      })
      throw error
    }
  }

  async close(): Promise<void> {
    try {
      if (this.client) {
        await this.client.end()
        Logger.info('PostgreSQL connection closed', {
          database: this.database
        })
      }
    } catch (error) {
      Logger.error('Error closing database connection:', {
        error: error instanceof Error ? error.message : String(error),
        database: this.database
      })
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
