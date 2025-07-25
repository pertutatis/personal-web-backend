export type DatabaseConfig = {
  host: string
  port: number
  database: string
  user: string
  password: string
}

export const getBlogConfig = (): DatabaseConfig => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'blog',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
})

export const getTestConfig = (database: string): DatabaseConfig => {
  return {
    host: 'localhost',
    port: 5432,
    database,
    user: 'postgres',
    password: 'postgres',
  }
}
