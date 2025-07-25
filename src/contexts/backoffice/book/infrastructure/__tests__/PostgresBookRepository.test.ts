import { Book } from '../../domain/Book';
import { BookId } from '../../domain/BookId';
import { BookTitle } from '../../domain/BookTitle';
import { BookAuthor } from '../../domain/BookAuthor';
import { BookIsbn } from '../../domain/BookIsbn';
import { BookDescription } from '../../domain/BookDescription';
import { BookPurchaseLink } from '../../domain/BookPurchaseLink';
import { BookIdDuplicated } from '../../domain/BookIdDuplicated';
import { PostgresBookRepository } from '../PostgresBookRepository';
import { TestDatabase } from '@/contexts/shared/infrastructure/__tests__/TestDatabase';
import { BookMother } from '../../domain/__tests__/mothers/BookMother';
import { BookIdMother } from '../../domain/__tests__/mothers/BookIdMother';
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection';
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection';
import { getBlogDatabaseConfig } from '@/contexts/shared/infrastructure/config/database';


describe('PostgresBookRepository', () => {
  let repository: PostgresBookRepository;
  let connection: DatabaseConnection;
  
  const validTestId = '123e4567-e89b-4456-a456-426614174000';

  beforeAll(async () => {
    connection = await TestDatabase.getArticlesConnection();
    repository = new PostgresBookRepository(connection);
  });

  afterAll(async () => {
    await TestDatabase.closeAll();
  });

  beforeEach(async () => {
    await TestDatabase.cleanAll();
  });

  describe('exists', () => {
    it('should return true when book exists', async () => {
      const book = BookMother.create();
      await repository.save(book);

      const exists = await repository.exists(book.id);
      expect(exists).toBe(true);
    });

    it('should return false when book does not exist', async () => {
      const exists = await repository.exists(new BookId(validTestId));
      expect(exists).toBe(false);
    });
  });

  describe('save', () => {
    it('should save and retrieve a book', async () => {
      const bookId = validTestId;
      const book = BookMother.create(
        new BookId(bookId),
        new BookTitle('Test Book'),
        new BookAuthor('Test Author'),
        new BookIsbn('9780141036144'),
        new BookDescription('Test Description'),
        BookPurchaseLink.create('https://example.com/book')
      );

      await repository.save(book);

      const retrieved = await repository.search(new BookId(bookId));
      expect(retrieved).not.toBeNull();
      expect(retrieved?.toPrimitives()).toEqual({
        id: bookId,
        title: 'Test Book',
        author: 'Test Author',
        isbn: '9780141036144',
        description: 'Test Description',
        purchaseLink: 'https://example.com/book',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });

    it('should throw BookIdDuplicated when saving with existing id', async () => {
      const book = BookMother.create();
      await repository.save(book);

      const duplicateBook = BookMother.create(
        book.id,
        new BookTitle('Different Title'),
        new BookAuthor('Different Author'),
        new BookIsbn('9780143039952'),
        new BookDescription('Different Description'),
        BookPurchaseLink.create('https://example.com/different')
      );

      await expect(repository.save(duplicateBook)).rejects.toThrow(BookIdDuplicated);
    });

    it('should save and retrieve a book without purchase link', async () => {
      const book = BookMother.withEmptyPurchaseLink();
      await repository.save(book);

      const retrieved = await repository.search(book.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.purchaseLink.value).toBeNull();
    });
  });

  it('should return null when book not found', async () => {
    const result = await repository.search(new BookId(validTestId));
    expect(result).toBeNull();
  });

  it('should update a book', async () => {
    const book = BookMother.create();
    await repository.save(book);

    book.update({
      title: new BookTitle('Updated Title'),
      author: new BookAuthor('Updated Author'),
      isbn: new BookIsbn('9780143039952'),
      description: new BookDescription('Updated Description'),
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
      title: new BookTitle('Updated Title'),
      author: new BookAuthor('Updated Author'),
      isbn: new BookIsbn('9780143039952'),
      description: new BookDescription('Updated Description'),
      purchaseLink: BookPurchaseLink.createEmpty()
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

    const bookIds = [
      '123e4567-e89b-4456-a456-426614174001',
      '123e4567-e89b-4456-a456-426614174002',
      '123e4567-e89b-4456-a456-426614174003',
      '123e4567-e89b-4456-a456-426614174004',
      '123e4567-e89b-4456-a456-426614174005'
    ];
    
    const books = Array.from({ length: 5 }, (_, i) => 
      BookMother.create(
        new BookId(bookIds[i]),
        new BookTitle(`Test Book ${i}`),
        new BookAuthor(`Test Author ${i}`),
        new BookIsbn(validIsbns[i]),
        new BookDescription(`Test Description ${i}`),
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
