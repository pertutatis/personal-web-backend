import { Book } from "../../Book";
import { BookId } from "../../BookId";
import { BookTitle } from "../../BookTitle";
import { BookAuthor } from "../../BookAuthor";
import { BookIsbn } from "../../BookIsbn";
import { BookDescription } from "../../BookDescription";
import { BookPurchaseLink } from "../../BookPurchaseLink";

export class BookMother {
  static create(
    id = BookId.create("test-id"),
    title = BookTitle.create("Clean Code"),
    author = BookAuthor.create("Robert C. Martin"),
    isbn = BookIsbn.create("978-0-13-235088-4"),
    description = BookDescription.create("A comprehensive guide to writing clean code"),
    purchaseLink = BookPurchaseLink.create("https://example.com/clean-code"),
    createdAt = new Date(),
    updatedAt = new Date()
  ): Book {
    return Book.create({
      id,
      title,
      author,
      isbn,
      description,
      purchaseLink,
      createdAt,
      updatedAt
    });
  }

  static random(): Book {
    const now = new Date();
    return Book.create({
      id: BookId.create(`test-id-${Math.random()}`),
      title: BookTitle.create(`Test Book ${Math.random()}`),
      author: BookAuthor.create(`Test Author ${Math.random()}`),
      isbn: BookIsbn.create("978-0-13-235088-4"),
      description: BookDescription.create(`Test description ${Math.random()}`),
      purchaseLink: BookPurchaseLink.create(`https://example.com/book-${Math.random()}`),
      createdAt: now,
      updatedAt: now
    });
  }

  static withId(id: string): Book {
    return this.create(BookId.create(id));
  }

  static withTitle(title: string): Book {
    return this.create(undefined, BookTitle.create(title));
  }

  static withAuthor(author: string): Book {
    return this.create(undefined, undefined, BookAuthor.create(author));
  }

  static withIsbn(isbn: string): Book {
    return this.create(undefined, undefined, undefined, BookIsbn.create(isbn));
  }

  static withDescription(description: string): Book {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      BookDescription.create(description)
    );
  }

  static withMultilineDescription(): Book {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      BookDescription.create('Line 1\nLine 2\nLine 3')
    );
  }

  static withPurchaseLink(url: string): Book {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      BookPurchaseLink.create(url)
    );
  }

  static withoutPurchaseLink(): Book {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      BookPurchaseLink.create(null)
    );
  }

  static withDates(createdAt: Date, updatedAt: Date): Book {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      createdAt,
      updatedAt
    );
  }

  static invalid(): Book {
    return this.create(
      BookId.create('invalid'),
      BookTitle.create(''),
      BookAuthor.create(''),
      BookIsbn.create('invalid'),
      BookDescription.create(''),
      BookPurchaseLink.create('invalid-url')
    );
  }
}
