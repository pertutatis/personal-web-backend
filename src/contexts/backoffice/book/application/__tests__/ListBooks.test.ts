import { ListBooks } from '../ListBooks';
import { BookRepository } from '../../domain/BookRepository';
import { Book } from '../../domain/Book';
import { BookId } from '../../domain/BookId';
import { BookTitle } from '../../domain/BookTitle';
import { BookAuthor } from '../../domain/BookAuthor';
import { BookIsbn } from '../../domain/BookIsbn';
import { BookPurchaseLink } from '../../domain/BookPurchaseLink';
import { BookDescription } from '../../domain/BookDescription';
import { Collection } from '@/contexts/shared/domain/Collection';
import { InvalidPaginationParams } from '../InvalidPaginationParams';
import { BookIdMother } from '../../domain/__tests__/mothers/BookIdMother';

describe('ListBooks', () => {
  let repository: jest.Mocked<BookRepository>;
  let listBooks: ListBooks;

  beforeEach(() => {
    repository = {
      searchByPage: jest.fn(),
    } as unknown as jest.Mocked<BookRepository>;

    listBooks = new ListBooks(repository);
  });

  it('should return paginated books', async () => {
    const books = Array.from({ length: 2 }, (_, i) => {
      const now = new Date();
      return Book.create({
        id: BookIdMother.sequence(i + 1),
        title: new BookTitle(`Test Book ${i}`),
        author: new BookAuthor(`Test Author ${i}`),
        isbn: new BookIsbn('9780141036144'),
        description: new BookDescription('Test description'),
        purchaseLink: BookPurchaseLink.create('https://example.com'),
        createdAt: now,
        updatedAt: now
      });
    });

    const collection = new Collection(books, {
      page: 1,
      limit: 10,
      total: 2
    });

    repository.searchByPage.mockResolvedValue(collection);

    const result = await listBooks.run({ page: 1, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
    expect(result.pagination.total).toBe(2);
  });

  it('should throw error on invalid pagination parameters', async () => {
    await expect(listBooks.run({ page: 0, limit: 10 }))
      .rejects
      .toThrow(InvalidPaginationParams);

    await expect(listBooks.run({ page: 1, limit: 0 }))
      .rejects
      .toThrow(InvalidPaginationParams);
  });
});
