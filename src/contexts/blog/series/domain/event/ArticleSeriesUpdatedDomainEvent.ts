import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent'

type PrimitiveArticleSeriesUpdated = {
  id: string
  title: string
  description: string
  updatedAt: Date
  occurredOn: Date
}

export class ArticleSeriesUpdatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'article_series.updated'

  readonly title: string
  readonly description: string
  readonly updatedAt: Date

  constructor({
    id,
    title,
    description,
    updatedAt,
    occurredOn,
  }: PrimitiveArticleSeriesUpdated) {
    super(ArticleSeriesUpdatedDomainEvent.EVENT_NAME, id, occurredOn)
    this.title = title
    this.description = description
    this.updatedAt = updatedAt
  }

  toPrimitives(): PrimitiveArticleSeriesUpdated {
    return {
      id: this.aggregateId,
      title: this.title,
      description: this.description,
      updatedAt: this.updatedAt,
      occurredOn: this.occurredOn,
    }
  }
}
