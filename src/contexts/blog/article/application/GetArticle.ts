import { Article } from '../domain/Article';
import { ArticleRepository } from '../domain/ArticleRepository';
import { ArticleId } from '../domain/ArticleId';
import { ArticleNotFound } from './ArticleNotFound';

export class GetArticle {
  constructor(private readonly repository: ArticleRepository) {}

  async run(id: ArticleId): Promise<Article> {
    const article = await this.repository.search(id);

    if (!article) {
      throw new ArticleNotFound(id);
    }

    return article;
  }
}
