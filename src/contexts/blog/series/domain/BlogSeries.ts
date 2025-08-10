/**
 * BlogSeries is the read model entity for series.
 * It provides a simpler interface for reading series data.
 */
export class BlogSeries {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  /**
   * Creates a new instance of BlogSeries with the same values
   */
  clone(): BlogSeries {
    return new BlogSeries(
      this.id,
      this.title,
      this.description,
      this.createdAt,
      this.updatedAt,
    )
  }

  /**
   * Equality comparison based on ID
   */
  equals(other: BlogSeries): boolean {
    return this.id === other.id
  }

  /**
   * Creates a BlogSeries from primitive values
   */
  static fromPrimitives(plainData: {
    id: string
    title: string
    description: string
    createdAt: string
    updatedAt: string
  }): BlogSeries {
    return new BlogSeries(
      plainData.id,
      plainData.title,
      plainData.description,
      new Date(plainData.createdAt),
      new Date(plainData.updatedAt),
    )
  }
}
