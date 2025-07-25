import { Book } from '../../Book'
import { BookId } from '../../BookId'
import { BookTitle } from '../../BookTitle'
import { BookAuthor } from '../../BookAuthor'
import { BookIsbn } from '../../BookIsbn'
import { BookDescription } from '../../BookDescription'
import { BookPurchaseLink } from '../../BookPurchaseLink'

const DEFAULT_UUID = '123e4567-e89b-4456-a456-426614174000' // Valid UUID v4 format

export class BookMother {
  static create(
    id?: BookId,
    title?: BookTitle,
    author?: BookAuthor,
    isbn?: BookIsbn,
    description?: BookDescription,
    purchaseLink?: BookPurchaseLink,
  ): Book {
    return Book.create({
      id: id || new BookId(DEFAULT_UUID),
      title: title || new BookTitle('Clean Code'),
      author: author || new BookAuthor('Robert C. Martin'),
      isbn: isbn || new BookIsbn('9780132350884'),
      description:
        description ||
        new BookDescription('A comprehensive guide to writing clean code'),
      purchaseLink:
        purchaseLink ||
        BookPurchaseLink.create('https://example.com/clean-code'),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static withDates(createdAt: Date, updatedAt: Date): Book {
    return Book.create({
      id: new BookId(DEFAULT_UUID),
      title: new BookTitle('Clean Code'),
      author: new BookAuthor('Robert C. Martin'),
      isbn: new BookIsbn('9780132350884'),
      description: new BookDescription(
        'A comprehensive guide to writing clean code',
      ),
      purchaseLink: BookPurchaseLink.create('https://example.com/clean-code'),
      createdAt,
      updatedAt,
    })
  }

  static withMultilineDescription(): Book {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      new BookDescription('Line 1\nLine 2\nLine 3'),
    )
  }

  static withEmptyPurchaseLink(): Book {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      BookPurchaseLink.createEmpty(),
    )
  }

  static complete(): Book {
    return this.create()
  }

  static withId(id: string): Book {
    return this.create(new BookId(id))
  }

  static generateValidUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}
