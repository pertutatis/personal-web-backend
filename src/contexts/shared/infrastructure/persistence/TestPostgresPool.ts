import { Pool } from 'pg'

const testPool = new Pool({
  user: process.env.TEST_POSTGRES_USER || 'postgres',
  host: process.env.TEST_POSTGRES_HOST || 'localhost',
  database: process.env.TEST_POSTGRES_DB || 'test_db',
  password: process.env.TEST_POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.TEST_POSTGRES_PORT || '5432'),
})

// Error handling
testPool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export { testPool }
