import { Book } from '../Book';
import { BookId } from '../BookId';
import { BookTitle } from '../BookTitle';
import { BookAuthor } from '../BookAuthor';
import { BookIsbn } from '../BookIsbn';
import { BookTitleEmpty } from '../BookTitleEmpty';
import { BookAuthorEmpty } from '../BookAuthorEmpty';

describe('Book', () => {
  const validBookData = {
    id: BookId.create('test-id'),
    title: BookTitle.create('Test Book'),
    author: BookAuthor.create('Test Author'),
    isbn: BookIsbn.create('9780141036144'),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('should create a valid book', () => {
    const book = Book.create(validBookData);

    expect(book.id.value).toBe('test-id');
    expect(book.title.value).toBe('Test Book');
    expect(book.author.value).toBe('Test Author');
    expect(book.isbn.value).toBe('9780141036144');
    expect(book.createdAt).toBeInstanceOf(Date);
    expect(book.updatedAt).toBeInstanceOf(Date);
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
    const newIsbn = BookIsbn.create('9780141036145');

    book.update({
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn
    });

    expect(book.title.value).toBe('Updated Title');
    expect(book.author.value).toBe('Updated Author');
    expect(book.isbn.value).toBe('9780141036145');
  });

  it('should create an updated event when updated', () => {
    const book = Book.create(validBookData);
    book.update({
      title: BookTitle.create('Updated Title'),
      author: BookAuthor.create('Updated Author'),
      isbn: BookIsbn.create('9780141036145')
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
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });
});
