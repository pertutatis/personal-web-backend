import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent';

type BookCreatedDomainEventProps = {
  aggregateId: string;
  title: string;
  author: string;
  isbn: string;
  createdAt: string;
  updatedAt: string;
  eventId?: string;
  occurredOn?: Date;
};

export class BookCreatedDomainEvent extends DomainEvent {
  static EVENT_NAME = 'book.created';

  readonly title: string;
  readonly author: string;
  readonly isbn: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor({
    aggregateId,
    title,
    author,
    isbn,
    createdAt,
    updatedAt,
    eventId,
    occurredOn
  }: BookCreatedDomainEventProps) {
    super({
      eventName: BookCreatedDomainEvent.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn
    });
    
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toPrimitives(): object {
    return {
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
