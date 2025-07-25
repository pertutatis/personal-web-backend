import { BlogArticleRepository } from '../../domain/BlogArticleRepository'
import { PostgresBlogArticleRepository } from './BlogArticleRepository'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { getBlogDatabaseConfig } from '@/contexts/shared/infrastructure/config/database'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export class BlogArticleRepositoryFactory {
  static async create(): Promise<BlogArticleRepository> {
    try {
      const config = getBlogDatabaseConfig()
      const connection = await PostgresConnection.create(config)

      Logger.info('Creating BlogArticleRepository with configuration', {
        database: config.database,
        environment: process.env.NODE_ENV,
      })

      return new PostgresBlogArticleRepository(connection)
    } catch (error) {
      Logger.error('Error creating BlogArticleRepository:', error)
      throw error
    }
  }

  static async createForTesting(
    database: string,
  ): Promise<BlogArticleRepository> {
    const connection = await PostgresConnection.createTestConnection(database)
    return new PostgresBlogArticleRepository(connection)
  }
}
