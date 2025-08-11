import { GetSeries } from '../GetSeries'
import { SeriesRepository } from '../../domain/SeriesRepository'
import { Series } from '../../domain/Series'
import { SeriesId } from '../../domain/SeriesId'
import { SeriesTitle } from '../../domain/SeriesTitle'
import { SeriesDescription } from '../../domain/SeriesDescription'
import { SeriesNotFound } from '../SeriesNotFound'

describe('GetSeries', () => {
  let repository: jest.Mocked<SeriesRepository>
  let getSeries: GetSeries

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      existsByTitle: jest.fn(),
    }

    getSeries = new GetSeries(repository)
  })

  it('should get an existing series', async () => {
    const seriesId = SeriesId.random()
    const existingSeries = Series.create({
      id: seriesId,
      title: new SeriesTitle('Test Series'),
      description: new SeriesDescription('Test Description'),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    repository.findById.mockResolvedValue(existingSeries)

    const result = await getSeries.run(seriesId.value)

    expect(result).toBe(existingSeries)
    expect(repository.findById).toHaveBeenCalledWith(
      expect.objectContaining({
        value: seriesId.value,
      }),
    )
  })

  it('should throw error when series does not exist', async () => {
    const seriesId = SeriesId.random()
    repository.findById.mockResolvedValue(null)

    await expect(getSeries.run(seriesId.value)).rejects.toThrow(SeriesNotFound)
  })
})
