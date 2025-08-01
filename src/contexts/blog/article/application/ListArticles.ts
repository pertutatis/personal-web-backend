import { BlogArticle } from '../domain/BlogArticle'
import { BlogArticleRepository } from '../domain/BlogArticleRepository'

/**
 * Use case: List all blog articles with their related books.
 * No pagination needed initially as per requirements.
 */
export class ListArticles {
  constructor(private readonly repository: BlogArticleRepository) {}

  /**
   * Retrieves all blog articles with their embedded books.
   * Articles are sorted by creation date in descending order.
   */
  async execute(): Promise<BlogArticle[]> {
    const articles = await this.repository.findAll()

    // Sort by creation date, newest first
    return articles.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )
  }
}
