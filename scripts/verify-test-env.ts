import { Logger } from '@/contexts/shared/infrastructure/Logger'
import { Pool } from 'pg'

async function verifyDatabase(name: string, tables: string[]) {
  const pool = new Pool({
    host: process.env.TEST_DB_HOST || 'localhost',
    port: Number(process.env.TEST_DB_PORT) || 5432,
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
    database: name
  })

  try {
    await pool.query('SELECT NOW()')
    Logger.info(`✅ Database ${name} created`)

    // Verificar tablas
    for (const table of tables) {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [table])

      if (result.rows[0].exists) {
        Logger.info(`✅ Table ${table} exists in ${name}`)
      } else {
        Logger.error(`❌ Table ${table} not found in ${name}`)
        process.exit(1)
      }
    }

    // Obtener constraints
    const constraintsResult = await pool.query(`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = (SELECT oid FROM pg_class WHERE relname LIKE ANY($1))
    `, [tables])

    Logger.info(`Constraints found in ${name}:`, constraintsResult.rows.map(r => r.conname).join(', '))

  } catch (error) {
    Logger.error(`❌ Error verifying ${name}:`, error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

async function verifyTestEnvironment() {
  Logger.info('Verifying test databases...\n')

  // Verificar test_blog
  Logger.info('Verifying test_blog database...')
  await verifyDatabase('test_blog', ['articles, books', 'users'])

  Logger.info('\n✅ All database connections verified successfully')
  process.exit(0)
}

verifyTestEnvironment().catch(error => {
  Logger.error('Failed to verify test environment:', error)
  process.exit(1)
})
