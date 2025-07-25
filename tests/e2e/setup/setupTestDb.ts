import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from './config'
import { Logger } from '../../../src/contexts/shared/infrastructure/Logger'

export class PostgresTestSetup {
  static async setupTestDatabases(): Promise<void> {
    try {
      const recreate =
        process.env.RECREATE_DB === 'true' ||
        process.argv.includes('--recreate')
      const baseConfig = {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: 'postgres',
      }
      if (recreate) {
        const blogPool = new Pool(baseConfig)
        Logger.info('🔄 Eliminando base de datos test_blog si existe...')
        // ...existing code...
        Logger.info('🔄 Creando base de datos test_blog...')
        await this.runQuery(
          blogPool,
          `CREATE DATABASE ${config.databases.blog}`,
        )
        await blogPool.end()

        const blogDbPool = new Pool({
          ...baseConfig,
          database: config.databases.blog,
        })

        Logger.info('🔄 Configurando esquema de la base de datos test_blog...')
        const blogSchema = readFileSync(
          join(process.cwd(), 'databases/blog.sql'),
          'utf-8',
        )
        await blogDbPool.query(blogSchema)
        const relatedLinksAndSlugMigration = readFileSync(
          join(
            process.cwd(),
            'databases/migrations/004-add-related-links-and-slug-to-articles.sql',
          ),
          'utf-8',
        )
        await this.runQuery(
          blogDbPool,
          relatedLinksAndSlugMigration,
          'Related links columns might already exist',
        )
        await blogDbPool.end()
        Logger.info('✅ test_blog creada y configurada correctamente.')
        Logger.info(
          '\u2705 Test databases created and initialized successfully',
        )
      } else {
        // Modo seguro: crear base si no existe, limpiar tablas y crear esquema si faltan
        const blogPool = new Pool(baseConfig)
        let blogDbExists = true
        try {
          const res = await blogPool.query(
            `SELECT 1 FROM pg_database WHERE datname = '${config.databases.blog}'`,
          )
          blogDbExists = (res.rowCount ?? 0) > 0
        } catch (err) {
          blogDbExists = false
        }
        if (!blogDbExists) {
          Logger.info('La base test_blog no existe, creando...')
          await this.runQuery(
            blogPool,
            `CREATE DATABASE ${config.databases.blog}`,
          )
        }
        await blogPool.end()
        const blogDbPool = new Pool({
          ...baseConfig,
          database: config.databases.blog,
        })
        const tables = ['articles', 'books', 'users']
        let missingTables: string[] = []
        for (const table of tables) {
          try {
            await blogDbPool.query(`SELECT 1 FROM ${table} LIMIT 1`)
          } catch (err) {
            missingTables.push(table)
          }
        }
        if (missingTables.length > 0) {
          Logger.info(
            `Tablas faltantes: ${missingTables.join(', ')}. Ejecutando blog.sql para crearlas...`,
          )
          const blogSchema = readFileSync(
            join(process.cwd(), 'databases/blog.sql'),
            'utf-8',
          )
          await blogDbPool.query(blogSchema)
        }
        const relatedLinksAndSlugMigration = readFileSync(
          join(
            process.cwd(),
            'databases/migrations/004-add-related-links-and-slug-to-articles.sql',
          ),
          'utf-8',
        )
        await this.runQuery(
          blogDbPool,
          relatedLinksAndSlugMigration,
          'Related links columns might already exist',
        )
        for (const table of tables) {
          try {
            await blogDbPool.query(`TRUNCATE ${table} CASCADE`)
          } catch (err) {
            Logger.warn(
              `No se pudo limpiar la tabla ${table}: ${err instanceof Error ? err.message : String(err)}`,
            )
          }
        }
        await blogDbPool.end()
        Logger.info('✅ test_blog lista y tablas limpias')
      }
    } catch (error) {
      Logger.error('❌ Error setting up test databases:', error)
      throw error
    }
  }

  private static async terminateConnections(
    pool: Pool,
    database: string,
  ): Promise<void> {
    const query = `
  -- Eliminado para evitar cierre abrupto de conexiones
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${database}'
      AND pid <> pg_backend_pid();
    `
    try {
      await pool.query(query)
    } catch (error) {
      // Ignore errors here as the database might not exist yet
      Logger.info(
        `Note: Could not terminate connections for ${database} - might not exist yet`,
      )
    }
  }

  private static async runQuery(
    pool: Pool,
    query: string,
    errorMessage?: string,
  ): Promise<void> {
    try {
      await pool.query(query)
    } catch (error) {
      if (errorMessage) {
        Logger.warn(
          `Warning: ${errorMessage}`,
          error instanceof Error ? error.message : String(error),
        )
      } else {
        throw error
      }
    }
  }
}
