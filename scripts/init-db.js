const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

async function initializeDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.ARTICLES_DB_USER,
    password: process.env.ARTICLES_DB_PASSWORD,
    database: process.env.ARTICLES_DB_NAME,
  })

  try {
    await client.connect()
    console.log('Connected to database')

    const sqlFile = path.join(__dirname, '..', 'databases', 'init.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')

    await client.query(sql)
    console.log('Successfully initialized database schema')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  } finally {
    await client.end()
  }
}

initializeDatabase().catch(error => {
  console.error('Database initialization failed:', error)
  process.exit(1)
})
