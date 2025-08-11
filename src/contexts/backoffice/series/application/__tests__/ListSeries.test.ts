import { ListSeries } from '../ListSeries'
import { SeriesRepository } from '../../domain/SeriesRepository'
import { Series } from '../../domain/Series'
import { SeriesId } from '../../domain/SeriesId'
import { SeriesTitle } from '../../domain/SeriesTitle'
import { SeriesDescription } from '../../domain/SeriesDescription'
import { InvalidPaginationParams } from '../InvalidPaginationParams'

describe('ListSeries', () => {
  let repository: jest.Mocked<SeriesRepository>
  let listSeries: ListSeries

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      existsByTitle: jest.fn(),
    }

    listSeries = new ListSeries(repository)
  })

  it('should list all series without pagination', async () => {
    const series = [
      Series.create({
        id: SeriesId.random(),
        title: new SeriesTitle('Series 1'),
        description: new SeriesDescription('Description 1'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      Series.create({
        id: SeriesId.random(),
        title: new SeriesTitle('Series 2'),
        description: new SeriesDescription('Description 2'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ]

    repository.findAll.mockResolvedValue(series)

    const result = await listSeries.run()

    expect(result).toEqual(series)
    expect(repository.findAll).toHaveBeenCalledWith(undefined, undefined)
  })

  it('should list series with pagination', async () => {
    const series = [
      Series.create({
        id: SeriesId.random(),
        title: new SeriesTitle('Series 1'),
        description: new SeriesDescription('Description 1'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ]

    repository.findAll.mockResolvedValue(series)

    const result = await listSeries.run({ limit: 1, offset: 0 })

    expect(result).toEqual(series)
    expect(repository.findAll).toHaveBeenCalledWith(1, 0)
  })

  it('should throw error with invalid limit', async () => {
    await expect(listSeries.run({ limit: 0 })).rejects.toThrow(
      InvalidPaginationParams,
    )

    await expect(listSeries.run({ limit: -1 })).rejects.toThrow(
      InvalidPaginationParams,
    )
  })

  it('should throw error with invalid offset', async () => {
    await expect(listSeries.run({ offset: -1 })).rejects.toThrow(
      InvalidPaginationParams,
    )
  })
})
