import { BookRepository } from '../../domain/BookRepository';
import { DeleteBook } from '../DeleteBook';
import { BookNotFound } from '../BookNotFound';
import { Book } from '../../domain/Book';
import { BookId } from '../../domain/BookId';
import { EventBus } from '@/contexts/shared/domain/EventBus';
import { BookDeletedDomainEvent } from '../../domain/event/BookDeletedDomainEvent';

describe('DeleteBook', () => {
  let repository: jest.Mocked<BookRepository>;
  let eventBus: jest.Mocked<EventBus>;
  let deleteBook: DeleteBook;

  beforeEach(() => {
    repository = {
      search: jest.fn(),
      delete: jest.fn()
    } as any;

    eventBus = {
      publish: jest.fn()
    } as any;

    deleteBook = new DeleteBook(repository, eventBus);
  });

  it('should delete an existing book and publish event', async () => {
    const bookId = 'existing-book-id';
    const book = { id: new BookId(bookId) } as Book;
    
    repository.search.mockResolvedValue(book);
    repository.delete.mockResolvedValue();
    eventBus.publish.mockResolvedValue();

    await deleteBook.run(bookId);

    expect(repository.search).toHaveBeenCalledWith(expect.any(BookId));
    expect(repository.delete).toHaveBeenCalledWith(expect.any(BookId));
    expect(eventBus.publish).toHaveBeenCalledWith([
      expect.any(BookDeletedDomainEvent)
    ]);

    const publishedEvent = eventBus.publish.mock.calls[0][0][0] as BookDeletedDomainEvent;
    expect(publishedEvent.getAggregateId()).toBe(bookId);
    expect(publishedEvent.getEventName()).toBe(BookDeletedDomainEvent.EVENT_NAME);
  });

  it('should throw BookNotFound when book does not exist', async () => {
    const bookId = 'non-existing-book-id';
    repository.search.mockResolvedValue(null);

    await expect(deleteBook.run(bookId)).rejects.toThrow(BookNotFound);
    expect(repository.delete).not.toHaveBeenCalled();
    expect(eventBus.publish).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const bookId = 'existing-book-id';
    const book = { id: new BookId(bookId) } as Book;
    const error = new Error('Database error');

    repository.search.mockResolvedValue(book);
    repository.delete.mockRejectedValue(error);

    await expect(deleteBook.run(bookId)).rejects.toThrow(error);
    expect(eventBus.publish).not.toHaveBeenCalled();
  });

  it('should propagate event bus errors', async () => {
    const bookId = 'existing-book-id';
    const book = { id: new BookId(bookId) } as Book;
    const error = new Error('Event bus error');

    repository.search.mockResolvedValue(book);
    repository.delete.mockResolvedValue();
    eventBus.publish.mockRejectedValue(error);

    await expect(deleteBook.run(bookId)).rejects.toThrow(error);
    expect(repository.delete).toHaveBeenCalled();
  });
});
