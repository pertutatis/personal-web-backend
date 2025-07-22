import { ArticleBookReferenceRemover } from '../../application/ArticleBookReferenceRemover';
import { RemoveBookReference } from '../../application/RemoveBookReference';
import { PostgresArticleRepository } from '../PostgresArticleRepository';
import { EventBusFactory } from '@/contexts/shared/infrastructure/eventBus/EventBusFactory';
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection';

export class ArticleSubscribers {
  static async init(
    blogConnection: DatabaseConnection
  ): Promise<void> {
    // Initialize repository
    const repository = new PostgresArticleRepository(blogConnection);
    
    // Initialize use case
    const removeBookReference = new RemoveBookReference(repository);
    
    // Initialize and register subscriber
    const subscriber = new ArticleBookReferenceRemover(removeBookReference);
    EventBusFactory.registerSubscriber(subscriber);
  }
}
