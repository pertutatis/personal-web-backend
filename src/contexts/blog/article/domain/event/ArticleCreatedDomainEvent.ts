import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent';

export type ArticleCreatedDomainEventProps = {
  aggregateId: string;
  title: string;
  content: string;
  bookIds: string[];
  createdAt: Date;
  updatedAt: Date;
  occurredOn?: Date;
};

export class ArticleCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'article.created';

  readonly title: string;
  readonly content: string;
  readonly bookIds: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor({
    aggregateId,
    title,
    content,
    bookIds,
    createdAt,
    updatedAt,
    occurredOn
  }: ArticleCreatedDomainEventProps) {
    super(ArticleCreatedDomainEvent.EVENT_NAME, aggregateId, occurredOn);
    this.title = title;
    this.content = content;
    this.bookIds = bookIds;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toPrimitives(): ArticleCreatedDomainEventProps {
    return {
      aggregateId: this.aggregateId,
      title: this.title,
      content: this.content,
      bookIds: this.bookIds,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      occurredOn: this.occurredOn
    };
  }
}
