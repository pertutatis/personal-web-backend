import { BlogBook } from './BlogBook'

/**
 * BlogArticle is the main entity of the blog read model.
 * It includes embedded books for efficient reading.
 */
export class BlogArticle {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly excerpt: string,
    readonly content: string,
    readonly books: BlogBook[],
    readonly relatedLinks: Array<{ text: string; url: string }>,
    readonly slug: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly publishedAt?: Date,
    readonly serie?: {
      id: string
      title: string
      description: string
      createdAt: string
      updatedAt: string
    } | null,
  ) {}

  /**
   * Creates a new instance of BlogArticle with the same values
   */
  clone(): BlogArticle {
    return new BlogArticle(
      this.id,
      this.title,
      this.excerpt,
      this.content,
      this.books.map((book) => book.clone()),
      [...this.relatedLinks],
      this.slug,
      this.createdAt,
      this.updatedAt,
      this.publishedAt,
      this.serie ? { ...this.serie } : undefined,
    )
  }

  /**
   * Checks if the article has any books
   */
  hasBooks(): boolean {
    return this.books.length > 0
  }

  /**
   * Finds a book by its ID
   */
  findBook(bookId: string): BlogBook | undefined {
    return this.books.find((book) => book.id === bookId)
  }

  /**
   * Checks if the article has any related links
   */
  hasRelatedLinks(): boolean {
    return this.relatedLinks.length > 0
  }

  /**
   * Equality comparison based on ID
   */
  equals(other: BlogArticle): boolean {
    return this.id === other.id
  }
}
