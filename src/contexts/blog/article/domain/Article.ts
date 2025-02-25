import { AggregateRoot } from '@/contexts/shared/domain/AggregateRoot';
import { ArticleId } from './ArticleId';
import { ArticleTitle } from './ArticleTitle';
import { ArticleContent } from './ArticleContent';
import { ArticleBookIds } from './ArticleBookIds';
import { ArticleCreatedDomainEvent } from './event/ArticleCreatedDomainEvent';
import { ArticleUpdatedDomainEvent } from './event/ArticleUpdatedDomainEvent';
import { Book } from '@/contexts/blog/book/domain/Book';

export type ArticleProperties = {
  id: ArticleId;
  title: ArticleTitle;
  content: ArticleContent;
  bookIds: ArticleBookIds;
  books?: Book[];
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateArticleProperties = {
  title: ArticleTitle;
  content: ArticleContent;
  bookIds: ArticleBookIds;
};

export type ArticlePrimitives = {
  id: string;
  title: string;
  content: string;
  bookIds: string[];
  books?: Array<{
    id: string;
    title: string;
    author: string;
    isbn: string;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export class Article extends AggregateRoot {
  readonly id: ArticleId;
  private _title: ArticleTitle;
  private _content: ArticleContent;
  private _bookIds: ArticleBookIds;
  private _books?: Book[];
  readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(properties: ArticleProperties) {
    super();
    this.id = properties.id;
    this._title = properties.title;
    this._content = properties.content;
    this._bookIds = properties.bookIds;
    this._books = properties.books;
    this.createdAt = properties.createdAt;
    this._updatedAt = properties.updatedAt;
  }

  static create(properties: ArticleProperties): Article {
    const article = new Article(properties);
    
    article.record(new ArticleCreatedDomainEvent({
      aggregateId: properties.id.value,
      title: properties.title.value,
      content: properties.content.value,
      bookIds: properties.bookIds.value,
      createdAt: properties.createdAt.toISOString(),
      updatedAt: properties.updatedAt.toISOString()
    }));

    return article;
  }

  get title(): ArticleTitle {
    return this._title;
  }

  get content(): ArticleContent {
    return this._content;
  }

  get bookIds(): ArticleBookIds {
    return this._bookIds;
  }

  get books(): Book[] | undefined {
    return this._books;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  update(properties: UpdateArticleProperties): void {
    this._title = properties.title;
    this._content = properties.content;
    this._bookIds = properties.bookIds;
    this._updatedAt = new Date();

    this.record(new ArticleUpdatedDomainEvent({
      aggregateId: this.id.value,
      title: this._title.value,
      content: this._content.value,
      bookIds: this._bookIds.value,
      updatedAt: this._updatedAt.toISOString()
    }));
  }

  toPrimitives(): ArticlePrimitives {
    return {
      id: this.id.value,
      title: this._title.value,
      content: this._content.value,
      bookIds: this._bookIds.value,
      books: this._books?.map(book => ({
        id: book.id.value,
        title: book.title.value,
        author: book.author.value,
        isbn: book.isbn.value,
        createdAt: book.createdAt.toISOString(),
        updatedAt: book.updatedAt.toISOString()
      })),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString()
    };
  }
}
