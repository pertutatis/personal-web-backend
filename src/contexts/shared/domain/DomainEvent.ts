export abstract class DomainEvent {
  constructor(
    protected readonly aggregateId: string,
    protected readonly eventName: string
  ) {}

  getAggregateId(): string {
    return this.aggregateId;
  }

  getEventName(): string {
    return this.eventName;
  }

  abstract toPrimitives(): DomainEventJSON;
}

export interface DomainEventJSON {
  aggregateId: string;
  eventName: string;
  [key: string]: any;
}
