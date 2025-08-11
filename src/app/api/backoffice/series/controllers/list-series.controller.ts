import { NextRequest, NextResponse } from 'next/server'
import { Container } from '@/contexts/shared/infrastructure/container/Container'
import { SeriesService } from '@/contexts/backoffice/series/infrastructure/SeriesService'
import { InvalidPaginationParams } from '@/contexts/backoffice/series/application/InvalidPaginationParams'

type ListSeriesRequest = {
  req: NextRequest
  res: typeof NextResponse
  container: Container
  params: {
    limit?: number
    offset?: number
  }
}

export const LIST_SERIES_CONTROLLER = {
  async run({ req, res, container, params }: ListSeriesRequest) {
    try {
      const service = container.get<SeriesService>(SeriesService.name)
      const series = await service.list(params)

      return res.json({ data: series }, { status: 200 })
    } catch (error) {
      if (error instanceof InvalidPaginationParams) {
        return res.json({ message: error.message }, { status: 400 })
      }
      throw error
    }
  },
}
