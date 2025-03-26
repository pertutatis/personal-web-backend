import { Article } from '../domain/Article';
import { ArticleId } from '../domain/ArticleId';
import { ArticleTitle } from '../domain/ArticleTitle';
import { ArticleExcerpt } from '../domain/ArticleExcerpt';
import { ArticleContent } from '../domain/ArticleContent';
import { ArticleBookIds } from '../domain/ArticleBookIds';
import { ArticleRepository } from '../domain/ArticleRepository';
import { UuidGenerator } from '@/contexts/shared/domain/UuidGenerator';
import { ArticleRelatedLinks } from '../domain/ArticleRelatedLinks';
import { ArticleRelatedLink } from '../domain/ArticleRelatedLink';

export type CreateArticleRequest = {
  title: string;
  excerpt: string;
  content: string;
  bookIds: string[];
  relatedLinks?: Array<{ text: string; url: string }>;
};

export class CreateArticle {
  constructor(
    private readonly repository: ArticleRepository,
    private readonly uuidGenerator: UuidGenerator
  ) {}

  async run(request: CreateArticleRequest): Promise<Article> {
    const articleId = await this.uuidGenerator.generate();

    const relatedLinks = (request.relatedLinks || []).map(link => 
      ArticleRelatedLink.create(link.text, link.url)
    );

    const article = Article.create({
      id: ArticleId.create(articleId),
      title: ArticleTitle.create(request.title),
      excerpt: ArticleExcerpt.create(request.excerpt),
      content: ArticleContent.create(request.content),
      bookIds: ArticleBookIds.create(request.bookIds),
      relatedLinks: ArticleRelatedLinks.create(relatedLinks),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.repository.save(article);
    return article;
  }
}
