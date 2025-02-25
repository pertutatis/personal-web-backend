import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent';

type ArticleCreatedDomainEventProps = {
  aggregateId: string;
  title: string;
  content: string;
  bookIds: string[];
  createdAt: string;
  updatedAt: string;
  eventId?: string;
  occurredOn?: Date;
};

export class ArticleCreatedDomainEvent extends DomainEvent {
  static EVENT_NAME = 'article.created';

  readonly title: string;
  readonly content: string;
  readonly bookIds: string[];
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor({
    aggregateId,
    title,
    content,
    bookIds,
    createdAt,
    updatedAt,
    eventId,
    occurredOn
  }: ArticleCreatedDomainEventProps) {
    super({
      eventName: ArticleCreatedDomainEvent.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn
    });
    
    this.title = title;
    this.content = content;
    this.bookIds = bookIds;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toPrimitives(): object {
    return {
      id: this.aggregateId,
      title: this.title,
      content: this.content,
      bookIds: this.bookIds,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      eventId: this.eventId,
      occurredOn: this.occurredOn
    };
  }
}
