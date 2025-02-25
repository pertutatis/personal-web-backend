import { PostgresBookRepository } from '../PostgresBookRepository';
import { Book } from '../../domain/Book';
import { BookId } from '../../domain/BookId';
import { BookTitle } from '../../domain/BookTitle';
import { BookAuthor } from '../../domain/BookAuthor';
import { BookIsbn } from '../../domain/BookIsbn';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { getTestConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';

describe('PostgresBookRepository', () => {
  let connection: PostgresConnection;
  let repository: PostgresBookRepository;

  beforeAll(async () => {
    connection = await PostgresConnection.create(getTestConfig('test_books'));
    repository = new PostgresBookRepository(connection);
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.execute('DELETE FROM books');
  });

  it('should save and retrieve a book', async () => {
    const book = Book.create({
      id: BookId.create('test-id'),
      title: BookTitle.create('Test Book'),
      author: BookAuthor.create('Test Author'),
      isbn: BookIsbn.create('9780141036144'),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await repository.save(book);

    const retrieved = await repository.search(BookId.create('test-id'));
    expect(retrieved).not.toBeNull();
    expect(retrieved?.toPrimitives()).toEqual({
      ...book.toPrimitives(),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });

  it('should return null when book not found', async () => {
    const result = await repository.search(BookId.create('non-existent'));
    expect(result).toBeNull();
  });

  it('should update a book', async () => {
    const book = Book.create({
      id: BookId.create('test-id'),
      title: BookTitle.create('Test Book'),
      author: BookAuthor.create('Test Author'),
      isbn: BookIsbn.create('9780141036144'),
      createdAt: new Date(),
      updatedAt: new Date()
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
    const books = Array.from({ length: 5 }, (_, i) => 
      Book.create({
        id: BookId.create(`test-id-${i}`),
        title: BookTitle.create(`Test Book ${i}`),
        author: BookAuthor.create(`Test Author ${i}`),
        isbn: BookIsbn.create(`978014103614${i}`),
        createdAt: new Date(),
        updatedAt: new Date()
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
