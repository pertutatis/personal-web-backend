// Import dependencies
const { Logger } = require('./src/contexts/shared/infrastructure/Logger')
const {
  TestHelper,
} = require('./src/contexts/shared/infrastructure/__tests__/TestHelper')
const {
  PostgresMigrations,
} = require('./src/contexts/shared/infrastructure/PostgresMigrations')
const fs = require('fs')
const path = require('path')

// Setup default test environment variables
const defaultEnv = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'postgres',
  DB_PASSWORD: 'postgres',
  DB_NAME: 'test_blog',
  NODE_ENV: { value: 'test', writable: true },
}

// Load environment variables from .env.test if it exists
const envPath = path.join(__dirname, '.env.test')
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath })
} else {
  // Set default environment variables if .env.test doesn't exist
  Object.entries(defaultEnv).forEach(([key, value]) => {
    process.env[key] = process.env[key] || value
  })
}

// Increase timeout for tests that need database access
jest.setTimeout(30000)

// Setup global beforeAll
beforeAll(async () => {
  try {
    const blogMigrations = new PostgresMigrations('test_blog')
    await blogMigrations.setup()
    // Ejecutar migraciones extra usando pg.Pool
    const { Pool } = require('pg')
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'test_blog',
    })

    // Migración series y columna series_id
    const migrationSeriesPath = path.join(
      __dirname,
      'databases/migrations/008-create-article-series.sql',
    )
    if (fs.existsSync(migrationSeriesPath)) {
      // Ejecutar CREATE TABLE IF NOT EXISTS series
      await pool.query(`CREATE TABLE IF NOT EXISTS series (
        id UUID PRIMARY KEY,
        title VARCHAR(100) NOT NULL UNIQUE,
        description VARCHAR(500) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      );`)
      // Ejecutar ALTER TABLE solo si no existe la columna
      await pool.query(`DO $$ BEGIN IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='series_id'
      ) THEN ALTER TABLE articles ADD COLUMN series_id UUID REFERENCES series(id); END IF; END $$;`)
      // Crear índice si no existe
      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_articles_series ON articles(series_id);`,
      )
      Logger.info('✓ Migración de series aplicada')
    } else {
      Logger.warn('No se encontró la migración 008-create-article-series.sql')
    }

    // Migración published_at
    const migrationPublishedAtPath = path.join(
      __dirname,
      'databases/migrations/009-add-published-at-to-articles.sql',
    )
    if (fs.existsSync(migrationPublishedAtPath)) {
      // Ejecutar ALTER TABLE solo si no existe la columna
      await pool.query(`DO $$ BEGIN IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name='articles' AND column_name='published_at'
      ) THEN ALTER TABLE articles ADD COLUMN published_at TIMESTAMP WITH TIME ZONE; END IF; END $$;`)
      // Crear índice si no existe
      await pool.query(
        `CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles (published_at DESC);`,
      )
      // Añadir comentario
      await pool.query(
        `COMMENT ON COLUMN articles.published_at IS 'Date/time when the article was published and made visible to the public';`,
      )
      Logger.info('✓ Migración published_at aplicada')
    } else {
      Logger.warn(
        'No se encontró la migración 009-add-published-at-to-articles.sql',
      )
    }
    await pool.end()

    // Wait for databases to be ready
    await TestHelper.waitForDatabases()
    Logger.info('✓ Database connections established and schemas created')
  } catch (error) {
    Logger.error('Failed to setup databases:', error)
    throw error
  }
})

// Clean database before each test
beforeEach(async () => {
  try {
    await TestHelper.cleanAllDatabases()
  } catch (error) {
    Logger.error('Failed to clean databases:', error)
    throw error
  }
})

// Clean up resources after all tests
afterAll(async () => {
  try {
    await TestHelper.closeConnections()
    Logger.info('✓ Database connections closed')
  } catch (error) {
    Logger.error('Failed to close database connections:', error)
    throw error
  }
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  Logger.error('Unhandled promise rejection:', error)
  process.exit(1)
})

// Make test helper globally available
global.TestHelper = TestHelper
