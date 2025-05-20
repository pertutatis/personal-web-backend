import { DomainEvent } from './DomainEvent';

export interface DomainEventSubscriber<T extends DomainEvent> {
  subscribedTo(): string[];
  on(event: T): Promise<void>;
}
