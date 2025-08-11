import { SeriesRepository } from '../domain/SeriesRepository'
import { Series } from '../domain/Series'
import { InvalidPaginationParams } from './InvalidPaginationParams'

type ListSeriesParams = {
  limit?: number
  offset?: number
}

export class ListSeries {
  constructor(private readonly repository: SeriesRepository) {}

  async run({ limit, offset }: ListSeriesParams = {}): Promise<Series[]> {
    if (limit !== undefined && limit <= 0) {
      throw new InvalidPaginationParams('Limit must be greater than 0')
    }

    if (offset !== undefined && offset < 0) {
      throw new InvalidPaginationParams(
        'Offset must be greater than or equal to 0',
      )
    }

    return this.repository.findAll(limit, offset)
  }
}
