import { Book } from '../domain/Book';
import { BookId } from '../domain/BookId';
import { BookTitle } from '../domain/BookTitle';
import { BookAuthor } from '../domain/BookAuthor';
import { BookIsbn } from '../domain/BookIsbn';
import { BookDescription } from '../domain/BookDescription';
import { BookPurchaseLink } from '../domain/BookPurchaseLink';
import { BookRepository } from '../domain/BookRepository';

export type UpdateBookRequest = {
  id: string;
  title?: string;
  author?: string;
  isbn?: string;
  description?: string;
  purchaseLink?: string | null;
};

export class UpdateBook {
  constructor(private readonly repository: BookRepository) {}

  async run(request: UpdateBookRequest): Promise<Book> {
    const bookId = new BookId(request.id);
    const book = await this.repository.search(bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    const updatedBook = Book.create({
      id: book.id,
      title: request.title ? new BookTitle(request.title) : book.title,
      author: request.author ? new BookAuthor(request.author) : book.author,
      isbn: request.isbn ? new BookIsbn(request.isbn) : book.isbn,
      description: request.description ? new BookDescription(request.description) : book.description,
      purchaseLink: request.purchaseLink === undefined
        ? book.purchaseLink
        : request.purchaseLink === null
          ? BookPurchaseLink.createEmpty()
          : BookPurchaseLink.create(request.purchaseLink),
      createdAt: book.createdAt,
      updatedAt: new Date()
    });

    await this.repository.update(updatedBook);
    return updatedBook;
  }
}
