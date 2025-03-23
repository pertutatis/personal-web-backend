import { ArticleRepository } from '../domain/ArticleRepository';
import { ArticleId } from '../domain/ArticleId';
import { ArticleNotFound } from './ArticleNotFound';

export class DeleteArticle {
  constructor(private readonly repository: ArticleRepository) {}

  async run(id: string): Promise<void> {
    const articleId = ArticleId.create(id);
    const article = await this.repository.search(articleId);

    if (!article) {
      throw new ArticleNotFound(articleId);
    }

    await this.repository.delete(articleId);
  }
}
