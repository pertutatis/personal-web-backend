import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent';

export type ArticleUpdatedDomainEventProps = {
  aggregateId: string;
  title: string;
  content: string;
  excerpt: string;
  bookIds: string[];
  updatedAt: Date;
  occurredOn: Date;
};

export class ArticleUpdatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'article.updated';

  readonly title: string;
  readonly content: string;
  readonly excerpt: string;
  readonly bookIds: string[];
  readonly updatedAt: Date;

  constructor(props: ArticleUpdatedDomainEventProps) {
    super(
      ArticleUpdatedDomainEvent.EVENT_NAME,
      props.aggregateId,
      props.occurredOn
    );

    this.title = props.title;
    this.content = props.content;
    this.excerpt = props.excerpt;
    this.bookIds = props.bookIds;
    this.updatedAt = props.updatedAt;
  }

  toPrimitives() {
    return {
      title: this.title,
      content: this.content,
      excerpt: this.excerpt,
      bookIds: this.bookIds,
      updatedAt: this.updatedAt
    };
  }
}
