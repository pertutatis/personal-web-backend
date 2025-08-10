import { AggregateRoot } from '@/contexts/shared/domain/AggregateRoot'
import { SeriesId } from './SeriesId'
import { SeriesTitle } from './SeriesTitle'
import { SeriesDescription } from './SeriesDescription'
import { ArticleSeriesCreatedDomainEvent } from './event/ArticleSeriesCreatedDomainEvent'
import { ArticleSeriesUpdatedDomainEvent } from './event/ArticleSeriesUpdatedDomainEvent'

type PrimitiveSeries = {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

type CreateArticleSeriesParams = {
  id: SeriesId
  title: SeriesTitle
  description: SeriesDescription
  createdAt: Date
  updatedAt: Date
}

type UpdateArticleSeriesParams = Partial<{
  title: SeriesTitle
  description: SeriesDescription
}>

export class ArticleSeries extends AggregateRoot {
  readonly id: SeriesId
  title: SeriesTitle
  description: SeriesDescription
  readonly createdAt: Date
  updatedAt: Date

  constructor(params: CreateArticleSeriesParams) {
    super()
    this.id = params.id
    this.title = params.title
    this.description = params.description
    this.createdAt = params.createdAt
    this.updatedAt = params.updatedAt
  }

  static create(params: CreateArticleSeriesParams): ArticleSeries {
    const series = new ArticleSeries(params)
    series.record(
      new ArticleSeriesCreatedDomainEvent({
        id: params.id.value,
        title: params.title.value,
        description: params.description.value,
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
        occurredOn: new Date(),
      }),
    )
    return series
  }

  update(params: UpdateArticleSeriesParams): ArticleSeries {
    if (Object.keys(params).length === 0) {
      return this
    }

    const now = new Date()

    if (params.title) {
      this.title = params.title
    }

    if (params.description) {
      this.description = params.description
    }

    this.updatedAt = now

    this.record(
      new ArticleSeriesUpdatedDomainEvent({
        id: this.id.value,
        title: this.title.value,
        description: this.description.value,
        updatedAt: now,
        occurredOn: now,
      }),
    )

    return this
  }

  toPrimitives(): PrimitiveSeries {
    return {
      id: this.id.value,
      title: this.title.value,
      description: this.description.value,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }

  equals(other: ArticleSeries): boolean {
    return this.id.equals(other.id)
  }
}
