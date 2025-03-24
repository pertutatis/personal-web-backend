import { AggregateRoot } from '@/contexts/shared/domain/AggregateRoot';
import { BookId } from './BookId';
import { BookTitle } from './BookTitle';
import { BookAuthor } from './BookAuthor';
import { BookIsbn } from './BookIsbn';
import { BookDescription } from './BookDescription';
import { BookPurchaseLink } from './BookPurchaseLink';
import { BookCreatedDomainEvent } from './event/BookCreatedDomainEvent';
import { BookUpdatedDomainEvent } from './event/BookUpdatedDomainEvent';

type BookPrimitives = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  purchaseLink: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateBookParams = {
  id: BookId;
  title: BookTitle;
  author: BookAuthor;
  isbn: BookIsbn;
  description: BookDescription;
  purchaseLink: BookPurchaseLink;
  createdAt: Date;
  updatedAt: Date;
};

type UpdateBookParams = {
  title: BookTitle;
  author: BookAuthor;
  isbn: BookIsbn;
  description: BookDescription;
  purchaseLink: BookPurchaseLink;
};

export class Book extends AggregateRoot {
  readonly id: BookId;
  title: BookTitle;
  author: BookAuthor;
  isbn: BookIsbn;
  description: BookDescription;
  purchaseLink: BookPurchaseLink;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(params: CreateBookParams) {
    super();
    this.id = params.id;
    this.title = params.title;
    this.author = params.author;
    this.isbn = params.isbn;
    this.description = params.description;
    this.purchaseLink = params.purchaseLink;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  static create(params: CreateBookParams): Book {
    const book = new Book(params);
    book.record(new BookCreatedDomainEvent({
      aggregateId: params.id.value,
      title: params.title.value,
      author: params.author.value,
      isbn: params.isbn.value,
      description: params.description.value,
      purchaseLink: params.purchaseLink.value,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt
    }));
    return book;
  }

  update(params: UpdateBookParams): void {
    const now = new Date();

    Object.assign(this, {
      title: params.title,
      author: params.author,
      isbn: params.isbn,
      description: params.description,
      purchaseLink: params.purchaseLink,
      updatedAt: now,
    });

    this.record(new BookUpdatedDomainEvent({
      aggregateId: this.id.value,
      title: params.title.value,
      author: params.author.value,
      isbn: params.isbn.value,
      description: params.description.value,
      purchaseLink: params.purchaseLink.value,
      updatedAt: now
    }));
  }

  toFormattedPrimitives(): BookPrimitives {
    return {
      id: this.id.value,
      title: this.title.value,
      author: this.author.value,
      isbn: this.isbn.toFormattedString(),
      description: this.description.value,
      purchaseLink: this.purchaseLink.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toPrimitives(): BookPrimitives {
    return {
      id: this.id.value,
      title: this.title.value,
      author: this.author.value,
      isbn: this.isbn.value,
      description: this.description.value,
      purchaseLink: this.purchaseLink.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
