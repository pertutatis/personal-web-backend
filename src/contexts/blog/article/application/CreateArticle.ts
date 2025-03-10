import { Article } from '../domain/Article';
import { ArticleId } from '../domain/ArticleId';
import { ArticleTitle } from '../domain/ArticleTitle';
import { ArticleContent } from '../domain/ArticleContent';
import { ArticleBookIds } from '../domain/ArticleBookIds';
import { ArticleRepository } from '../domain/ArticleRepository';
import { UuidGenerator } from '@/contexts/shared/domain/UuidGenerator';

export type CreateArticleRequest = {
  title: string;
  content: string;
  bookIds: string[];
};

export class CreateArticle {
  constructor(
    private readonly repository: ArticleRepository,
    private readonly uuidGenerator: UuidGenerator
  ) {}

  async run(request: CreateArticleRequest): Promise<void> {
    const articleId = await this.uuidGenerator.generate();

    const article = Article.create({
      id: ArticleId.create(articleId),
      title: ArticleTitle.create(request.title),
      content: ArticleContent.create(request.content),
      bookIds: ArticleBookIds.create(request.bookIds),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.repository.save(article);
  }
}
