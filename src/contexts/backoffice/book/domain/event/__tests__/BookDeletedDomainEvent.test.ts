import { BookDeletedDomainEvent } from '../BookDeletedDomainEvent';

describe('BookDeletedDomainEvent', () => {
  it('should create event with correct values', () => {
    const aggregateId = 'book-123';
    const occurredOn = new Date();

    const event = new BookDeletedDomainEvent({
      aggregateId,
      occurredOn
    });

    expect(event.getAggregateId()).toBe(aggregateId);
    expect(event.getEventName()).toBe(BookDeletedDomainEvent.EVENT_NAME);
    expect(event.occurredOn).toBe(occurredOn);
  });

  it('should create event from primitives', () => {
    const aggregateId = 'book-123';
    const occurredOn = new Date();

    const event = BookDeletedDomainEvent.fromPrimitives(
      aggregateId,
      BookDeletedDomainEvent.EVENT_NAME,
      { occurredOn }
    );

    expect(event).toBeInstanceOf(BookDeletedDomainEvent);
    expect(event.getAggregateId()).toBe(aggregateId);
    expect(event.getEventName()).toBe(BookDeletedDomainEvent.EVENT_NAME);
    expect(event.occurredOn).toBe(occurredOn);
  });

  it('should convert to primitives', () => {
    const aggregateId = 'book-123';
    const occurredOn = new Date();

    const event = new BookDeletedDomainEvent({
      aggregateId,
      occurredOn
    });

    const primitives = event.toPrimitives();

    expect(primitives).toEqual({
      aggregateId,
      eventName: BookDeletedDomainEvent.EVENT_NAME,
      occurredOn
    });
  });
});
