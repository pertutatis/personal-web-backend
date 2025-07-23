import { PostgresConnection } from '../src/contexts/shared/infrastructure/persistence/PostgresConnection'
import { Logger } from '../src/contexts/shared/infrastructure/Logger'

async function setupAuthDb() {
  let connection: PostgresConnection | null = null

  try {
    Logger.info('Setting up auth_test database...')
    
    // Create database
    connection = await PostgresConnection.createTestConnection('postgres')
    
    await connection.execute('DROP DATABASE IF EXISTS auth_test')
    await connection.execute('CREATE DATABASE auth_test')
    
    Logger.info('Auth test database created')
    await connection.close()

    // Create tables
    connection = await PostgresConnection.createTestConnection('auth_test')
    
    Logger.info('Creating users table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL
      )
    `)
    
    Logger.info('Users table created successfully')
    await connection.execute('DELETE FROM users')
    Logger.info('Users table cleaned')

  } catch (error) {
    Logger.error('Error setting up auth database:', error)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.close()
    }
  }

  Logger.info('Auth database setup completed')
}

setupAuthDb().catch(error => {
  Logger.error('Failed to setup auth database:', error)
  process.exit(1)
})
