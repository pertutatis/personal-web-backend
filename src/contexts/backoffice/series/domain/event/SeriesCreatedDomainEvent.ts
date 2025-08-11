import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent'

type PrimitiveSeriesCreated = {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  occurredOn: Date
}

export class SeriesCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'series.created'

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
  }: PrimitiveSeriesCreated) {
    super(SeriesCreatedDomainEvent.EVENT_NAME, id, occurredOn)
    this.title = title
    this.description = description
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  toPrimitives(): PrimitiveSeriesCreated {
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
