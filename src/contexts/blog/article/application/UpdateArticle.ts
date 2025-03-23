import { ArticleRepository } from '../domain/ArticleRepository';
import { ArticleId } from '../domain/ArticleId';
import { ArticleTitle } from '../domain/ArticleTitle';
import { ArticleContent } from '../domain/ArticleContent';
import { ArticleBookIds } from '../domain/ArticleBookIds';
import { ArticleNotFound } from './ArticleNotFound';

export type UpdateArticleRequest = {
  id: string;
  title?: string;
  content?: string;
  bookIds?: string[];
};

export class UpdateArticle {
  constructor(private readonly repository: ArticleRepository) {}

  async run(request: UpdateArticleRequest): Promise<void> {
    const articleId = ArticleId.create(request.id);
    const article = await this.repository.search(articleId);

    if (!article) {
      throw new ArticleNotFound(articleId);
    }

    const updateData: Partial<{
      title: ArticleTitle;
      content: ArticleContent;
      bookIds: ArticleBookIds;
    }> = {};

    if (request.title !== undefined) {
      updateData.title = ArticleTitle.create(request.title);
    }
    if (request.content !== undefined) {
      updateData.content = ArticleContent.create(request.content);
    }
    if (request.bookIds !== undefined) {
      updateData.bookIds = ArticleBookIds.create(request.bookIds);
    }

    const updatedArticle = article.update(updateData);
    await this.repository.update(updatedArticle);
  }
}
