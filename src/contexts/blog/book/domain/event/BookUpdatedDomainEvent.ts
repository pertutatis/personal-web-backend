import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent';

export type BookUpdatedDomainEventProps = {
  aggregateId: string;
  title: string;
  author: string;
  isbn: string;
  updatedAt: Date;
  occurredOn?: Date;
};

export class BookUpdatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'book.updated';

  readonly title: string;
  readonly author: string;
  readonly isbn: string;
  readonly updatedAt: Date;

  constructor({
    aggregateId,
    title,
    author,
    isbn,
    updatedAt,
    occurredOn
  }: BookUpdatedDomainEventProps) {
    super(BookUpdatedDomainEvent.EVENT_NAME, aggregateId, occurredOn);
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.updatedAt = updatedAt;
  }

  toPrimitives(): BookUpdatedDomainEventProps {
    return {
      aggregateId: this.aggregateId,
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      updatedAt: this.updatedAt,
      occurredOn: this.occurredOn
    };
  }
}
