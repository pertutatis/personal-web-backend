import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export async function getAuthConnection(): Promise<PostgresConnection> {
  const dbName = process.env.AUTH_DB_NAME || 'auth'
  
  Logger.info('Connecting to auth database:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: dbName,
    environment: process.env.NODE_ENV
  })

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: dbName
  }
  
  try {
    const connection = await PostgresConnection.create(config)
    Logger.info('Auth database connection established successfully')
    return connection
  } catch (error) {
    Logger.error('Error connecting to auth database:', error)
    throw error
  }
}
