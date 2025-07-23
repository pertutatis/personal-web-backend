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
      if (environment === 'production') {
        if (!config.supabaseUrl || !config.supabaseKey) {
          throw new Error('Missing Supabase configuration')
        }

        Logger.info('Creating Supabase connection for production')
        return await SupabaseConnection.create({
          url: config.supabaseUrl,
          key: config.supabaseKey,
          database: config.database
        })
      }

      // Development o test usan PostgreSQL local
      Logger.info(`Creating PostgreSQL connection for ${environment}`)
      return await PostgresConnection.create({
        host: config.host || process.env.DB_HOST || 'localhost',
        port: config.port || Number(process.env.DB_PORT) || 5432,
        user: config.user || process.env.DB_USER || 'postgres',
        password: config.password || process.env.DB_PASSWORD || 'postgres',
        database: config.database || process.env.DB_NAME || 'postgres'
      })
    } catch (error) {
      Logger.error('Error creating database connection:', {
        error: error instanceof Error ? error.message : String(error),
        environment,
        config: {
          ...config,
          password: '***',
          supabaseKey: config.supabaseKey ? '***' : undefined
        }
      })
      throw error
    }
  }

  static async createTestConnection(database: string): Promise<DatabaseConnection> {
    return PostgresConnection.createTestConnection(database)
  }
}
