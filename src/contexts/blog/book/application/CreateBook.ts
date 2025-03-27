import { Book } from '../domain/Book';
import { BookId } from '../domain/BookId';
import { BookTitle } from '../domain/BookTitle';
import { BookAuthor } from '../domain/BookAuthor';
import { BookIsbn } from '../domain/BookIsbn';
import { BookDescription } from '../domain/BookDescription';
import { BookPurchaseLink } from '../domain/BookPurchaseLink';
import { BookRepository } from '../domain/BookRepository';
import { UuidGenerator } from '@/contexts/shared/domain/UuidGenerator';

export type CreateBookRequest = {
  title: string;
  author: string;
  isbn?: string;
  description: string;
  purchaseLink?: string | null;
};

export class CreateBook {
  constructor(
    private readonly repository: BookRepository,
    private readonly uuidGenerator: UuidGenerator
  ) {}

  async run(request: CreateBookRequest): Promise<Book> {
    const bookId = new BookId(await this.uuidGenerator.generate());
    const now = new Date();

    const book = Book.create({
      id: bookId,
      title: new BookTitle(request.title),
      author: new BookAuthor(request.author),
      isbn: request.isbn ? new BookIsbn(request.isbn) : new BookIsbn('0000000000000'),
      description: new BookDescription(request.description),
      purchaseLink: BookPurchaseLink.create(request.purchaseLink),
      createdAt: now,
      updatedAt: now
    });

    await this.repository.save(book);
    return book;
  }
}
