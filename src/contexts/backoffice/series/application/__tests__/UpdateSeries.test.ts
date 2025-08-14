import { UpdateSeries } from '../UpdateSeries'
import { SeriesRepository } from '../../domain/SeriesRepository'
import { Series } from '../../domain/Series'
import { SeriesId } from '../../domain/SeriesId'
import { SeriesTitle } from '../../domain/SeriesTitle'
import { SeriesDescription } from '../../domain/SeriesDescription'
import { SeriesNotFound } from '../SeriesNotFound'
import { SeriesTitleAlreadyExists } from '../SeriesTitleAlreadyExists'
import { EventBus } from '@/contexts/shared/domain/EventBus'

describe('UpdateSeries', () => {
  let repository: jest.Mocked<SeriesRepository>
  let eventBus: jest.Mocked<EventBus>
  let updateSeries: UpdateSeries

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

    updateSeries = new UpdateSeries(repository, eventBus)
  })

  it('should update an existing series', async () => {
    const seriesId = SeriesId.random()
    const existingSeries = Series.create({
      id: seriesId,
      title: new SeriesTitle('Old Title'),
      description: new SeriesDescription('Old Description'),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Clear creation event
    existingSeries.pullDomainEvents()

    repository.findById.mockResolvedValue(existingSeries)
    repository.existsByTitle.mockResolvedValue(false)

    await updateSeries.run({
      id: seriesId.value,
      title: 'New Title',
      description: 'New Description',
    })

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: seriesId,
        title: expect.any(SeriesTitle),
        description: expect.any(SeriesDescription),
      }),
    )

    // const publishedEvents = eventBus.publish.mock.calls[0][0]
    // expect(publishedEvents).toHaveLength(1)
    // expect(publishedEvents[0]).toMatchObject({
    //   eventName: 'series.updated',
    //   aggregateId: seriesId.value,
    // })
  })

  it('should throw error when series does not exist', async () => {
    const seriesId = SeriesId.random()
    repository.findById.mockResolvedValue(null)

    await expect(
      updateSeries.run({
        id: seriesId.value,
        title: 'New Title',
      }),
    ).rejects.toThrow(SeriesNotFound)

    expect(repository.save).not.toHaveBeenCalled()
    expect(eventBus.publish).not.toHaveBeenCalled()
  })

  it('should throw error when new title already exists', async () => {
    const seriesId = SeriesId.random()
    const existingSeries = Series.create({
      id: seriesId,
      title: new SeriesTitle('Old Title'),
      description: new SeriesDescription('Old Description'),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Clear creation event
    existingSeries.pullDomainEvents()

    repository.findById.mockResolvedValue(existingSeries)
    repository.existsByTitle.mockResolvedValue(true)

    await expect(
      updateSeries.run({
        id: seriesId.value,
        title: 'Existing Title',
      }),
    ).rejects.toThrow(SeriesTitleAlreadyExists)

    expect(repository.save).not.toHaveBeenCalled()
    expect(eventBus.publish).not.toHaveBeenCalled()
  })

  it('should allow updating only description', async () => {
    const seriesId = SeriesId.random()
    const existingSeries = Series.create({
      id: seriesId,
      title: new SeriesTitle('Title'),
      description: new SeriesDescription('Old Description'),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Clear creation event
    existingSeries.pullDomainEvents()

    repository.findById.mockResolvedValue(existingSeries)

    await updateSeries.run({
      id: seriesId.value,
      description: 'New Description',
    })

    expect(repository.existsByTitle).not.toHaveBeenCalled()
    expect(repository.save).toHaveBeenCalled()

    // const publishedEvents = eventBus.publish.mock.calls[0][0]
    // expect(publishedEvents).toHaveLength(1)
    // expect(publishedEvents[0]).toMatchObject({
    //   eventName: 'series.updated',
    //   aggregateId: seriesId.value,
    // })
  })
})
