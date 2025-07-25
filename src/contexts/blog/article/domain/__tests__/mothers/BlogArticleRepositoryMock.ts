import { BlogArticleRepository } from '../../BlogArticleRepository'
import { BlogArticle } from '../../BlogArticle'

export class BlogArticleRepositoryMock implements BlogArticleRepository {
  private mockFindAll = jest.fn()
  private mockFindBySlug = jest.fn()

  async findAll(): Promise<BlogArticle[]> {
    return this.mockFindAll()
  }

  async findBySlug(slug: string): Promise<BlogArticle | null> {
    return this.mockFindBySlug(slug)
  }

  returnOnFindAll(articles: BlogArticle[]): void {
    this.mockFindAll.mockResolvedValue(articles)
  }

  returnOnFindBySlug(article: BlogArticle | null): void {
    this.mockFindBySlug.mockResolvedValue(article)
  }

  assertFindAllHasBeenCalled(): void {
    expect(this.mockFindAll).toHaveBeenCalled()
  }

  assertFindBySlugHasBeenCalledWith(slug: string): void {
    expect(this.mockFindBySlug).toHaveBeenCalledWith(slug)
  }
}
