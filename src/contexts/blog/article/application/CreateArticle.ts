import { Article } from '../domain/Article';
import { ArticleId } from '../domain/ArticleId';
import { ArticleTitle } from '../domain/ArticleTitle';
import { ArticleSlug } from '../domain/ArticleSlug';
import { ArticleContent } from '../domain/ArticleContent';
import { ArticleExcerpt } from '../domain/ArticleExcerpt';
import { ArticleBookIds } from '../domain/ArticleBookIds';
import { ArticleRelatedLinks } from '../domain/ArticleRelatedLinks';
import { ArticleRepository } from '../domain/ArticleRepository';
import { UuidGenerator } from '@/contexts/shared/domain/UuidGenerator';

export type CreateArticleRequest = {
  title: string;
  excerpt: string;
  content: string;
  bookIds: string[];
  relatedLinks: Array<{ text: string; url: string }>;
};

export class CreateArticle {
  constructor(
    private readonly repository: ArticleRepository,
    private readonly uuidGenerator: UuidGenerator
  ) {}

  async run(request: CreateArticleRequest): Promise<Article> {
    const articleId = new ArticleId(await this.uuidGenerator.generate());
    const now = new Date();

    const article = Article.create({
      id: articleId,
      title: new ArticleTitle(request.title),
      excerpt: new ArticleExcerpt(request.excerpt),
      content: new ArticleContent(request.content),
      bookIds: ArticleBookIds.create(request.bookIds),
      relatedLinks: ArticleRelatedLinks.create(request.relatedLinks),
      slug: ArticleSlug.fromTitle(request.title),
      createdAt: now,
      updatedAt: now
    });

    await this.repository.save(article);
    return article;
  }
}
