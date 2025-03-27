import { Book } from '../../Book';
import { BookId } from '../../BookId';
import { BookTitle } from '../../BookTitle';
import { BookAuthor } from '../../BookAuthor';
import { BookIsbn } from '../../BookIsbn';
import { BookDescription } from '../../BookDescription';
import { BookPurchaseLink } from '../../BookPurchaseLink';

export class BookMother {
  static create(
    id?: BookId,
    title?: BookTitle,
    author?: BookAuthor,
    isbn?: BookIsbn,
    description?: BookDescription,
    purchaseLink?: BookPurchaseLink
  ): Book {
    return Book.create({
      id: id || new BookId('test-id'),
      title: title || new BookTitle('Clean Code'),
      author: author || new BookAuthor('Robert C. Martin'),
      isbn: isbn || new BookIsbn('9780132350884'),
      description: description || new BookDescription('A comprehensive guide to writing clean code'),
      purchaseLink: purchaseLink || BookPurchaseLink.create('https://example.com/clean-code'),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  static withDates(createdAt: Date, updatedAt: Date): Book {
    return Book.create({
      id: new BookId('test-id'),
      title: new BookTitle('Clean Code'),
      author: new BookAuthor('Robert C. Martin'),
      isbn: new BookIsbn('9780132350884'),
      description: new BookDescription('A comprehensive guide to writing clean code'),
      purchaseLink: BookPurchaseLink.create('https://example.com/clean-code'),
      createdAt,
      updatedAt
    });
  }

  static withMultilineDescription(): Book {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      new BookDescription('Line 1\nLine 2\nLine 3')
    );
  }

  static withEmptyPurchaseLink(): Book {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      BookPurchaseLink.createEmpty()
    );
  }

  static complete(): Book {
    return this.create();
  }
}
