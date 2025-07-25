import * as dotenv from 'dotenv'
import { join } from 'path'

// Cargar variables de entorno de test
dotenv.config({ path: join(process.cwd(), '.env.test') })

export const config = {
  databases: {
    blog: process.env.DB_NAME || 'test_blog'
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
