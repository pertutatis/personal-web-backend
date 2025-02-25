import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent';

type ArticleUpdatedDomainEventProps = {
  aggregateId: string;
  title: string;
  content: string;
  bookIds: string[];
  updatedAt: string;
};

export class ArticleUpdatedDomainEvent extends DomainEvent {
  static EVENT_NAME = 'article.updated';

  readonly title: string;
  readonly content: string;
  readonly bookIds: string[];
  readonly updatedAt: string;

  constructor({
    aggregateId,
    title,
    content,
    bookIds,
    updatedAt
  }: ArticleUpdatedDomainEventProps) {
    super({
      eventName: ArticleUpdatedDomainEvent.EVENT_NAME,
      aggregateId
    });
    
    this.title = title;
    this.content = content;
    this.bookIds = bookIds;
    this.updatedAt = updatedAt;
  }

  toPrimitives(): object {
    return {
      title: this.title,
      content: this.content,
      bookIds: this.bookIds,
      updatedAt: this.updatedAt
    };
  }
}
