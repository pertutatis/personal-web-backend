import { Book } from '../Book';
import { BookTitleEmpty } from '../BookTitleEmpty';
import { BookAuthorEmpty } from '../BookAuthorEmpty';
import { InvalidBookIsbn } from '../InvalidBookIsbn';
import { BookMother } from './mothers/BookMother';
import { BookTitleMother } from './mothers/BookTitleMother';
import { BookAuthorMother } from './mothers/BookAuthorMother';
import { BookIsbnMother } from './mothers/BookIsbnMother';

describe('Book', () => {
  it('should create a valid book', () => {
    const now = new Date();
    const book = BookMother.withDates(now, now);

    expect(book.id.toString()).toBeDefined();
    expect(book.title.toString()).toBe('Clean Code');
    expect(book.author.toString()).toBe('Robert C. Martin');
    expect(book.isbn.toString()).toBe('978-0-13-235088-4');
    expect(book.createdAt).toBe(now);
    expect(book.updatedAt).toBe(now);
  });

  it('should create a book event when created', () => {
    const book = BookMother.create();
    const events = book.pullDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('book.created');
  });

  it('should update book properties', () => {
    const book = BookMother.create();
    const newTitle = BookTitleMother.create('Updated Title');
    const newAuthor = BookAuthorMother.create('Updated Author');
    const newIsbn = BookIsbnMother.create('9780062315007');

    book.update({
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn
    });

    expect(book.title.toString()).toBe('Updated Title');
    expect(book.author.toString()).toBe('Updated Author');
    expect(book.isbn.toString()).toBe('978-0-06-231500-7');
  });

  it('should create an updated event when updated', () => {
    const book = BookMother.create();
    book.update({
      title: BookTitleMother.create('Updated Title'),
      author: BookAuthorMother.create('Updated Author'),
      isbn: BookIsbnMother.create('9780062315007')
    });

    const events = book.pullDomainEvents();
    expect(events).toHaveLength(2);
    expect(events[1].eventName).toBe('book.updated');
  });

  it('should convert to primitives', () => {
    const now = new Date();
    const book = BookMother.withDates(now, now);
    const primitives = book.toPrimitives();

    expect(primitives).toEqual({
      id: book.id.toString(),
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0-13-235088-4',
      createdAt: now,
      updatedAt: now
    });
  });

  it('should not create book with empty title', () => {
    expect(() => {
      const book = BookMother.create(
        undefined,
        BookTitleMother.empty()
      );
    }).toThrow(BookTitleEmpty);
  });

  it('should not create book with empty author', () => {
    expect(() => {
      const book = BookMother.create(
        undefined,
        undefined,
        BookAuthorMother.empty()
      );
    }).toThrow(BookAuthorEmpty);
  });

  it('should not create book with invalid ISBN', () => {
    expect(() => {
      const book = BookMother.create(
        undefined,
        undefined,
        undefined,
        BookIsbnMother.invalid()
      );
    }).toThrow(InvalidBookIsbn);
  });
});
