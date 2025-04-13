import { Book } from '../domain/Book';
import { BookId } from '../domain/BookId';
import { BookTitle } from '../domain/BookTitle';
import { BookAuthor } from '../domain/BookAuthor';
import { BookIsbn } from '../domain/BookIsbn';
import { BookDescription } from '../domain/BookDescription';
import { BookPurchaseLink } from '../domain/BookPurchaseLink';
import { BookRepository } from '../domain/BookRepository';

export type CreateBookRequest = {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description: string;
  purchaseLink?: string | null;
};

export class CreateBook {
  constructor(private readonly repository: BookRepository) {}

  async run(request: CreateBookRequest): Promise<void> {
    const bookId = new BookId(request.id);
    const now = new Date();

    const book = Book.create({
      id: bookId,
      title: new BookTitle(request.title),
      author: new BookAuthor(request.author),
      isbn: request.isbn ? new BookIsbn(request.isbn) : new BookIsbn('0000000000000'),
      description: new BookDescription(request.description),
      purchaseLink: request.purchaseLink === undefined || request.purchaseLink === null
        ? BookPurchaseLink.createEmpty()
        : BookPurchaseLink.create(request.purchaseLink),
      createdAt: now,
      updatedAt: now
    });

    await this.repository.save(book);
  }
}
