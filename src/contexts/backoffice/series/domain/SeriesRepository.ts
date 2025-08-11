import { Series } from './Series'
import { SeriesId } from './SeriesId'
import { SeriesTitle } from './SeriesTitle'

export interface SeriesRepository {
  save(series: Series): Promise<void>
  findById(id: SeriesId): Promise<Series | null>
  findByTitle(title: SeriesTitle): Promise<Series | null>
  findAll(limit?: number, offset?: number): Promise<Series[]>
  delete(id: SeriesId): Promise<void>
  existsByTitle(title: SeriesTitle): Promise<boolean>
}
