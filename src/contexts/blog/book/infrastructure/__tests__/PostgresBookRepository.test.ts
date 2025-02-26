import { Book } from '../../domain/Book';
import { BookId } from '../../domain/BookId';
import { BookTitle } from '../../domain/BookTitle';
import { BookAuthor } from '../../domain/BookAuthor';
import { BookIsbn } from '../../domain/BookIsbn';
import { PostgresBookRepository } from '../PostgresBookRepository';
import { TestDatabase } from '@/contexts/shared/infrastructure/__tests__/TestDatabase';

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
    const now = new Date();
    const book = Book.create({
      id: BookId.create('test-id'),
      title: BookTitle.create('Test Book'),
      author: BookAuthor.create('Test Author'),
      isbn: BookIsbn.create('9780141036144'),
      createdAt: now,
      updatedAt: now
    });

    await repository.save(book);

    const retrieved = await repository.search(BookId.create('test-id'));
    expect(retrieved).not.toBeNull();
    expect(retrieved?.toPrimitives()).toEqual({
      id: 'test-id',
      title: 'Test Book',
      author: 'Test Author',
      isbn: '9780141036144',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });

  it('should return null when book not found', async () => {
    const result = await repository.search(BookId.create('non-existent'));
    expect(result).toBeNull();
  });

  it('should update a book', async () => {
    const now = new Date();
    const book = Book.create({
      id: BookId.create('test-id'),
      title: BookTitle.create('Test Book'),
      author: BookAuthor.create('Test Author'),
      isbn: BookIsbn.create('9780141036144'),
      createdAt: now,
      updatedAt: now
    });

    await repository.save(book);

    book.update({
      title: BookTitle.create('Updated Title'),
      author: BookAuthor.create('Updated Author'),
      isbn: BookIsbn.create('9780141036145')
    });

    await repository.update(book);

    const updated = await repository.search(BookId.create('test-id'));
    expect(updated?.title.value).toBe('Updated Title');
    expect(updated?.author.value).toBe('Updated Author');
    expect(updated?.isbn.value).toBe('9780141036145');
  });

  it('should list books with pagination', async () => {
    const now = new Date();
    const books = Array.from({ length: 5 }, (_, i) => 
      Book.create({
        id: BookId.create(`test-id-${i}`),
        title: BookTitle.create(`Test Book ${i}`),
        author: BookAuthor.create(`Test Author ${i}`),
        isbn: BookIsbn.create(`978014103614${i}`),
        createdAt: now,
        updatedAt: now
      })
    );

    await Promise.all(books.map(book => repository.save(book)));

    const page1 = await repository.searchByPage(1, 2);
    const page2 = await repository.searchByPage(2, 2);
    const page3 = await repository.searchByPage(3, 2);

    expect(page1.items).toHaveLength(2);
    expect(page2.items).toHaveLength(2);
    expect(page3.items).toHaveLength(1);
  });
});
