import { ListBooks } from '../ListBooks';
import { BookRepository } from '../../domain/BookRepository';
import { Book } from '../../domain/Book';
import { BookId } from '../../domain/BookId';
import { BookTitle } from '../../domain/BookTitle';
import { BookAuthor } from '../../domain/BookAuthor';
import { BookIsbn } from '../../domain/BookIsbn';
import { Collection } from '@/contexts/shared/domain/Collection';
import { InvalidPaginationParams } from '../InvalidPaginationParams';

describe('ListBooks', () => {
  let repository: BookRepository;
  let listBooks: ListBooks;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      search: jest.fn(),
      searchAll: jest.fn(),
      searchByPage: jest.fn(),
      searchByIds: jest.fn(),
      update: jest.fn()
    };
    listBooks = new ListBooks(repository);
  });

  it('should return paginated books', async () => {
    const now = new Date();
    const books = Array.from({ length: 2 }, (_, i) => 
      Book.create({
        id: BookId.create(`test-id-${i}`),
        title: BookTitle.create(`Test Book ${i}`),
        author: BookAuthor.create(`Test Author ${i}`),
        isbn: BookIsbn.create('9780141036144'),
        createdAt: now,
        updatedAt: now
      })
    );

    repository.searchByPage = jest.fn().mockResolvedValue(
      new Collection(books, {
        page: 1,
        limit: 10,
        total: 2
      })
    );

    const result = await listBooks.run(1, 10);

    expect(result.items).toHaveLength(2);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 2
    });
    expect(repository.searchByPage).toHaveBeenCalledWith(1, 10);
  });

  it('should throw InvalidPaginationParams for invalid page', async () => {
    await expect(listBooks.run(0, 10))
      .rejects
      .toThrow(InvalidPaginationParams);
  });

  it('should throw InvalidPaginationParams for invalid limit', async () => {
    await expect(listBooks.run(1, 0))
      .rejects
      .toThrow(InvalidPaginationParams);
  });

  it('should return empty collection when no books exist', async () => {
    repository.searchByPage = jest.fn().mockResolvedValue(
      new Collection([], {
        page: 1,
        limit: 10,
        total: 0
      })
    );

    const result = await listBooks.run(1, 10);

    expect(result.items).toHaveLength(0);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 0
    });
  });
});
