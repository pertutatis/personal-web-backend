import { BlogBook } from '../../BlogBook';
import { v4 as uuid } from 'uuid';

export class BlogBookMother {
  static create(
    id: string = uuid(),
    title: string = 'Clean Code',
    author: string = 'Robert C. Martin',
    isbn: string = '9780132350884',
    description: string = 'A book about writing clean code',
    purchaseLink: string | null = 'https://example.com/clean-code',
    createdAt: Date = new Date('2024-01-01'),
    updatedAt: Date = new Date('2024-01-02')
  ): BlogBook {
    return new BlogBook(
      id,
      title,
      author,
      isbn,
      description,
      purchaseLink,
      createdAt,
      updatedAt
    );
  }

  static withNullPurchaseLink(): BlogBook {
    return this.create(
      uuid(),
      'Clean Code',
      'Robert C. Martin',
      '9780132350884',
      'A book about writing clean code',
      null
    );
  }

  static createMultiple(count: number): BlogBook[] {
    return Array.from({ length: count }, (_, index) => 
      this.create(
        uuid(),
        `Book ${index + 1}`,
        `Author ${index + 1}`,
        `978013235088${index}`,
        `Description for book ${index + 1}`,
        `https://example.com/book-${index + 1}`
      )
    );
  }
}
