import { SeriesRepository } from '../domain/SeriesRepository'
import { SeriesId } from '../domain/SeriesId'
import { SeriesNotFound } from './SeriesNotFound'
import { EventBus } from '@/contexts/shared/domain/EventBus'

export class DeleteSeries {
  constructor(
    private readonly repository: SeriesRepository,
    private readonly eventBus: EventBus,
  ) {}

  async run(id: string): Promise<void> {
    const seriesId = new SeriesId(id)
    const series = await this.repository.findById(seriesId)

    if (!series) {
      throw new SeriesNotFound(id)
    }

    await this.repository.delete(seriesId)
    await this.eventBus.publish(series.pullDomainEvents())
  }
}
