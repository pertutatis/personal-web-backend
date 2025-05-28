const { execSync } = require('child_process')
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

async function initializeDatabase(config) {
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  })

  try {
    await client.connect()
    console.log(`Connected to database: ${config.database}`)

    const sqlFile = path.join(__dirname, '..', 'databases', `${config.sqlFile}`)
    const sql = fs.readFileSync(sqlFile, 'utf8')

    await client.query(sql)
    console.log(`Successfully initialized ${config.database} database`)
  } catch (error) {
    console.error(`Error initializing ${config.database} database:`, error)
    throw error
  } finally {
    await client.end()
  }
}

async function main() {
  const configs = [
    {
      host: process.env.DB_HOST,
      port: process.env.ARTICLES_DB_PORT || 5432,
      user: process.env.ARTICLES_DB_USER,
      password: process.env.ARTICLES_DB_PASSWORD,
      database: process.env.ARTICLES_DB_NAME,
      sqlFile: 'articles.sql'
    },
    {
      host: process.env.DB_HOST,
      port: process.env.BOOKS_DB_PORT || 5432,
      user: process.env.BOOKS_DB_USER,
      password: process.env.BOOKS_DB_PASSWORD,
      database: process.env.BOOKS_DB_NAME,
      sqlFile: 'books.sql'
    },
    {
      host: process.env.DB_HOST,
      port: process.env.AUTH_DB_PORT || 5432,
      user: process.env.AUTH_DB_USER,
      password: process.env.AUTH_DB_PASSWORD,
      database: process.env.AUTH_DB_NAME,
      sqlFile: 'auth.sql'
    }
  ]

  for (const config of configs) {
    try {
      await initializeDatabase(config)
    } catch (error) {
      console.error(`Failed to initialize ${config.database}:`, error)
      process.exit(1)
    }
  }
}

main().catch(error => {
  console.error('Database initialization failed:', error)
  process.exit(1)
})
