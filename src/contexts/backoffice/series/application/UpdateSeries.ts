import { SeriesRepository } from '../domain/SeriesRepository'
import { SeriesId } from '../domain/SeriesId'
import { SeriesTitle } from '../domain/SeriesTitle'
import { SeriesDescription } from '../domain/SeriesDescription'
import { SeriesNotFound } from './SeriesNotFound'
import { SeriesTitleAlreadyExists } from './SeriesTitleAlreadyExists'
import { EventBus } from '@/contexts/shared/domain/EventBus'

type UpdateSeriesParams = {
  id: string
  title?: string
  description?: string
}

export class UpdateSeries {
  constructor(
    private readonly repository: SeriesRepository,
    private readonly eventBus: EventBus,
  ) {}

  async run({ id, title, description }: UpdateSeriesParams): Promise<void> {
    const seriesId = new SeriesId(id)
    const series = await this.repository.findById(seriesId)

    if (!series) {
      throw new SeriesNotFound(id)
    }

    if (title) {
      const newTitle = new SeriesTitle(title)
      const titleExists = await this.repository.existsByTitle(newTitle)
      if (titleExists && !series.title.equals(newTitle)) {
        throw new SeriesTitleAlreadyExists(title)
      }
    }

    const updatedSeries = series.update({
      title: title ? new SeriesTitle(title) : undefined,
      description: description ? new SeriesDescription(description) : undefined,
    })

    await this.repository.save(updatedSeries)
    // await this.eventBus.publish(updatedSeries.pullDomainEvents())
  }
}
