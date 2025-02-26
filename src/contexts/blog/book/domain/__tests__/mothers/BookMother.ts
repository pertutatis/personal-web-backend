import { Book } from "../../Book";
import { BookIdMother } from "./BookIdMother";
import { BookTitleMother } from "./BookTitleMother";
import { BookAuthorMother } from "./BookAuthorMother";
import { BookIsbnMother } from "./BookIsbnMother";

export class BookMother {
  static create(
    id = BookIdMother.create(),
    title = BookTitleMother.create(),
    author = BookAuthorMother.create(),
    isbn = BookIsbnMother.create(),
    createdAt = new Date(),
    updatedAt = new Date()
  ): Book {
    return Book.create({
      id,
      title,
      author,
      isbn,
      createdAt,
      updatedAt
    });
  }

  static random(): Book {
    const now = new Date();
    return Book.create({
      id: BookIdMother.random(),
      title: BookTitleMother.random(),
      author: BookAuthorMother.random(),
      isbn: BookIsbnMother.random(),
      createdAt: now,
      updatedAt: now
    });
  }

  static withId(id: string): Book {
    return this.create(
      BookIdMother.create(id)
    );
  }

  static withTitle(title: string): Book {
    return this.create(
      undefined,
      BookTitleMother.create(title)
    );
  }

  static withAuthor(author: string): Book {
    return this.create(
      undefined,
      undefined,
      BookAuthorMother.create(author)
    );
  }

  static withIsbn(isbn: string): Book {
    return this.create(
      undefined,
      undefined,
      undefined,
      BookIsbnMother.create(isbn)
    );
  }

  static withDates(createdAt: Date, updatedAt: Date): Book {
    return this.create(
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
      BookIdMother.invalid(),
      BookTitleMother.empty(),
      BookAuthorMother.empty(),
      BookIsbnMother.invalid()
    );
  }
}
