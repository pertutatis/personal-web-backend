import { SeriesRepository } from '../domain/SeriesRepository'
import { Series } from '../domain/Series'
import { SeriesId } from '../domain/SeriesId'
import { SeriesTitle } from '../domain/SeriesTitle'
import { SeriesDescription } from '../domain/SeriesDescription'
import { SeriesTitleAlreadyExists } from './SeriesTitleAlreadyExists'
import { EventBus } from '@/contexts/shared/domain/EventBus'

type CreateSeriesParams = {
  id: string
  title: string
  description: string
}

export class CreateSeries {
  constructor(
    private readonly repository: SeriesRepository,
    private readonly eventBus: EventBus,
  ) {}

  async run({ id, title, description }: CreateSeriesParams): Promise<void> {
    const seriesId = new SeriesId(id)
    const seriesTitle = new SeriesTitle(title)
    const seriesDescription = new SeriesDescription(description)

    const titleExists = await this.repository.existsByTitle(seriesTitle)
    if (titleExists) {
      throw new SeriesTitleAlreadyExists(title)
    }

    const series = Series.create({
      id: seriesId,
      title: seriesTitle,
      description: seriesDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.repository.save(series)
  }
}
