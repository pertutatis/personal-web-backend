const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

async function initializeDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    await client.connect()
    console.log('Connected to database')

    // Execute base schema
    const sqlFile = path.join(__dirname, '..', 'databases', 'blog.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    await client.query(sql)
    console.log('Successfully initialized database schema')

    // Apply migrations
    const migrationsDir = path.join(__dirname, '..', 'databases', 'migrations')
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort() // Ensure migrations are applied in order

    for (const migrationFile of migrationFiles) {
      try {
        const migrationPath = path.join(migrationsDir, migrationFile)
        const migrationSql = fs.readFileSync(migrationPath, 'utf8')
        await client.query(migrationSql)
        console.log(`Applied migration: ${migrationFile}`)
      } catch (error) {
        // Skip if migration already applied (column/constraint already exists)
        if (
          error.message.includes('already exists') ||
          error.message.includes('column') ||
          error.message.includes('constraint')
        ) {
          console.log(`Migration ${migrationFile} already applied (skipped)`)
        } else {
          throw error
        }
      }
    }

    console.log('All migrations applied successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  } finally {
    await client.end()
  }
}

initializeDatabase().catch((error) => {
  console.error('Database initialization failed:', error)
  process.exit(1)
})
