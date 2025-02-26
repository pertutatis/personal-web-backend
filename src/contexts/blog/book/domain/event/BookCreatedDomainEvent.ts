import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent';

export type BookCreatedDomainEventProps = {
  aggregateId: string;
  title: string;
  author: string;
  isbn: string;
  createdAt: Date;
  updatedAt: Date;
  occurredOn?: Date;
};

export class BookCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'book.created';

  readonly title: string;
  readonly author: string;
  readonly isbn: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor({
    aggregateId,
    title,
    author,
    isbn,
    createdAt,
    updatedAt,
    occurredOn
  }: BookCreatedDomainEventProps) {
    super(BookCreatedDomainEvent.EVENT_NAME, aggregateId, occurredOn);
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toPrimitives(): BookCreatedDomainEventProps {
    return {
      aggregateId: this.aggregateId,
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      occurredOn: this.occurredOn
    };
  }
}
