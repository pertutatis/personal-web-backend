import { CreateSeries } from '../CreateSeries'
import { SeriesRepository } from '../../domain/SeriesRepository'
import { Series } from '../../domain/Series'
import { SeriesId } from '../../domain/SeriesId'
import { SeriesTitle } from '../../domain/SeriesTitle'
import { SeriesDescription } from '../../domain/SeriesDescription'
import { SeriesTitleAlreadyExists } from '../SeriesTitleAlreadyExists'
import { EventBus } from '@/contexts/shared/domain/EventBus'

describe('CreateSeries', () => {
  let repository: jest.Mocked<SeriesRepository>
  let eventBus: jest.Mocked<EventBus>
  let createSeries: CreateSeries

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

    createSeries = new CreateSeries(repository, eventBus)
  })

  it('should create a new series', async () => {
    const params = {
      id: SeriesId.random().value,
      title: 'Test Series',
      description: 'Test Description',
    }

    repository.existsByTitle.mockResolvedValue(false)

    await createSeries.run(params)

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(SeriesId),
        title: expect.any(SeriesTitle),
        description: expect.any(SeriesDescription),
      }),
    )

    expect(eventBus.publish).toHaveBeenCalledWith([
      expect.objectContaining({
        eventName: 'series.created',
        aggregateId: params.id,
      }),
    ])
  })

  it('should throw error if series with same title already exists', async () => {
    const params = {
      id: SeriesId.random().value,
      title: 'Test Series',
      description: 'Test Description',
    }

    repository.existsByTitle.mockResolvedValue(true)

    await expect(createSeries.run(params)).rejects.toThrow(
      SeriesTitleAlreadyExists,
    )

    expect(repository.save).not.toHaveBeenCalled()
    expect(eventBus.publish).not.toHaveBeenCalled()
  })
})
