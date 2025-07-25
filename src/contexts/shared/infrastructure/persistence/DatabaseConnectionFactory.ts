import { DatabaseConnection } from './DatabaseConnection'
import { PostgresConnection } from './PostgresConnection'
import { Logger } from '../Logger'

export interface DatabaseConfig {
  // Configuración común
  database: string

  // Configuración PostgreSQL
  host: string
  port: number
  user: string
  password: string
}

export class DatabaseConnectionFactory {
  static async create(config: DatabaseConfig): Promise<DatabaseConnection> {
    const environment = process.env.NODE_ENV || 'development'
    try {
      const connectionData = {
        host: config.host || process.env.DB_HOST || 'localhost',
        port: config.port || Number(process.env.DB_PORT) || 5432,
        user: config.user || process.env.DB_USER || 'postgres',
        database: config.database || process.env.DB_NAME || 'postgres',
      }
      Logger.info('Intentando conectar a PostgreSQL con:', {
        ...connectionData,
        password: config.password || process.env.DB_PASSWORD || 'postgres',
      })
      return await PostgresConnection.create({
        ...connectionData,
        password: config.password || process.env.DB_PASSWORD || 'postgres',
      })
    } catch (error) {
      Logger.error('Error creating database connection:', {
        error: error instanceof Error ? error.message : String(error),
        environment,
        config: {
          ...config,
          password: '***',
        },
      })
      throw error
    }
  }

  static async createTestConnection(
    database: string,
  ): Promise<DatabaseConnection> {
    return PostgresConnection.createTestConnection(database)
  }
}
