import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent';

type BookUpdatedDomainEventProps = {
  aggregateId: string;
  title: string;
  author: string;
  isbn: string;
  updatedAt: string;
  eventId?: string;
  occurredOn?: Date;
};

export class BookUpdatedDomainEvent extends DomainEvent {
  static EVENT_NAME = 'book.updated';

  readonly title: string;
  readonly author: string;
  readonly isbn: string;
  readonly updatedAt: string;

  constructor({
    aggregateId,
    title,
    author,
    isbn,
    updatedAt,
    eventId,
    occurredOn
  }: BookUpdatedDomainEventProps) {
    super({
      eventName: BookUpdatedDomainEvent.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn
    });
    
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.updatedAt = updatedAt;
  }

  toPrimitives(): object {
    return {
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      updatedAt: this.updatedAt
    };
  }
}
