import { DatabaseConnection } from './DatabaseConnection'
import { PostgresConnection } from './PostgresConnection'
import { SupabaseConnection } from './SupabaseConnection'
import { Logger } from '../Logger'

export interface DatabaseConfig {
  // Configuración común
  database?: string
  
  // Configuración PostgreSQL
  host?: string
  port?: number
  user?: string
  password?: string
  
  // Configuración Supabase
  supabaseUrl?: string
  supabaseKey?: string
}

export class DatabaseConnectionFactory {
  static async create(config: DatabaseConfig): Promise<DatabaseConnection> {
    const environment = process.env.NODE_ENV || 'development'
    try {
      Logger.info(`Creating PostgreSQL connection for ${environment}`)
      return await PostgresConnection.create({
        host: config.host || process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
        port: config.port || Number(process.env.DB_PORT) || Number(process.env.POSTGRES_PORT) || 5432,
        user: config.user || process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
        password: config.password || process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
        database: config.database || process.env.DB_NAME || process.env.POSTGRES_DB || 'postgres'
      })
    } catch (error) {
      Logger.error('Error creating database connection:', {
        error: error instanceof Error ? error.message : String(error),
        environment,
        config: {
          ...config,
          password: '***'
        }
      })
      throw error
    }
  }

  static async createTestConnection(database: string): Promise<DatabaseConnection> {
    return PostgresConnection.createTestConnection(database)
  }
}
