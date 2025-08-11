export type DomainEventJSON = {
  aggregateId: string
  eventName: string
  occurredOn: Date
}

export abstract class DomainEvent {
  readonly eventName: string
  readonly aggregateId: string
  readonly occurredOn: Date

  constructor(aggregateId: string, eventName: string) {
    if (!aggregateId) throw new Error('Aggregate ID is required')
    if (!eventName) throw new Error('Event name is required')

    this.aggregateId = aggregateId
    this.eventName = eventName
    this.occurredOn = new Date()
  }

  getAggregateId(): string {
    return this.aggregateId
  }

  getEventName(): string {
    return this.eventName
  }

  getOccurredOn(): Date {
    return this.occurredOn
  }

  abstract toPrimitives(): DomainEventJSON

  static fromPrimitives(
    aggregateId: string,
    eventName: string,
    body: { occurredOn: Date },
  ): DomainEvent {
    throw new Error('Not implemented')
  }
}
