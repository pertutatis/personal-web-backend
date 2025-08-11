import {
  DomainEvent,
  DomainEventJSON,
} from '@/contexts/shared/domain/DomainEvent'

type SeriesCreatedEventBody = {
  readonly aggregateId: string
  readonly title: string
  readonly description: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly occurredOn: Date
}

export class SeriesCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'series.created'

  readonly title: string
  readonly description: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly occurredOn: Date

  constructor({
    aggregateId,
    title,
    description,
    createdAt,
    updatedAt,
    occurredOn,
  }: SeriesCreatedEventBody) {
    super(aggregateId, SeriesCreatedDomainEvent.EVENT_NAME)
    this.title = title
    this.description = description
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.occurredOn = occurredOn
  }

  toPrimitives(): DomainEventJSON {
    return {
      aggregateId: this.getAggregateId(),
      eventName: this.getEventName(),
      occurredOn: this.occurredOn,
    }
  }

  static fromPrimitives(
    aggregateId: string,
    eventName: string,
    body: {
      title: string
      description: string
      createdAt: Date
      updatedAt: Date
      occurredOn: Date
    },
  ): SeriesCreatedDomainEvent {
    return new SeriesCreatedDomainEvent({
      aggregateId,
      title: body.title,
      description: body.description,
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
      occurredOn: body.occurredOn,
    })
  }
}
