import { AggregateRoot } from '@/contexts/shared/domain/AggregateRoot';
import { BookId } from './BookId';
import { BookTitle } from './BookTitle';
import { BookAuthor } from './BookAuthor';
import { BookIsbn } from './BookIsbn';
import { BookCreatedDomainEvent } from './event/BookCreatedDomainEvent';
import { BookUpdatedDomainEvent } from './event/BookUpdatedDomainEvent';

type BookPrimitives = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  createdAt: Date;
  updatedAt: Date;
};

type CreateBookParams = {
  id: BookId;
  title: BookTitle;
  author: BookAuthor;
  isbn: BookIsbn;
  createdAt: Date;
  updatedAt: Date;
};

type UpdateBookParams = {
  title: BookTitle;
  author: BookAuthor;
  isbn: BookIsbn;
};

export class Book extends AggregateRoot {
  readonly id: BookId;
  title: BookTitle;
  author: BookAuthor;
  isbn: BookIsbn;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(params: CreateBookParams) {
    super();
    this.id = params.id;
    this.title = params.title;
    this.author = params.author;
    this.isbn = params.isbn;
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
      updatedAt: now,
    });

    this.record(new BookUpdatedDomainEvent({
      aggregateId: this.id.value,
      title: params.title.value,
      author: params.author.value,
      isbn: params.isbn.value,
      updatedAt: now
    }));
  }

  toPrimitives(): BookPrimitives {
    return {
      id: this.id.value,
      title: this.title.value,
      author: this.author.value,
      isbn: this.isbn.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
