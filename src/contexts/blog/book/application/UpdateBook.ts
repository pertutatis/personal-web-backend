import { Book } from '../domain/Book';
import { BookRepository } from '../domain/BookRepository';
import { BookId } from '../domain/BookId';
import { BookTitle } from '../domain/BookTitle';
import { BookAuthor } from '../domain/BookAuthor';
import { BookIsbn } from '../domain/BookIsbn';
import { BookNotFound } from './BookNotFound';

export class UpdateBook {
  constructor(private readonly repository: BookRepository) {}

  async run(request: {
    id: string;
    title?: string;
    author?: string;
    isbn?: string;
  }): Promise<Book> {
    const bookId = BookId.create(request.id);
    const existingBook = await this.repository.search(bookId);
if (!existingBook) {
  throw new BookNotFound(bookId);
}

const book = existingBook;
book.update({
  title: request.title ? BookTitle.create(request.title) : book.title,
  author: request.author ? BookAuthor.create(request.author) : book.author,
  isbn: request.isbn ? BookIsbn.create(request.isbn) : book.isbn
});

await this.repository.update(book);
return book;
  }
}
