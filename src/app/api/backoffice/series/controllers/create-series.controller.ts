import { NextRequest, NextResponse } from 'next/server'
import { Container } from '@/contexts/shared/infrastructure/container/Container'
import { SeriesService } from '@/contexts/backoffice/series/infrastructure/SeriesService'
import { SeriesTitleAlreadyExists } from '@/contexts/backoffice/series/application/SeriesTitleAlreadyExists'
import { InvalidArgumentError } from '@/contexts/shared/domain/InvalidArgumentError'

type CreateSeriesRequest = {
  req: NextRequest
  res: typeof NextResponse
  container: Container
  body: {
    id: string
    title: string
    description: string
  }
}

export const CREATE_SERIES_CONTROLLER = {
  async run({ req, res, container, body }: CreateSeriesRequest) {
    try {
      const service = container.get<SeriesService>(SeriesService.name)

      await service.create(body)

      return res.json(
        { message: 'Series created successfully' },
        { status: 201 },
      )
    } catch (error) {
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
