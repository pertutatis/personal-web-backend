import { DomainEventSubscriber } from '@/contexts/shared/domain/DomainEventSubscriber'
import { BookDeletedDomainEvent } from '@/contexts/backoffice/book/domain/event/BookDeletedDomainEvent'
import { RemoveBookReference } from './RemoveBookReference'

export class ArticleBookReferenceRemover
  implements DomainEventSubscriber<BookDeletedDomainEvent>
{
  constructor(private readonly removeBookReference: RemoveBookReference) {}

  subscribedTo(): Array<string> {
    return [BookDeletedDomainEvent.EVENT_NAME]
  }

  async on(event: BookDeletedDomainEvent): Promise<void> {
    await this.removeBookReference.run(event.getAggregateId())
  }
}
