import { Article } from '../domain/Article';
import { ArticleId } from '../domain/ArticleId';
import { ArticleTitle } from '../domain/ArticleTitle';
import { ArticleExcerpt } from '../domain/ArticleExcerpt';
import { ArticleContent } from '../domain/ArticleContent';
import { ArticleBookIds } from '../domain/ArticleBookIds';
import { ArticleRelatedLinks } from '../domain/ArticleRelatedLinks';
import { ArticleRepository } from '../domain/ArticleRepository';

type UpdateArticleRequest = {
  id: string;
  title?: string;
  excerpt?: string;
  content?: string;
  bookIds?: string[];
  relatedLinks?: Array<{ text: string; url: string }>;
};

export class UpdateArticle {
  constructor(private readonly repository: ArticleRepository) {}

  async run(request: UpdateArticleRequest): Promise<Article> {
    const articleId = new ArticleId(request.id);
    const article = await this.repository.search(articleId);

    if (!article) {
      throw new Error('Article not found');
    }

    const updateParams = this.buildUpdateParams(request);
    const updatedArticle = article.update(updateParams);
    await this.repository.update(updatedArticle);

    return updatedArticle;
  }

  private buildUpdateParams(request: UpdateArticleRequest) {
    const params: Record<string, any> = {};

    if (request.title !== undefined) {
      params.title = new ArticleTitle(request.title);
    }

    if (request.excerpt !== undefined) {
      params.excerpt = new ArticleExcerpt(request.excerpt);
    }

    if (request.content !== undefined) {
      params.content = new ArticleContent(request.content);
    }

    if (request.bookIds !== undefined) {
      params.bookIds = ArticleBookIds.create(request.bookIds);
    }

    if (request.relatedLinks !== undefined) {
      params.relatedLinks = ArticleRelatedLinks.create(request.relatedLinks);
    }

    return params;
  }
}
