import { Book } from '../domain/Book';
import { BookRepository } from '../domain/BookRepository';
import { BookId } from '../domain/BookId';
import { BookNotFound } from './BookNotFound';

export class GetBook {
  constructor(private readonly repository: BookRepository) {}

  async run(id: string): Promise<Book> {
    const bookId = new BookId(id);
    const book = await this.repository.findById(bookId);

    if (!book) {
      throw new BookNotFound(id);
    }

    return book;
  }
}
