import { Article } from '../domain/Article';
import { ArticleId } from '../domain/ArticleId';
import { ArticleNotFound } from './ArticleNotFound';
import { ArticleTitle } from '../domain/ArticleTitle';
import { ArticleExcerpt } from '../domain/ArticleExcerpt';
import { ArticleContent } from '../domain/ArticleContent';
import { ArticleBookIds } from '../domain/ArticleBookIds';
import { ArticleRepository } from '../domain/ArticleRepository';
import { ArticleRelatedLinks } from '../domain/ArticleRelatedLinks';
import { ArticleRelatedLink } from '../domain/ArticleRelatedLink';

export type UpdateArticleRequest = {
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
    const articleId = ArticleId.create(request.id);
    const article = await this.repository.search(articleId);

    if (!article) {
      throw new ArticleNotFound(articleId);
    }

    const updateParams: any = {};

    if (request.title !== undefined) {
      updateParams.title = ArticleTitle.create(request.title);
    }

    if (request.excerpt !== undefined) {
      updateParams.excerpt = ArticleExcerpt.create(request.excerpt);
    }

    if (request.content !== undefined) {
      updateParams.content = ArticleContent.create(request.content);
    }

    if (request.bookIds !== undefined) {
      updateParams.bookIds = ArticleBookIds.create(request.bookIds);
    }

    if (request.relatedLinks !== undefined) {
      const relatedLinks = request.relatedLinks.map(link => 
        ArticleRelatedLink.create(link.text, link.url)
      );
      updateParams.relatedLinks = ArticleRelatedLinks.create(relatedLinks);
    }

    const updatedArticle = article.update(updateParams);
    await this.repository.update(updatedArticle);

    return updatedArticle;
  }
}
