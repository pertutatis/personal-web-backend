import { ArticleBookReferenceRemover } from '../../application/ArticleBookReferenceRemover';
import { RemoveBookReference } from '../../application/RemoveBookReference';
import { PostgresArticleRepository } from '../PostgresArticleRepository';
import { EventBusFactory } from '@/contexts/shared/infrastructure/eventBus/EventBusFactory';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';

export class ArticleSubscribers {
  static async init(
    articlesConnection: PostgresConnection,
    booksConnection: PostgresConnection
  ): Promise<void> {
    // Initialize repository
    const repository = new PostgresArticleRepository(articlesConnection, booksConnection);
    
    // Initialize use case
    const removeBookReference = new RemoveBookReference(repository);
    
    // Initialize and register subscriber
    const subscriber = new ArticleBookReferenceRemover(removeBookReference);
    EventBusFactory.registerSubscriber(subscriber);
  }
}
