import { NextRequest, NextResponse } from 'next/server'
import { Container } from '@/contexts/shared/infrastructure/container/Container'
import { SeriesService } from '@/contexts/backoffice/series/infrastructure/SeriesService'
import { SeriesNotFound } from '@/contexts/backoffice/series/application/SeriesNotFound'
import { InvalidArgumentError } from '@/contexts/shared/domain/InvalidArgumentError'

type DeleteSeriesRequest = {
  req: NextRequest
  res: typeof NextResponse
  container: Container
  params: {
    id: string
  }
}

export const DELETE_SERIES_CONTROLLER = {
  async run({ req, res, container, params }: DeleteSeriesRequest) {
    try {
      const service = container.get<SeriesService>(SeriesService.name)
      await service.delete(params.id)

      return res.json(
        { message: 'Series deleted successfully' },
        { status: 200 },
      )
    } catch (error) {
      if (error instanceof SeriesNotFound) {
        return res.json({ message: error.message }, { status: 404 })
      }

      if (error instanceof InvalidArgumentError) {
        return res.json({ message: error.message }, { status: 400 })
      }

      throw error
    }
  },
}
