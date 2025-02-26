import { Book } from '../Book';
import { BookId } from '../BookId';
import { BookTitle } from '../BookTitle';
import { BookAuthor } from '../BookAuthor';
import { BookIsbn } from '../BookIsbn';
import { BookTitleEmpty } from '../BookTitleEmpty';
import { BookAuthorEmpty } from '../BookAuthorEmpty';
import { InvalidBookIsbn } from '../InvalidBookIsbn';

describe('Book', () => {
  const now = new Date();
  const validBookData = {
    id: BookId.create('test-id'),
    title: BookTitle.create('Test Book'),
    author: BookAuthor.create('Test Author'),
    isbn: BookIsbn.create('9780141036144'), // Valid ISBN-13
    createdAt: now,
    updatedAt: now
  };

  it('should create a valid book', () => {
    const book = Book.create(validBookData);

    expect(book.id.toString()).toBe('test-id');
    expect(book.title.toString()).toBe('Test Book');
    expect(book.author.toString()).toBe('Test Author');
    expect(book.isbn.toString()).toBe('9780141036144');
    expect(book.createdAt).toBe(now);
    expect(book.updatedAt).toBe(now);
  });

  it('should create a book event when created', () => {
    const book = Book.create(validBookData);
    const events = book.pullDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('book.created');
  });

  it('should update book properties', () => {
    const book = Book.create(validBookData);
    const newTitle = BookTitle.create('Updated Title');
    const newAuthor = BookAuthor.create('Updated Author');
    const newIsbn = BookIsbn.create('9780062315007'); // Different valid ISBN-13

    book.update({
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn
    });

    expect(book.title.toString()).toBe('Updated Title');
    expect(book.author.toString()).toBe('Updated Author');
    expect(book.isbn.toString()).toBe('9780062315007');
  });

  it('should create an updated event when updated', () => {
    const book = Book.create(validBookData);
    book.update({
      title: BookTitle.create('Updated Title'),
      author: BookAuthor.create('Updated Author'),
      isbn: BookIsbn.create('9780062315007')
    });

    const events = book.pullDomainEvents();
    expect(events).toHaveLength(2);
    expect(events[1].eventName).toBe('book.updated');
  });

  it('should convert to primitives', () => {
    const book = Book.create(validBookData);
    const primitives = book.toPrimitives();

    expect(primitives).toEqual({
      id: 'test-id',
      title: 'Test Book',
      author: 'Test Author',
      isbn: '9780141036144',
      createdAt: now,
      updatedAt: now
    });
  });

  it('should not create book with empty title', () => {
    expect(() =>
      Book.create({
        ...validBookData,
        title: BookTitle.create('')
      })
    ).toThrow(BookTitleEmpty);
  });

  it('should not create book with empty author', () => {
    expect(() =>
      Book.create({
        ...validBookData,
        author: BookAuthor.create('')
      })
    ).toThrow(BookAuthorEmpty);
  });

  it('should not create book with invalid ISBN', () => {
    expect(() =>
      Book.create({
        ...validBookData,
        isbn: BookIsbn.create('invalid-isbn')
      })
    ).toThrow(InvalidBookIsbn);
  });
});
