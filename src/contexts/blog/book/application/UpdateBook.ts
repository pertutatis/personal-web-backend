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
    title: string;
    author: string;
    isbn?: string;
  }): Promise<void> {
    const bookId = new BookId(request.id);
    const existingBook = await this.repository.findById(bookId);

    if (!existingBook) {
      throw new BookNotFound(request.id);
    }

    const updatedBook = existingBook.update(
      new BookTitle(request.title),
      new BookAuthor(request.author),
      request.isbn ? new BookIsbn(request.isbn) : undefined
    );

    await this.repository.update(updatedBook);
  }
}
