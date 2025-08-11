import { CreateSeries } from '../application/CreateSeries'
import { UpdateSeries } from '../application/UpdateSeries'
import { GetSeries } from '../application/GetSeries'
import { ListSeries } from '../application/ListSeries'
import { DeleteSeries } from '../application/DeleteSeries'
import { Series } from '../domain/Series'

export class SeriesService {
  constructor(
    private readonly createSeries: CreateSeries,
    private readonly updateSeries: UpdateSeries,
    private readonly getSeries: GetSeries,
    private readonly listSeries: ListSeries,
    private readonly deleteSeries: DeleteSeries,
  ) {}

  async create(params: {
    id: string
    title: string
    description: string
  }): Promise<void> {
    await this.createSeries.run(params)
  }

  async update(params: {
    id: string
    title?: string
    description?: string
  }): Promise<void> {
    await this.updateSeries.run(params)
  }

  async getById(id: string): Promise<Series> {
    return this.getSeries.run(id)
  }

  async list(params?: { limit?: number; offset?: number }): Promise<Series[]> {
    return this.listSeries.run(params)
  }

  async delete(id: string): Promise<void> {
    await this.deleteSeries.run(id)
  }
}
