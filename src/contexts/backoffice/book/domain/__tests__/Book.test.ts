import { Book } from '../Book';
import { BookId } from '../BookId';
import { BookTitle } from '../BookTitle';
import { BookAuthor } from '../BookAuthor';
import { BookIsbn } from '../BookIsbn';
import { BookDescription } from '../BookDescription';
import { BookPurchaseLink } from '../BookPurchaseLink';
import { BookTitleEmpty } from '../BookTitleEmpty';
import { BookAuthorEmpty } from '../BookAuthorEmpty';
import { InvalidBookIsbn } from '../InvalidBookIsbn';
import { BookIdInvalid } from '../BookIdInvalid';
import { BookMother } from './mothers/BookMother';

describe('Book', () => {
  const defaultDate = new Date('2025-01-01');
  const validUuid = '123e4567-e89b-4456-a456-426614174000';

  it('should create a valid book', () => {
    const book = BookMother.withDates(defaultDate, defaultDate);

    expect(book.id.toString()).toBe(validUuid);
    expect(book.title.toString()).toBe('Clean Code');
    expect(book.author.toString()).toBe('Robert C. Martin');
    expect(book.isbn.toFormattedString()).toBe('978-0-13-235088-4');
    expect(book.description.toString()).toBe('A comprehensive guide to writing clean code');
    expect(book.purchaseLink.toString()).toBe('https://example.com/clean-code');
    expect(book.createdAt).toBe(defaultDate);
    expect(book.updatedAt).toBe(defaultDate);
  });

  it('should create a book with custom UUID', () => {
    const customUuid = BookMother.generateValidUuid();
    const book = BookMother.withId(customUuid);
    expect(book.id.toString()).toBe(customUuid);
  });

  it('should not create book with invalid UUID', () => {
    expect(() => {
      Book.create({
        id: new BookId('invalid-uuid'),
        title: new BookTitle('Test'),
        author: new BookAuthor('Test'),
        isbn: new BookIsbn('9780132350884'),
        description: new BookDescription('Test'),
        purchaseLink: BookPurchaseLink.createEmpty(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }).toThrow(BookIdInvalid);
  });

  it('should create a book with empty purchase link', () => {
    const book = BookMother.withEmptyPurchaseLink();
    expect(book.purchaseLink.isEmpty()).toBe(true);
    expect(book.purchaseLink.value).toBeNull();
  });

  it('should create a book with multiline description', () => {
    const book = BookMother.withMultilineDescription();
    expect(book.description.value).toContain('\n');
  });

  it('should create book event when created', () => {
    const book = Book.create({
      id: new BookId(validUuid),
      title: new BookTitle('Test Book'),
      author: new BookAuthor('Test Author'),
      isbn: new BookIsbn('9780141036144'),
      description: new BookDescription('Test Description'),
      purchaseLink: BookPurchaseLink.createEmpty(),
      createdAt: defaultDate,
      updatedAt: defaultDate
    });

    const events = book.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('book.created');
    
    const eventData = events[0].toPrimitives();
    expect(eventData.purchaseLink).toBeNull();
  });

  it('should update book properties', () => {
    const book = BookMother.create();
    const newTitle = 'Updated Title';
    const newAuthor = 'Updated Author';
    const newIsbn = '9780062315007';
    const newDescription = 'Updated description';
    const newPurchaseLink = 'https://example.com/updated';

    book.update({
      title: new BookTitle(newTitle),
      author: new BookAuthor(newAuthor),
      isbn: new BookIsbn(newIsbn),
      description: new BookDescription(newDescription),
      purchaseLink: BookPurchaseLink.create(newPurchaseLink)
    });

    expect(book.title.toString()).toBe(newTitle);
    expect(book.author.toString()).toBe(newAuthor);
    expect(book.isbn.toFormattedString()).toBe('978-0-06-231500-7');
    expect(book.description.toString()).toBe(newDescription);
    expect(book.purchaseLink.toString()).toBe(newPurchaseLink);
    expect(book.updatedAt).not.toBe(book.createdAt);
  });

  it('should update book removing purchase link', () => {
    const book = BookMother.create();
    book.update({
      title: new BookTitle('Updated Title'),
      author: new BookAuthor('Updated Author'),
      isbn: new BookIsbn('9780062315007'),
      description: new BookDescription('Updated description'),
      purchaseLink: BookPurchaseLink.createEmpty()
    });

    expect(book.purchaseLink.isEmpty()).toBe(true);
    const events = book.pullDomainEvents();
    expect(events[1].eventName).toBe('book.updated');
    expect(events[1].toPrimitives().purchaseLink).toBeNull();
  });

  it('should convert to primitives', () => {
    const book = BookMother.withDates(defaultDate, defaultDate);
    const primitives = book.toFormattedPrimitives();

    expect(primitives).toEqual({
      id: validUuid,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0-13-235088-4',
      description: 'A comprehensive guide to writing clean code',
      purchaseLink: 'https://example.com/clean-code',
      createdAt: defaultDate,
      updatedAt: defaultDate
    });

    // También probar toPrimitives sin formateo
    const rawPrimitives = book.toPrimitives();
    expect(rawPrimitives.isbn).toBe('9780132350884');
  });

  it('should not create book with empty title', () => {
    expect(() => {
      BookMother.create(undefined, new BookTitle(''));
    }).toThrow(BookTitleEmpty);
  });

  it('should not create book with empty author', () => {
    expect(() => {
      BookMother.create(undefined, undefined, new BookAuthor(''));
    }).toThrow(BookAuthorEmpty);
  });

  it('should not create book with invalid ISBN', () => {
    expect(() => {
      BookMother.create(undefined, undefined, undefined, new BookIsbn('invalid'));
    }).toThrow(InvalidBookIsbn);
  });

  it('should maintain creation date when updating', () => {
    const createdAt = new Date('2025-01-01');
    const book = BookMother.withDates(createdAt, createdAt);
    
    book.update({
      title: new BookTitle('New Title'),
      author: new BookAuthor('New Author'),
      isbn: new BookIsbn('9780062315007'),
      description: new BookDescription('New Description'),
      purchaseLink: BookPurchaseLink.createEmpty()
    });

    expect(book.createdAt).toEqual(createdAt);
    expect(book.updatedAt).not.toEqual(createdAt);
  });

  it('should create event with correct data when updated', () => {
    const book = BookMother.create();
    const newTitle = 'Updated Title';
    
    book.update({
      title: new BookTitle(newTitle),
      author: new BookAuthor('Updated Author'),
      isbn: new BookIsbn('9780062315007'),
      description: new BookDescription('Updated description'),
      purchaseLink: BookPurchaseLink.create('https://example.com/updated')
    });

    const events = book.pullDomainEvents();
    const updateEvent = events[1];
    
    expect(updateEvent.eventName).toBe('book.updated');
    const eventData = updateEvent.toPrimitives();
    expect(eventData.title).toBe(newTitle);
    expect(eventData.updatedAt).toBeInstanceOf(Date);
  });
});
