import { ArticleBookReferenceRemover } from '../ArticleBookReferenceRemover';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { BookDeletedDomainEvent } from '@/contexts/backoffice/book/domain/event/BookDeletedDomainEvent';
import { RemoveBookReference } from '../RemoveBookReference';

describe('ArticleBookReferenceRemover', () => {
  let repository: jest.Mocked<ArticleRepository>;
  let removeBookReference: RemoveBookReference;
  let remover: ArticleBookReferenceRemover;

  beforeEach(() => {
    repository = {
      removeBookReference: jest.fn()
    } as any;

    removeBookReference = new RemoveBookReference(repository);
    remover = new ArticleBookReferenceRemover(removeBookReference);
  });

  it('should subscribe to BookDeletedDomainEvent', () => {
    const subscribedEvents = remover.subscribedTo();

    expect(subscribedEvents).toEqual([BookDeletedDomainEvent.EVENT_NAME]);
  });

  it('should remove book reference when handling BookDeletedDomainEvent', async () => {
    const bookId = 'deleted-book-id';
    const event = new BookDeletedDomainEvent({
      aggregateId: bookId,
      occurredOn: new Date()
    });

    repository.removeBookReference.mockResolvedValue();

    await remover.on(event);

    expect(repository.removeBookReference).toHaveBeenCalledWith(bookId);
  });

  it('should propagate repository errors', async () => {
    const bookId = 'deleted-book-id';
    const event = new BookDeletedDomainEvent({
      aggregateId: bookId,
      occurredOn: new Date()
    });
    const error = new Error('Repository error');

    repository.removeBookReference.mockRejectedValue(error);

    await expect(remover.on(event)).rejects.toThrow(error);
  });
});
