import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent';

export type ArticleUpdatedDomainEventProps = {
  aggregateId: string;
  title: string;
  content: string;
  bookIds: string[];
  updatedAt: Date;
  occurredOn?: Date;
};

export class ArticleUpdatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'article.updated';

  readonly title: string;
  readonly content: string;
  readonly bookIds: string[];
  readonly updatedAt: Date;

  constructor({
    aggregateId,
    title,
    content,
    bookIds,
    updatedAt,
    occurredOn
  }: ArticleUpdatedDomainEventProps) {
    super(ArticleUpdatedDomainEvent.EVENT_NAME, aggregateId, occurredOn);
    this.title = title;
    this.content = content;
    this.bookIds = bookIds;
    this.updatedAt = updatedAt;
  }

  toPrimitives(): ArticleUpdatedDomainEventProps {
    return {
      aggregateId: this.aggregateId,
      title: this.title,
      content: this.content,
      bookIds: this.bookIds,
      updatedAt: this.updatedAt,
      occurredOn: this.occurredOn
    };
  }
}
