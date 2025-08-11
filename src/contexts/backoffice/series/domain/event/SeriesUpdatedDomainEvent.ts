import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent'

type PrimitiveSeriesUpdated = {
  id: string
  title: string
  description: string
  updatedAt: Date
  occurredOn: Date
}

export class SeriesUpdatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'series.updated'

  readonly title: string
  readonly description: string
  readonly updatedAt: Date

  constructor({
    id,
    title,
    description,
    updatedAt,
    occurredOn,
  }: PrimitiveSeriesUpdated) {
    super(SeriesUpdatedDomainEvent.EVENT_NAME, id, occurredOn)
    this.title = title
    this.description = description
    this.updatedAt = updatedAt
  }

  toPrimitives(): PrimitiveSeriesUpdated {
    return {
      id: this.aggregateId,
      title: this.title,
      description: this.description,
      updatedAt: this.updatedAt,
      occurredOn: this.occurredOn,
    }
  }
}
