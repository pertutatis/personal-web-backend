import { NextRequest, NextResponse } from 'next/server'
import { Container } from '@/contexts/shared/infrastructure/container/Container'
import { SeriesService } from '@/contexts/backoffice/series/infrastructure/SeriesService'
import { SeriesNotFound } from '@/contexts/backoffice/series/application/SeriesNotFound'
import { SeriesTitleAlreadyExists } from '@/contexts/backoffice/series/application/SeriesTitleAlreadyExists'
import { InvalidArgumentError } from '@/contexts/shared/domain/InvalidArgumentError'

type UpdateSeriesRequest = {
  req: NextRequest
  res: typeof NextResponse
  container: Container
  params: {
    id: string
  }
  body: {
    title?: string
    description?: string
  }
}

export const UPDATE_SERIES_CONTROLLER = {
  async run({ req, res, container, params, body }: UpdateSeriesRequest) {
    try {
      const service = container.get<SeriesService>(SeriesService.name)

      await service.update({
        id: params.id,
        ...body,
      })

      return res.json(
        { message: 'Series updated successfully' },
        { status: 200 },
      )
    } catch (error) {
      if (error instanceof SeriesNotFound) {
        return res.json({ message: error.message }, { status: 404 })
      }

      if (error instanceof SeriesTitleAlreadyExists) {
        return res.json({ message: error.message }, { status: 409 })
      }

      if (error instanceof InvalidArgumentError) {
        return res.json({ message: error.message }, { status: 400 })
      }

      throw error
    }
  },
}
