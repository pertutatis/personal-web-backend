import { Article } from '../domain/Article';
import { ArticleId } from '../domain/ArticleId';
import { ArticleRepository } from '../domain/ArticleRepository';
import { ArticleNotFound } from './ArticleNotFound';

export class GetArticle {
  constructor(private readonly repository: ArticleRepository) {}

  async run(id: string): Promise<Article> {
    const article = await this.repository.search(ArticleId.create(id));

    if (!article) {
      throw new ArticleNotFound(id);
    }

    return article;
  }
}
