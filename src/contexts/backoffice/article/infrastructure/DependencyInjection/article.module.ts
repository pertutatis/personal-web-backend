import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { ArticleSubscribers } from './ArticleSubscribers';

export class ArticleModule {
  static async init(
    articlesConnection: PostgresConnection,
    booksConnection: PostgresConnection
  ): Promise<void> {
    // Initialize event subscribers
    await ArticleSubscribers.init(articlesConnection, booksConnection);
  }
}
