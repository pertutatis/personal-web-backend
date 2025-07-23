import * as dotenv from 'dotenv'
import { join } from 'path'

// Cargar variables de entorno de test
dotenv.config({ path: join(process.cwd(), '.env.test') })

export const config = {
  databases: {
    articles: process.env.ARTICLES_DB_NAME || 'test_articles',
    auth: process.env.AUTH_DB_NAME || 'auth_test'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'test_secret',
    expiresIn: '1h'
  },
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
}
