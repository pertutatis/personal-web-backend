import { AggregateRoot } from '@/contexts/shared/domain/AggregateRoot';
import { BookId } from './BookId';
import { BookTitle } from './BookTitle';
import { BookAuthor } from './BookAuthor';
import { BookIsbn } from './BookIsbn';
import { BookCreatedDomainEvent } from './event/BookCreatedDomainEvent';
import { BookUpdatedDomainEvent } from './event/BookUpdatedDomainEvent';

export type BookProperties = {
  id: BookId;
  title: BookTitle;
  author: BookAuthor;
  isbn: BookIsbn;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateBookProperties = {
  title: BookTitle;
  author: BookAuthor;
  isbn: BookIsbn;
};

export type BookPrimitives = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  createdAt: string;
  updatedAt: string;
};

export class Book extends AggregateRoot {
  readonly id: BookId;
  private _title: BookTitle;
  private _author: BookAuthor;
  private _isbn: BookIsbn;
  readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(properties: BookProperties) {
    super();
    this.id = properties.id;
    this._title = properties.title;
    this._author = properties.author;
    this._isbn = properties.isbn;
    this.createdAt = properties.createdAt;
    this._updatedAt = properties.updatedAt;
  }

  static create(properties: BookProperties): Book {
    const book = new Book(properties);
    
    book.record(new BookCreatedDomainEvent({
      aggregateId: properties.id.value,
      title: properties.title.value,
      author: properties.author.value,
      isbn: properties.isbn.value,
      createdAt: properties.createdAt.toISOString(),
      updatedAt: properties.updatedAt.toISOString()
    }));

    return book;
  }

  get title(): BookTitle {
    return this._title;
  }

  get author(): BookAuthor {
    return this._author;
  }

  get isbn(): BookIsbn {
    return this._isbn;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  update(properties: UpdateBookProperties): void {
    this._title = properties.title;
    this._author = properties.author;
    this._isbn = properties.isbn;
    this._updatedAt = new Date();

    this.record(new BookUpdatedDomainEvent({
      aggregateId: this.id.value,
      title: this._title.value,
      author: this._author.value,
      isbn: this._isbn.value,
      updatedAt: this._updatedAt.toISOString()
    }));
  }

  toPrimitives(): BookPrimitives {
    return {
      id: this.id.value,
      title: this._title.value,
      author: this._author.value,
      isbn: this._isbn.value,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString()
    };
  }
}
