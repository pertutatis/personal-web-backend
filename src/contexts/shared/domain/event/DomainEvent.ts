export abstract class DomainEvent {
  static readonly EVENT_NAME: string;
  readonly aggregateId: string;
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;

  constructor({
    eventName,
    aggregateId,
    eventId,
    occurredOn
  }: {
    eventName: string;
    aggregateId: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    this.aggregateId = aggregateId;
    this.eventId = eventId || crypto.randomUUID();
    this.occurredOn = occurredOn || new Date();
    this.eventName = eventName;
  }

  abstract toPrimitives(): object;
}
