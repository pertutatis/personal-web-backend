import { BlogSeries } from './BlogSeries'

/**
 * Repository interface for the blog read model.
 * Defines methods to fetch series with pagination.
 */
export interface BlogSeriesRepository {
  /**
   * Retrieves all series with pagination
   * @param limit Maximum number of items to return
   * @param offset Number of items to skip
   */
  findAll(limit?: number, offset?: number): Promise<BlogSeries[]>

  /**
   * Retrieves a single series by its ID
   * @param id - The series ID
   */
  findById(id: string): Promise<BlogSeries | null>

  /**
   * Counts total number of series
   * Used for pagination
   */
  count(): Promise<number>
}
