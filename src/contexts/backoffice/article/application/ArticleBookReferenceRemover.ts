import { DomainEventSubscriber } from '@/contexts/shared/domain/DomainEventSubscriber';
import { BookDeletedDomainEvent } from '@/contexts/backoffice/book/domain/event/BookDeletedDomainEvent';
import { ArticleRepository } from '../domain/ArticleRepository';

export class ArticleBookReferenceRemover implements DomainEventSubscriber<BookDeletedDomainEvent> {
  constructor(private readonly repository: ArticleRepository) {}

  subscribedTo(): string[] {
    return [BookDeletedDomainEvent.EVENT_NAME];
  }

  async on(event: BookDeletedDomainEvent): Promise<void> {
    const bookId = event.getAggregateId();
    await this.repository.removeBookReference(bookId);
  }
}
