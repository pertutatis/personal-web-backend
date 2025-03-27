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
  readonly title: ArticleTitle;
  readonly excerpt: ArticleExcerpt;
  readonly content: ArticleContent;
  readonly bookIds: ArticleBookIds;
  readonly relatedLinks: ArticleRelatedLinks;
  readonly slug: ArticleSlug;
  readonly createdAt: Date;
  readonly updatedAt: Date;

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

  static create(params: CreateArticleParams): Article {
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

  update(params: UpdateArticleParams): Article {
    const now = new Date();

    const updatedArticle = new Article({
      id: this.id,
      title: params.title ?? this.title,
      excerpt: params.excerpt ?? this.excerpt,
      content: params.content ?? this.content,
      bookIds: params.bookIds ?? this.bookIds,
      relatedLinks: params.relatedLinks ?? this.relatedLinks,
      createdAt: this.createdAt,
      updatedAt: now,
      // Regenerar el slug solo si el título ha cambiado
      slug: params.title ? ArticleSlug.fromTitle(params.title.value) : this.slug
    });

    if (Object.keys(params).length > 0) {
      updatedArticle.record(new ArticleUpdatedDomainEvent({
        aggregateId: this.id.value,
        title: updatedArticle.title.value,
        excerpt: updatedArticle.excerpt.value,
        content: updatedArticle.content.value,
        bookIds: updatedArticle.bookIds.getValue(),
        relatedLinks: updatedArticle.relatedLinks.toPrimitives(),
        slug: updatedArticle.slug.value,
        updatedAt: now,
        occurredOn: now
      }));
    }

    return updatedArticle;
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
