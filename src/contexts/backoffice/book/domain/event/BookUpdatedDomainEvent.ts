import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent';

export type BookUpdatedDomainEventProps = {
  aggregateId: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  purchaseLink: string | null;
  updatedAt: Date;
};

export class BookUpdatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'book.updated';

  readonly title: string;
  readonly author: string;
  readonly isbn: string;
  readonly description: string;
  readonly purchaseLink: string | null;
  readonly updatedAt: Date;

  constructor(props: BookUpdatedDomainEventProps) {
    super(BookUpdatedDomainEvent.EVENT_NAME, props.aggregateId);

    this.title = props.title;
    this.author = props.author;
    this.isbn = props.isbn;
    this.description = props.description;
    this.purchaseLink = props.purchaseLink;
    this.updatedAt = props.updatedAt;
  }

  toPrimitives(): BookUpdatedDomainEventProps {
    return {
      aggregateId: this.aggregateId,
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      description: this.description,
      purchaseLink: this.purchaseLink,
      updatedAt: this.updatedAt,
    };
  }
}
