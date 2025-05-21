import { EventBus } from '../../domain/EventBus';
import { DomainEventSubscriber } from '../../domain/DomainEventSubscriber';
import { InMemoryEventBus } from './InMemoryEventBus';

export class EventBusFactory {
  private static instance: EventBus;
  private static subscribers: Array<DomainEventSubscriber<any>> = [];

  static getInstance(): EventBus {
    if (!EventBusFactory.instance) {
      EventBusFactory.instance = new InMemoryEventBus();
      
      // Register all subscribers
      const eventBus = EventBusFactory.instance as InMemoryEventBus;
      EventBusFactory.subscribers.forEach(subscriber => {
        eventBus.registerSubscriber(subscriber);
      });
    }

    return EventBusFactory.instance;
  }

  static registerSubscriber(subscriber: DomainEventSubscriber<any>): void {
    EventBusFactory.subscribers.push(subscriber);

    if (EventBusFactory.instance) {
      const eventBus = EventBusFactory.instance as InMemoryEventBus;
      eventBus.registerSubscriber(subscriber);
    }
  }
}
