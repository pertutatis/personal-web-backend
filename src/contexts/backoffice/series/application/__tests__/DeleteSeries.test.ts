import { DeleteSeries } from '../DeleteSeries'
import { SeriesRepository } from '../../domain/SeriesRepository'
import { Series } from '../../domain/Series'
import { SeriesId } from '../../domain/SeriesId'
import { SeriesTitle } from '../../domain/SeriesTitle'
import { SeriesDescription } from '../../domain/SeriesDescription'
import { SeriesNotFound } from '../SeriesNotFound'
import { EventBus } from '@/contexts/shared/domain/EventBus'

describe('DeleteSeries', () => {
  let repository: jest.Mocked<SeriesRepository>
  let eventBus: jest.Mocked<EventBus>
  let deleteSeries: DeleteSeries

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      existsByTitle: jest.fn(),
    }

    eventBus = {
      publish: jest.fn(),
    }

    deleteSeries = new DeleteSeries(repository, eventBus)
  })

  it('should delete an existing series', async () => {
    const seriesId = SeriesId.random()
    const existingSeries = Series.create({
      id: seriesId,
      title: new SeriesTitle('Test Series'),
      description: new SeriesDescription('Test Description'),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    repository.findById.mockResolvedValue(existingSeries)

    await deleteSeries.run(seriesId.value)

    expect(repository.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        value: seriesId.value,
      }),
    )
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          eventName: 'series.created',
        }),
      ]),
    )
  })

  it('should throw error when series does not exist', async () => {
    const seriesId = SeriesId.random()
    repository.findById.mockResolvedValue(null)

    await expect(deleteSeries.run(seriesId.value)).rejects.toThrow(
      SeriesNotFound,
    )

    expect(repository.delete).not.toHaveBeenCalled()
    expect(eventBus.publish).not.toHaveBeenCalled()
  })
})
