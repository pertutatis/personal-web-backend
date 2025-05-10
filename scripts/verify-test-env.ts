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
    console.log(`✅ Database ${name} created`)

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
        console.log(`✅ Table ${table} exists in ${name}`)
      } else {
        console.error(`❌ Table ${table} not found in ${name}`)
        process.exit(1)
      }
    }

    // Obtener constraints
    const constraintsResult = await pool.query(`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = (SELECT oid FROM pg_class WHERE relname LIKE ANY($1))
    `, [tables])

    console.log(`Constraints found in ${name}:`, constraintsResult.rows.map(r => r.conname).join(', '))

  } catch (error) {
    console.error(`❌ Error verifying ${name}:`, error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

async function verifyTestEnvironment() {
  console.log('Verifying test databases...\n')

  // Verificar test_articles
  console.log('Verifying test_articles database...')
  await verifyDatabase('test_articles', ['articles'])

  // Verificar test_books
  console.log('\nVerifying test_books database...')
  await verifyDatabase('test_books', ['books'])

  // Verificar auth_test
  console.log('\nVerifying auth_test database...')
  await verifyDatabase('auth_test', ['users'])

  console.log('\n✅ All database connections verified successfully')
  process.exit(0)
}

verifyTestEnvironment().catch(error => {
  console.error('Failed to verify test environment:', error)
  process.exit(1)
})
