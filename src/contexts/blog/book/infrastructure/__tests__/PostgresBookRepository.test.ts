import { Book } from '../../domain/Book';
import { BookId } from '../../domain/BookId';
import { BookTitle } from '../../domain/BookTitle';
import { BookAuthor } from '../../domain/BookAuthor';
import { BookIsbn } from '../../domain/BookIsbn';
import { BookDescription } from '../../domain/BookDescription';
import { BookPurchaseLink } from '../../domain/BookPurchaseLink';
import { PostgresBookRepository } from '../PostgresBookRepository';
import { TestDatabase } from '@/contexts/shared/infrastructure/__tests__/TestDatabase';
import { BookMother } from '../../domain/__tests__/mothers/BookMother';

describe('PostgresBookRepository', () => {
  let repository: PostgresBookRepository;

  beforeAll(async () => {
    const connection = await TestDatabase.getBooksConnection();
    repository = new PostgresBookRepository(connection);
  });

  beforeEach(async () => {
    await TestDatabase.cleanBooks();
  });

  it('should save and retrieve a book', async () => {
    const book = BookMother.create(
      BookId.create('test-id'),
      BookTitle.create('Test Book'),
      BookAuthor.create('Test Author'),
      BookIsbn.create('9780141036144'),
      BookDescription.create('Test Description'),
      BookPurchaseLink.create('https://example.com/book')
    );

    await repository.save(book);

    const retrieved = await repository.search(BookId.create('test-id'));
    expect(retrieved).not.toBeNull();
    expect(retrieved?.toPrimitives()).toEqual({
      id: 'test-id',
      title: 'Test Book',
      author: 'Test Author',
      isbn: '9780141036144',
      description: 'Test Description',
      purchaseLink: 'https://example.com/book',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });

  it('should save and retrieve a book without purchase link', async () => {
    const book = BookMother.withoutPurchaseLink();
    await repository.save(book);

    const retrieved = await repository.search(book.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.purchaseLink.value).toBeNull();
  });

  it('should return null when book not found', async () => {
    const result = await repository.search(BookId.create('non-existent'));
    expect(result).toBeNull();
  });

  it('should update a book', async () => {
    const book = BookMother.create();
    await repository.save(book);

    book.update({
      title: BookTitle.create('Updated Title'),
      author: BookAuthor.create('Updated Author'),
      isbn: BookIsbn.create('9780143039952'),
      description: BookDescription.create('Updated Description'),
      purchaseLink: BookPurchaseLink.create('https://example.com/updated')
    });

    await repository.update(book);

    const updated = await repository.search(book.id);
    expect(updated?.title.value).toBe('Updated Title');
    expect(updated?.author.value).toBe('Updated Author');
    expect(updated?.isbn.value).toBe('9780143039952');
    expect(updated?.description.value).toBe('Updated Description');
    expect(updated?.purchaseLink.value).toBe('https://example.com/updated');
  });

  it('should update a book removing purchase link', async () => {
    const book = BookMother.create();
    await repository.save(book);

    book.update({
      title: BookTitle.create('Updated Title'),
      author: BookAuthor.create('Updated Author'),
      isbn: BookIsbn.create('9780143039952'),
      description: BookDescription.create('Updated Description'),
      purchaseLink: BookPurchaseLink.create(null)
    });

    await repository.update(book);

    const updated = await repository.search(book.id);
    expect(updated?.purchaseLink.value).toBeNull();
  });

  it('should list books with pagination', async () => {
    const validIsbns = [
      '9780141036144',
      '9780143039952',
      '9780141439518',
      '9780141442464',
      '9780140449334'
    ];
    
    const books = Array.from({ length: 5 }, (_, i) => 
      BookMother.create(
        BookId.create(`test-id-${i}`),
        BookTitle.create(`Test Book ${i}`),
        BookAuthor.create(`Test Author ${i}`),
        BookIsbn.create(validIsbns[i]),
        BookDescription.create(`Test Description ${i}`),
        BookPurchaseLink.create(`https://example.com/book-${i}`)
      )
    );

    await Promise.all(books.map(book => repository.save(book)));

    const page1 = await repository.searchByPage(1, 2);
    const page2 = await repository.searchByPage(2, 2);
    const page3 = await repository.searchByPage(3, 2);

    expect(page1.items).toHaveLength(2);
    expect(page2.items).toHaveLength(2);
    expect(page3.items).toHaveLength(1);

    expect(page1.items[0].description.value).toBeDefined();
    expect(page1.items[0].purchaseLink.value).toBeDefined();
  });
});
