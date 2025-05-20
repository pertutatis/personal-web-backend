import { BookRepository } from '../domain/BookRepository';
import { BookId } from '../domain/BookId';
import { BookNotFound } from './BookNotFound';
import { EventBus } from '@/contexts/shared/domain/EventBus';
import { BookDeletedDomainEvent } from '../domain/event/BookDeletedDomainEvent';

export class DeleteBook {
  constructor(
    private readonly repository: BookRepository,
    private readonly eventBus: EventBus
  ) {}

  async run(id: string): Promise<void> {
    const bookId = new BookId(id);
    const book = await this.repository.search(bookId);

    if (!book) {
      throw new BookNotFound(bookId);
    }

    await this.repository.delete(bookId);

    const event = new BookDeletedDomainEvent({
      aggregateId: bookId.value,
      occurredOn: new Date()
    });

    await this.eventBus.publish([event]);
  }
}
