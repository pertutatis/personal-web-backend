import { AggregateRoot } from '@/contexts/shared/domain/AggregateRoot'
import { SeriesId } from './SeriesId'
import { SeriesTitle } from './SeriesTitle'
import { SeriesDescription } from './SeriesDescription'
import { SeriesCreatedDomainEvent } from './event/SeriesCreatedDomainEvent'
import { SeriesUpdatedDomainEvent } from './event/SeriesUpdatedDomainEvent'

type PrimitiveSeries = {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

type CreateSeriesParams = {
  id: SeriesId
  title: SeriesTitle
  description: SeriesDescription
  createdAt: Date
  updatedAt: Date
}

type UpdateSeriesParams = Partial<{
  title: SeriesTitle
  description: SeriesDescription
}>

export class Series extends AggregateRoot {
  readonly id: SeriesId
  title: SeriesTitle
  description: SeriesDescription
  readonly createdAt: Date
  updatedAt: Date

  constructor(params: CreateSeriesParams) {
    super()
    this.id = params.id
    this.title = params.title
    this.description = params.description
    this.createdAt = params.createdAt
    this.updatedAt = params.updatedAt
  }

  static create(params: CreateSeriesParams): Series {
    const series = new Series(params)
    series.record(
      new SeriesCreatedDomainEvent({
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

  update(params: UpdateSeriesParams): Series {
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
      new SeriesUpdatedDomainEvent({
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

  equals(other: Series): boolean {
    return this.id.equals(other.id)
  }
}
