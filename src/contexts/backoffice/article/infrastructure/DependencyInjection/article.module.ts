import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'
import { ArticleSubscribers } from './ArticleSubscribers'

export class ArticleModule {
  static async init(blogConnection: DatabaseConnection): Promise<void> {
    // Initialize event subscribers
    await ArticleSubscribers.init(blogConnection)
  }
}
