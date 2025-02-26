export abstract class DomainEvent {
  static EVENT_NAME: string;
  readonly occurredOn: Date;

  constructor(
    readonly eventName: string,
    readonly aggregateId: string,
    occurredOn?: Date
  ) {
    this.occurredOn = occurredOn || new Date();
  }

  abstract toPrimitives(): any;
}

export type DomainEventProps = {
  aggregateId: string;
  eventName: string;
  occurredOn?: Date;
};
