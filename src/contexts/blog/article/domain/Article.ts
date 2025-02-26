import { AggregateRoot } from '@/contexts/shared/domain/AggregateRoot';
import { ArticleId } from './ArticleId';
import { ArticleTitle } from './ArticleTitle';
import { ArticleContent } from './ArticleContent';
import { ArticleBookIds } from './ArticleBookIds';
import { ArticleCreatedDomainEvent } from './event/ArticleCreatedDomainEvent';
import { ArticleUpdatedDomainEvent } from './event/ArticleUpdatedDomainEvent';

type ArticlePrimitives = {
  id: string;
  title: string;
  content: string;
  bookIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

type CreateArticleParams = {
  id: ArticleId;
  title: ArticleTitle;
  content: ArticleContent;
  bookIds: ArticleBookIds;
  createdAt: Date;
  updatedAt: Date;
};

type UpdateArticleParams = {
  title: ArticleTitle;
  content: ArticleContent;
  bookIds: ArticleBookIds;
};

export class Article extends AggregateRoot {
  readonly id: ArticleId;
  readonly title: ArticleTitle;
  readonly content: ArticleContent;
  readonly bookIds: ArticleBookIds;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(params: CreateArticleParams) {
    super();
    this.id = params.id;
    this.title = params.title;
    this.content = params.content;
    this.bookIds = params.bookIds;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  static create(params: CreateArticleParams): Article {
    const article = new Article(params);
    article.record(new ArticleCreatedDomainEvent({
      aggregateId: params.id.value,
      title: params.title.value,
      content: params.content.value,
      bookIds: params.bookIds.getValue(),
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      occurredOn: new Date()
    }));
    return article;
  }

  update(params: UpdateArticleParams): void {
    const now = new Date();
    
    // Actualizamos directamente las propiedades en la instancia actual
    Object.assign(this, {
      title: params.title,
      content: params.content,
      bookIds: params.bookIds,
      updatedAt: now
    });

    // Registramos el evento en la instancia actual
    this.record(new ArticleUpdatedDomainEvent({
      aggregateId: this.id.value,
      title: params.title.value,
      content: params.content.value,
      bookIds: params.bookIds.getValue(),
      updatedAt: now,
      occurredOn: now
    }));
  }

  toPrimitives(): ArticlePrimitives {
    return {
      id: this.id.value,
      title: this.title.value,
      content: this.content.value,
      bookIds: this.bookIds.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
