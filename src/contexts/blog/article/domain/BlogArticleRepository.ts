import { BlogArticle } from './BlogArticle';

/**
 * Repository interface for the blog read model.
 * Defines methods to fetch articles with their embedded books.
 */
export interface BlogArticleRepository {
  /**
   * Retrieves all articles with their related books.
   * No pagination needed initially as per requirements.
   */
  findAll(): Promise<BlogArticle[]>;

  /**
   * Retrieves a single article by its slug with its related books.
   * @param slug - The article's URL-friendly slug
   */
  findBySlug(slug: string): Promise<BlogArticle | null>;
}
