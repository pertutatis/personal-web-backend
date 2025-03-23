import { Book } from '../domain/Book';
import { BookId } from '../domain/BookId';
import { BookTitle } from '../domain/BookTitle';
import { BookAuthor } from '../domain/BookAuthor';
import { BookIsbn } from '../domain/BookIsbn';
import { BookRepository } from '../domain/BookRepository';
import { UuidGenerator } from '@/contexts/shared/domain/UuidGenerator';

export type CreateBookRequest = {
  title: string;
  author: string;
  isbn?: string;
};

export class CreateBook {
  constructor(
    private readonly repository: BookRepository,
    private readonly uuidGenerator: UuidGenerator
  ) {}

  async run(request: CreateBookRequest): Promise<Book> {
    const bookId = BookId.create(await this.uuidGenerator.generate());

    const book = Book.create({
      id: bookId,
      title: BookTitle.create(request.title),
      author: BookAuthor.create(request.author),
      isbn: request.isbn ? BookIsbn.create(request.isbn) : BookIsbn.create('0000000000000'),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.repository.save(book);
    return book;
  }
}
