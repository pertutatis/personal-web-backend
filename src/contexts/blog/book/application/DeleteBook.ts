import { BookRepository } from '../domain/BookRepository';
import { BookId } from '../domain/BookId';
import { BookNotFound } from './BookNotFound';

export class DeleteBook {
  constructor(private readonly repository: BookRepository) {}

  async run(id: string): Promise<void> {
    const bookId = new BookId(id);
    const book = await this.repository.search(bookId);

    if (!book) {
      throw new BookNotFound(bookId);
    }

    await this.repository.delete(bookId);
  }
}
