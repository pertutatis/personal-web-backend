import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { getBlogConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

let connection: PostgresConnection | undefined

export async function getConnection(): Promise<PostgresConnection> {
  if (!connection) {
    connection = (await PostgresConnection.create(
      getBlogConfig(),
    )) as PostgresConnection
  }
  return connection
}

export async function cleanupDatabase(): Promise<void> {
  try {
    const conn = await getConnection()

    // Clean up series first (in case we add foreign keys in the future)
    await conn.execute('TRUNCATE article_series CASCADE')
    Logger.info('✅ Cleaned article_series table')

    // Clean up other tables
    await conn.execute('TRUNCATE articles CASCADE')
    Logger.info('✅ Cleaned articles table')
    await conn.execute('TRUNCATE books CASCADE')
    Logger.info('✅ Cleaned books table')
  } catch (error) {
    Logger.error('❌ Error cleaning database:', error)
    throw error
  }
}

export async function closeConnection(): Promise<void> {
  if (connection) {
    await connection.close()
    connection = undefined
    Logger.info('✅ Database connection closed')
  }
}
