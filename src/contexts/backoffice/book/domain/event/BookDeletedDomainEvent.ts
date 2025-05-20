import { DomainEvent, DomainEventJSON } from '@/contexts/shared/domain/DomainEvent';

type BookDeletedDomainEventBody = {
  readonly aggregateId: string;
  readonly occurredOn: Date;
};

export class BookDeletedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'book.deleted';

  readonly occurredOn: Date;

  constructor({ aggregateId, occurredOn }: BookDeletedDomainEventBody) {
    super(aggregateId, BookDeletedDomainEvent.EVENT_NAME);
    this.occurredOn = occurredOn;
  }

  toPrimitives(): DomainEventJSON {
    return {
      aggregateId: this.getAggregateId(),
      eventName: this.getEventName(),
      occurredOn: this.occurredOn
    };
  }

  static fromPrimitives(
    aggregateId: string,
    eventName: string,
    body: { occurredOn: Date }
  ): BookDeletedDomainEvent {
    return new BookDeletedDomainEvent({
      aggregateId,
      occurredOn: body.occurredOn
    });
  }
}
