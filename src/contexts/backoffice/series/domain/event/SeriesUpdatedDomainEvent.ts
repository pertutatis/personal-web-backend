import {
  DomainEvent,
  DomainEventJSON,
} from '@/contexts/shared/domain/DomainEvent'

type SeriesUpdatedEventBody = {
  readonly aggregateId: string
  readonly title: string
  readonly description: string
  readonly updatedAt: Date
  readonly occurredOn: Date
}

export class SeriesUpdatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'series.updated'

  readonly title: string
  readonly description: string
  readonly updatedAt: Date
  readonly occurredOn: Date

  constructor({
    aggregateId,
    title,
    description,
    updatedAt,
    occurredOn,
  }: SeriesUpdatedEventBody) {
    super(aggregateId, SeriesUpdatedDomainEvent.EVENT_NAME)
    this.title = title
    this.description = description
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
      updatedAt: Date
      occurredOn: Date
    },
  ): SeriesUpdatedDomainEvent {
    return new SeriesUpdatedDomainEvent({
      aggregateId,
      title: body.title,
      description: body.description,
      updatedAt: body.updatedAt,
      occurredOn: body.occurredOn,
    })
  }
}
