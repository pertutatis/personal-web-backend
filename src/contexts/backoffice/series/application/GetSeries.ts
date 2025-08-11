import { SeriesRepository } from '../domain/SeriesRepository'
import { SeriesId } from '../domain/SeriesId'
import { Series } from '../domain/Series'
import { SeriesNotFound } from './SeriesNotFound'

export class GetSeries {
  constructor(private readonly repository: SeriesRepository) {}

  async run(id: string): Promise<Series> {
    const seriesId = new SeriesId(id)
    const series = await this.repository.findById(seriesId)

    if (!series) {
      throw new SeriesNotFound(id)
    }

    return series
  }
}
