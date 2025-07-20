import { BlogArticleRepository } from '../../domain/BlogArticleRepository';
import { PostgresBlogArticleRepository } from './BlogArticleRepository';
import { DatabaseConnectionFactory } from '@/contexts/shared/infrastructure/persistence/DatabaseConnectionFactory';
import { getBlogDatabaseConfig } from '@/contexts/shared/infrastructure/config/database';
import { Logger } from '@/contexts/shared/infrastructure/Logger';

export class BlogArticleRepositoryFactory {
  static async create(): Promise<BlogArticleRepository> {
    try {
      const config = getBlogDatabaseConfig();
      const connection = await DatabaseConnectionFactory.create(config);
      
      Logger.info('Creating BlogArticleRepository with configuration', {
        database: config.database,
        environment: process.env.NODE_ENV
      });

      return new PostgresBlogArticleRepository(connection);
    } catch (error) {
      Logger.error('Error creating BlogArticleRepository:', error);
      throw error;
    }
  }

  static async createForTesting(database: string): Promise<BlogArticleRepository> {
    const connection = await DatabaseConnectionFactory.createTestConnection(database);
    return new PostgresBlogArticleRepository(connection);
  }
}
