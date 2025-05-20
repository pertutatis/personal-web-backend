import { AggregateRoot } from '@/contexts/shared/domain/AggregateRoot';
import { ArticleId } from './ArticleId';
import { ArticleTitle } from './ArticleTitle';
import { ArticleContent } from './ArticleContent';
import { ArticleExcerpt } from './ArticleExcerpt';
import { ArticleBookIds } from './ArticleBookIds';
import { ArticleSlug } from './ArticleSlug';
import { ArticleRelatedLinks } from './ArticleRelatedLinks';
import { ArticleCreatedDomainEvent } from './event/ArticleCreatedDomainEvent';
import { ArticleUpdatedDomainEvent } from './event/ArticleUpdatedDomainEvent';

type PrimitiveArticle = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  bookIds: string[];
  relatedLinks: Array<{ text: string; url: string }>;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type CreateArticleParams = {
  id: ArticleId;
  title: ArticleTitle;
  excerpt: ArticleExcerpt;
  content: ArticleContent;
  bookIds: ArticleBookIds;
  relatedLinks?: ArticleRelatedLinks;
  createdAt: Date;
  updatedAt: Date;
  slug?: ArticleSlug;
};

type UpdateArticleParams = Partial<{
  title: ArticleTitle;
  excerpt: ArticleExcerpt;
  content: ArticleContent;
  bookIds: ArticleBookIds;
  relatedLinks: ArticleRelatedLinks;
}>;

export class Article extends AggregateRoot {
  readonly id: ArticleId;
  title: ArticleTitle;
  excerpt: ArticleExcerpt;
  content: ArticleContent;
  bookIds: ArticleBookIds;
  relatedLinks: ArticleRelatedLinks;
  slug: ArticleSlug;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(params: CreateArticleParams) {
    super();
    this.id = params.id;
    this.title = params.title;
    this.excerpt = params.excerpt;
    this.content = params.content;
    this.bookIds = params.bookIds;
    this.relatedLinks = params.relatedLinks ?? ArticleRelatedLinks.create([]);
    this.slug = params.slug ?? ArticleSlug.fromTitle(params.title.value);
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  static async create(params: CreateArticleParams): Promise<Article> {
    const article = new Article(params);
    article.record(new ArticleCreatedDomainEvent({
      aggregateId: params.id.value,
      title: params.title.value,
      excerpt: params.excerpt.value,
      content: params.content.value,
      bookIds: params.bookIds.getValue(),
      relatedLinks: params.relatedLinks?.toPrimitives() ?? [],
      slug: article.slug.value,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      occurredOn: new Date()
    }));
    return article;
  }

  async update(params: UpdateArticleParams): Promise<Article> {
    if (Object.keys(params).length === 0) {
      return this;
    }

    const now = new Date();

    if (params.title) {
      this.title = params.title;
      this.slug = ArticleSlug.fromTitle(params.title.value);
    }

    if (params.excerpt) {
      this.excerpt = params.excerpt;
    }

    if (params.content) {
      this.content = params.content;
    }

    if (params.bookIds) {
      this.bookIds = params.bookIds;
    }

    if (params.relatedLinks) {
      this.relatedLinks = params.relatedLinks;
    }

    this.updatedAt = now;

    this.record(new ArticleUpdatedDomainEvent({
      aggregateId: this.id.value,
      title: this.title.value,
      excerpt: this.excerpt.value,
      content: this.content.value,
      bookIds: this.bookIds.getValue(),
      relatedLinks: this.relatedLinks.toPrimitives(),
      slug: this.slug.value,
      updatedAt: now,
      occurredOn: now
    }));

    return this;
  }

  toPrimitives(): PrimitiveArticle {
    return {
      id: this.id.value,
      title: this.title.value,
      excerpt: this.excerpt.value,
      content: this.content.value,
      bookIds: this.bookIds.getValue(),
      relatedLinks: this.relatedLinks.toPrimitives(),
      slug: this.slug.value,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}
