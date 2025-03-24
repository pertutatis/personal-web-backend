import { ListBooks } from '../ListBooks';
import { InvalidPaginationParams } from '../InvalidPaginationParams';
import { BookRepository } from '../../domain/BookRepository';
import { Book } from '../../domain/Book';
import { BookId } from '../../domain/BookId';
import { BookTitle } from '../../domain/BookTitle';
import { BookAuthor } from '../../domain/BookAuthor';
import { BookIsbn } from '../../domain/BookIsbn';
import { BookDescription } from '../../domain/BookDescription';
import { BookPurchaseLink } from '../../domain/BookPurchaseLink';
import { Collection } from '@/contexts/shared/domain/Collection';

describe('ListBooks', () => {
  it('should return paginated books', async () => {
    const repository: BookRepository = {
      save: jest.fn(),
      search: jest.fn(),
      searchAll: jest.fn(),
      searchByPage: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchByIds: jest.fn(),
      searchByIsbn: jest.fn(),
    };

    const books = Array.from({ length: 3 }, (_, i) => {
      const now = new Date();
      return Book.create({
        id: BookId.create(`test-id-${i}`),
        title: BookTitle.create(`Test Book ${i}`),
        author: BookAuthor.create(`Test Author ${i}`),
        isbn: BookIsbn.create('9780141036144'),
        description: BookDescription.create(`Test description ${i}`),
        purchaseLink: BookPurchaseLink.create(`https://example.com/book-${i}`),
        createdAt: now,
        updatedAt: now
      });
    });

    const expectedCollection = new Collection(books, {
      page: 1,
      limit: 10,
      total: books.length
    });

    (repository.searchByPage as jest.Mock).mockResolvedValue(expectedCollection);

    const listBooks = new ListBooks(repository);
    const result = await listBooks.run(1, 10);

    expect(repository.searchByPage).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(expectedCollection);
  });

  it('should throw InvalidPaginationParams for invalid page', async () => {
    const repository: BookRepository = {
      save: jest.fn(),
      search: jest.fn(),
      searchAll: jest.fn(),
      searchByPage: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchByIds: jest.fn(),
      searchByIsbn: jest.fn(),
    };

    const listBooks = new ListBooks(repository);

    await expect(listBooks.run(-1, 10)).rejects.toThrow(InvalidPaginationParams);
  });

  it('should throw InvalidPaginationParams for invalid limit', async () => {
    const repository: BookRepository = {
      save: jest.fn(),
      search: jest.fn(),
      searchAll: jest.fn(),
      searchByPage: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchByIds: jest.fn(),
      searchByIsbn: jest.fn(),
    };

    const listBooks = new ListBooks(repository);

    await expect(listBooks.run(1, 0)).rejects.toThrow(InvalidPaginationParams);
  });

  it('should return empty collection when no books exist', async () => {
    const repository: BookRepository = {
      save: jest.fn(),
      search: jest.fn(),
      searchAll: jest.fn(),
      searchByPage: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchByIds: jest.fn(),
      searchByIsbn: jest.fn(),
    };

    const emptyCollection = new Collection([], {
      page: 1,
      limit: 10,
      total: 0
    });

    (repository.searchByPage as jest.Mock).mockResolvedValue(emptyCollection);

    const listBooks = new ListBooks(repository);
    const result = await listBooks.run(1, 10);

    expect(repository.searchByPage).toHaveBeenCalledWith(1, 10);
    expect(result.items).toHaveLength(0);
    expect(result.pagination.total).toBe(0);
  });
});
