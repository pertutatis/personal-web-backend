import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent'

type PrimitiveArticleSeriesCreated = {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  occurredOn: Date
}

export class ArticleSeriesCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'article_series.created'

  readonly title: string
  readonly description: string
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor({
    id,
    title,
    description,
    createdAt,
    updatedAt,
    occurredOn,
  }: PrimitiveArticleSeriesCreated) {
    super(ArticleSeriesCreatedDomainEvent.EVENT_NAME, id, occurredOn)
    this.title = title
    this.description = description
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  toPrimitives(): PrimitiveArticleSeriesCreated {
    return {
      id: this.aggregateId,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      occurredOn: this.occurredOn,
    }
  }
}
