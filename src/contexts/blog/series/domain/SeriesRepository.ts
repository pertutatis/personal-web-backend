import { ArticleSeries } from './ArticleSeries'
import { SeriesId } from './SeriesId'
import { SeriesTitle } from './SeriesTitle'

export interface SeriesRepository {
  /**
   * Saves a new series or updates an existing one
   */
  save(series: ArticleSeries): Promise<void>

  /**
   * Finds a series by its ID
   */
  findById(id: SeriesId): Promise<ArticleSeries | null>

  /**
   * Finds a series by its title (must be exact match)
   */
  findByTitle(title: SeriesTitle): Promise<ArticleSeries | null>

  /**
   * Lists all series ordered by creation date
   * @param limit Maximum number of items to return
   * @param offset Number of items to skip
   */
  findAll(limit?: number, offset?: number): Promise<ArticleSeries[]>

  /**
   * Removes a series from the repository
   */
  delete(id: SeriesId): Promise<void>

  /**
   * Checks if a series exists by its title
   */
  existsByTitle(title: SeriesTitle): Promise<boolean>
}
