/**
 * Value Object representing a book in the blog context.
 * This is a simplified read model of the Book entity from the backoffice context.
 */
export class BlogBook {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly author: string,
    readonly isbn: string,
    readonly description: string,
    readonly purchaseLink: string | null,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}

  /**
   * Creates a new instance of BlogBook with the same values
   */
  clone(): BlogBook {
    return new BlogBook(
      this.id,
      this.title,
      this.author,
      this.isbn,
      this.description,
      this.purchaseLink,
      this.createdAt,
      this.updatedAt
    );
  }

  /**
   * Equality comparison based on ID
   */
  equals(other: BlogBook): boolean {
    return this.id === other.id;
  }
}
