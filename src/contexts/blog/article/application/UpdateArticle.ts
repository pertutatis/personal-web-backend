import { ArticleRepository } from '../domain/ArticleRepository';
import { ArticleId } from '../domain/ArticleId';
import { ArticleTitle } from '../domain/ArticleTitle';
import { ArticleContent } from '../domain/ArticleContent';
import { ArticleBookIds } from '../domain/ArticleBookIds';
import { ArticleNotFound } from './ArticleNotFound';

export type UpdateArticleRequest = {
  id: string;
  title: string;
  content: string;
  bookIds: string[];
};

export class UpdateArticle {
  constructor(private readonly repository: ArticleRepository) {}

  async run(request: UpdateArticleRequest): Promise<void> {
    const article = await this.repository.search(ArticleId.create(request.id));

    if (!article) {
      throw new ArticleNotFound(request.id);
    }

    article.update({
      title: ArticleTitle.create(request.title),
      content: ArticleContent.create(request.content),
      bookIds: ArticleBookIds.create(request.bookIds)
    });

    await this.repository.update(article);
  }
}
