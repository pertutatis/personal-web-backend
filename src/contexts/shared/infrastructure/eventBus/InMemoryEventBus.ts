import { EventBus } from '../../domain/EventBus';
import { DomainEvent } from '../../domain/DomainEvent';
import { DomainEventSubscriber } from '../../domain/DomainEventSubscriber';

export class InMemoryEventBus implements EventBus {
  private readonly subscribers: Map<string, DomainEventSubscriber<DomainEvent>[]>;

  constructor() {
    this.subscribers = new Map();
  }

  async publish(events: DomainEvent[]): Promise<void> {
    const promises = events.map(event => this.publishEvent(event));
    await Promise.all(promises);
  }

  registerSubscriber(subscriber: DomainEventSubscriber<DomainEvent>): void {
    subscriber.subscribedTo().forEach(eventName => {
      const eventSubscribers = this.subscribers.get(eventName) || [];
      eventSubscribers.push(subscriber);
      this.subscribers.set(eventName, eventSubscribers);
    });
  }

  private async publishEvent(event: DomainEvent): Promise<void> {
    const eventName = event.getEventName();
    const subscribers = this.subscribers.get(eventName) || [];

    const promises = subscribers.map(subscriber => subscriber.on(event));
    await Promise.all(promises);
  }
}
