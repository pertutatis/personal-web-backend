import { FactoryProvider, Module } from '@nestjs/common'
import { Pool } from 'pg'
import { EventBus, EVENT_BUS } from '../../../../shared/domain/EventBus'
import { pool } from '../../../../shared/infrastructure/persistence/PostgresPool'
import { PostgresSeriesRepository } from '../persistence/PostgresSeriesRepository'
import { SeriesService } from '../SeriesService'
import { CreateSeries } from '../../application/CreateSeries'
import { UpdateSeries } from '../../application/UpdateSeries'
import { GetSeries } from '../../application/GetSeries'
import { ListSeries } from '../../application/ListSeries'
import { DeleteSeries } from '../../application/DeleteSeries'

const repository: FactoryProvider = {
  provide: PostgresSeriesRepository,
  useFactory: () => new PostgresSeriesRepository(pool),
}

const createSeries: FactoryProvider = {
  provide: CreateSeries,
  useFactory: (repository: PostgresSeriesRepository, eventBus: EventBus) =>
    new CreateSeries(repository, eventBus),
  inject: [PostgresSeriesRepository, EVENT_BUS],
}

const updateSeries: FactoryProvider = {
  provide: UpdateSeries,
  useFactory: (repository: PostgresSeriesRepository, eventBus: EventBus) =>
    new UpdateSeries(repository, eventBus),
  inject: [PostgresSeriesRepository, EVENT_BUS],
}

const getSeries: FactoryProvider = {
  provide: GetSeries,
  useFactory: (repository: PostgresSeriesRepository) =>
    new GetSeries(repository),
  inject: [PostgresSeriesRepository],
}

const listSeries: FactoryProvider = {
  provide: ListSeries,
  useFactory: (repository: PostgresSeriesRepository) =>
    new ListSeries(repository),
  inject: [PostgresSeriesRepository],
}

const deleteSeries: FactoryProvider = {
  provide: DeleteSeries,
  useFactory: (repository: PostgresSeriesRepository, eventBus: EventBus) =>
    new DeleteSeries(repository, eventBus),
  inject: [PostgresSeriesRepository, EVENT_BUS],
}

const seriesService: FactoryProvider = {
  provide: SeriesService,
  useFactory: (
    createSeries: CreateSeries,
    updateSeries: UpdateSeries,
    getSeries: GetSeries,
    listSeries: ListSeries,
    deleteSeries: DeleteSeries,
  ) =>
    new SeriesService(
      createSeries,
      updateSeries,
      getSeries,
      listSeries,
      deleteSeries,
    ),
  inject: [CreateSeries, UpdateSeries, GetSeries, ListSeries, DeleteSeries],
}

@Module({
  providers: [
    repository,
    createSeries,
    updateSeries,
    getSeries,
    listSeries,
    deleteSeries,
    seriesService,
  ],
  exports: [SeriesService],
})
export class SeriesModule {}
