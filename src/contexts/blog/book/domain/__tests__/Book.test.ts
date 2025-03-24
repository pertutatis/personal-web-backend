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
import { BookMother } from './mothers/BookMother';

describe('Book', () => {
  it('should create a valid book', () => {
    const now = new Date();
    const book = BookMother.withDates(now, now);

    expect(book.id.toString()).toBeDefined();
    expect(book.title.toString()).toBe('Clean Code');
    expect(book.author.toString()).toBe('Robert C. Martin');
    expect(book.isbn.toFormattedString()).toBe('978-0-13-235088-4');
    expect(book.description.toString()).toBe('A comprehensive guide to writing clean code');
    expect(book.purchaseLink.value).toBe('https://example.com/clean-code');
    expect(book.createdAt).toBe(now);
    expect(book.updatedAt).toBe(now);
  });

  it('should create a book with null purchase link', () => {
    const book = BookMother.withoutPurchaseLink();
    expect(book.purchaseLink.value).toBeNull();
  });

  it('should create a book with multiline description', () => {
    const book = BookMother.withMultilineDescription();
    expect(book.description.value).toContain('\n');
  });

  it('should create a book event when created', () => {
    const book = BookMother.create();
    const events = book.pullDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('book.created');
  });

  it('should update book properties', () => {
    const book = BookMother.create();
    const newTitle = 'Updated Title';
    const newAuthor = 'Updated Author';
    const newIsbn = '9780062315007';
    const newDescription = 'Updated description';
    const newPurchaseLink = 'https://example.com/updated';

    book.update({
      title: BookTitle.create(newTitle),
      author: BookAuthor.create(newAuthor),
      isbn: BookIsbn.create(newIsbn),
      description: BookDescription.create(newDescription),
      purchaseLink: BookPurchaseLink.create(newPurchaseLink)
    });

    expect(book.title.toString()).toBe(newTitle);
    expect(book.author.toString()).toBe(newAuthor);
    expect(book.isbn.toFormattedString()).toBe('978-0-06-231500-7');
    expect(book.description.toString()).toBe(newDescription);
    expect(book.purchaseLink.value).toBe(newPurchaseLink);
  });

  it('should create an updated event when updated', () => {
    const book = BookMother.create();
    book.update({
      title: BookTitle.create('Updated Title'),
      author: BookAuthor.create('Updated Author'),
      isbn: BookIsbn.create('9780062315007'),
      description: BookDescription.create('Updated description'),
      purchaseLink: BookPurchaseLink.create('https://example.com/updated')
    });

    const events = book.pullDomainEvents();
    expect(events).toHaveLength(2);
    expect(events[1].eventName).toBe('book.updated');
  });

  it('should convert to primitives', () => {
    const now = new Date();
    const book = BookMother.withDates(now, now);
    const primitives = book.toFormattedPrimitives();

    expect(primitives).toEqual({
      id: book.id.toString(),
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0-13-235088-4',
      description: 'A comprehensive guide to writing clean code',
      purchaseLink: 'https://example.com/clean-code',
      createdAt: now,
      updatedAt: now
    });
  });

  it('should not create book with empty title', () => {
    expect(() => {
      BookMother.create(undefined, BookTitle.create(''));
    }).toThrow(BookTitleEmpty);
  });

  it('should not create book with empty author', () => {
    expect(() => {
      BookMother.create(undefined, undefined, BookAuthor.create(''));
    }).toThrow(BookAuthorEmpty);
  });

  it('should not create book with invalid ISBN', () => {
    expect(() => {
      BookMother.create(undefined, undefined, undefined, BookIsbn.create('invalid'));
    }).toThrow(InvalidBookIsbn);
  });
});
