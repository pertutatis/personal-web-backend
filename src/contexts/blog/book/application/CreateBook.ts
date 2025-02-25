import { Book } from '../domain/Book';
import { BookRepository } from '../domain/BookRepository';
import { BookId } from '../domain/BookId';
import { BookTitle } from '../domain/BookTitle';
import { BookAuthor } from '../domain/BookAuthor';
import { BookIsbn } from '../domain/BookIsbn';
import { UuidGenerator } from '../../../shared/domain/UuidGenerator';

export class CreateBook {
  constructor(
    private readonly repository: BookRepository,
    private readonly uuidGenerator: UuidGenerator
  ) {}

  async run(request: {
    title: string;
    author: string;
    isbn?: string;
  }): Promise<void> {
    const bookId = new BookId(await this.uuidGenerator.generate());
    const book = Book.create(
      bookId,
      new BookTitle(request.title),
      new BookAuthor(request.author),
      request.isbn ? new BookIsbn(request.isbn) : undefined
    );

    await this.repository.save(book);
  }
}
