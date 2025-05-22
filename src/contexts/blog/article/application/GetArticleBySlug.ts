import { BlogArticle } from '../domain/BlogArticle';
import { BlogArticleRepository } from '../domain/BlogArticleRepository';
import { BlogArticleNotFound } from '../domain/BlogArticleNotFound';

/**
 * Use case: Get a single blog article by its slug.
 * Throws BlogArticleNotFound if the article doesn't exist.
 */
export class GetArticleBySlug {
  constructor(private readonly repository: BlogArticleRepository) {}

  /**
   * Retrieves a blog article by its slug with all its embedded books.
   * @throws BlogArticleNotFound if the article doesn't exist
   */
  async execute(slug: string): Promise<BlogArticle> {
    const article = await this.repository.findBySlug(slug);

    if (!article) {
      throw new BlogArticleNotFound(slug);
    }

    return article;
  }
}
