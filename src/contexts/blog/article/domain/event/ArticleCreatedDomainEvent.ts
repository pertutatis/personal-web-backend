import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent';

export type ArticleCreatedDomainEventProps = {
  aggregateId: string;
  title: string;
  content: string;
  excerpt: string;
  bookIds: string[];
  createdAt: Date;
  updatedAt: Date;
  occurredOn: Date;
};

export class ArticleCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'article.created';

  readonly title: string;
  readonly content: string;
  readonly excerpt: string;
  readonly bookIds: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ArticleCreatedDomainEventProps) {
    super(
      ArticleCreatedDomainEvent.EVENT_NAME,
      props.aggregateId,
      props.occurredOn
    );

    this.title = props.title;
    this.content = props.content;
    this.excerpt = props.excerpt;
    this.bookIds = props.bookIds;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  toPrimitives() {
    return {
      title: this.title,
      content: this.content,
      excerpt: this.excerpt,
      bookIds: this.bookIds,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
