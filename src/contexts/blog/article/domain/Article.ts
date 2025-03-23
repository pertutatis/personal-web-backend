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

type UpdateArticleParams = Partial<{
  title: ArticleTitle;
  content: ArticleContent;
  bookIds: ArticleBookIds;
}>;

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

  update(params: Partial<UpdateArticleParams>): Article {
    // Any update operation should result in a new timestamp
    const now = new Date();
    now.setMilliseconds(0); // Normalize milliseconds to avoid precision issues

    // Determine new values
    const newTitle = params.title !== undefined ? params.title : this.title;
    const newContent = params.content !== undefined ? params.content : this.content;
    const newBookIds = params.bookIds !== undefined ? params.bookIds : this.bookIds;

    // Create new article with updated values
    const updatedArticle = new Article({
      id: this.id,
      title: newTitle,
      content: newContent,
      bookIds: newBookIds,
      createdAt: this.createdAt,
      updatedAt: now
    });

    // Record event if there are any params
    if (Object.keys(params).length > 0) {
      updatedArticle.record(new ArticleUpdatedDomainEvent({
        aggregateId: this.id.value,
        title: updatedArticle.title.value,
        content: updatedArticle.content.value,
        bookIds: updatedArticle.bookIds.getValue(),
        updatedAt: now,
        occurredOn: now
      }));
    }

    return updatedArticle;
  }

  toPrimitives(): Omit<ArticlePrimitives, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string } {
    return {
      id: this.id.value,
      title: this.title.value,
      content: this.content.value,
      bookIds: this.bookIds.getValue(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}
