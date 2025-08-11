import { NextRequest } from 'next/server'
import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware'
import { PostgresSeriesRepository } from '@/contexts/backoffice/series/infrastructure/persistence/PostgresSeriesRepository'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { GetSeries } from '@/contexts/backoffice/series/application/GetSeries'
import { UpdateSeries } from '@/contexts/backoffice/series/application/UpdateSeries'
import { DeleteSeries } from '@/contexts/backoffice/series/application/DeleteSeries'
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling'
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'
import { ApiValidationError } from '@/contexts/shared/infrastructure/http/ApiValidationError'
import { getBlogConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig'
import { UuidValidator } from '@/contexts/shared/domain/validation/UuidValidator'
import { SeriesNotFound } from '@/contexts/backoffice/series/application/SeriesNotFound'
import { SeriesTitleAlreadyExists } from '@/contexts/backoffice/series/application/SeriesTitleAlreadyExists'

async function getConnections() {
  const seriesConnection = await PostgresConnection.create(getBlogConfig())
  return { seriesConnection }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(async () => {
    const { seriesConnection } = await getConnections()

    // Validate UUID
    if (!UuidValidator.isValidUuid(params.id)) {
      throw new ApiValidationError('Invalid series ID format')
    }

    const repository = new PostgresSeriesRepository(seriesConnection)
    const getSeries = new GetSeries(repository)

    try {
      const series = await getSeries.run(params.id)
      return HttpNextResponse.ok({ data: series }, request.headers.get('origin'))
    } catch (error) {
      if (error instanceof SeriesNotFound) {
        return HttpNextResponse.notFound(
          {
            type: 'NotFoundError',
            message: error.message
          },
          request.headers.get('origin')
        )
      }
      throw error
    }
  }, request)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(async () => {
    const { seriesConnection } = await getConnections()

    // Validate UUID
    if (!UuidValidator.isValidUuid(params.id)) {
      throw new ApiValidationError('Invalid series ID format')
    }

    // Validate request content type
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new ApiValidationError('Content-Type must be application/json')
    }

    // Parse request body
    let rawBody
    try {
      const clone = request.clone()
      rawBody = await clone.json()
    } catch (e) {
      throw new ApiValidationError('Invalid JSON in request body')
    }

    const data = (rawBody && (rawBody.data || rawBody.body || rawBody)) || {}
    const errors = []

    // Validate fields
    const title = typeof data.title === 'string' ? data.title.trim() : undefined
    const description = typeof data.description === 'string' ? data.description.trim() : undefined

    // Validate title if provided
    if (title !== undefined) {
      if (title.length === 0) {
        errors.push('title cannot be empty')
      } else if (title.length > 255) {
        errors.push('title exceeds maximum length of 255 characters')
      }
    }

    // Validate description if provided
    if (description !== undefined) {
      if (description.length === 0) {
        errors.push('description cannot be empty')
      } else if (description.length > 1000) {
        errors.push('description exceeds maximum length of 1000 characters')
      }
    }

    if (errors.length > 0) {
      throw new ApiValidationError(errors.join(', '))
    }

    const repository = new PostgresSeriesRepository(seriesConnection)
    const updateSeries = new UpdateSeries(repository, {
      publish: async (events) => {
        // TODO: Implement event bus
        console.log('Events published:', events)
      }
    })

    try {
      await updateSeries.run({
        id: params.id,
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description })
      })
      return HttpNextResponse.ok(
        { message: 'Series updated successfully' },
        request.headers.get('origin')
      )
    } catch (error) {
      if (error instanceof SeriesNotFound) {
        return HttpNextResponse.notFound(
          {
            type: 'NotFoundError',
            message: error.message
          },
          request.headers.get('origin')
        )
      }
      if (error instanceof SeriesTitleAlreadyExists) {
        return HttpNextResponse.conflict(
          {
            type: 'ValidationError',
            message: error.message,
          },
          request.headers.get('origin')
        )
      }
      throw error
    }
  }, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(async () => {
    const { seriesConnection } = await getConnections()

    // Validate UUID
    if (!UuidValidator.isValidUuid(params.id)) {
      throw new ApiValidationError('Invalid series ID format')
    }

    const repository = new PostgresSeriesRepository(seriesConnection)
    const deleteSeries = new DeleteSeries(repository, {
      publish: async (events) => {
        // TODO: Implement event bus
        console.log('Events published:', events)
      }
    })

    try {
      await deleteSeries.run(params.id)
      return HttpNextResponse.ok(
        { message: 'Series deleted successfully' },
        request.headers.get('origin')
      )
    } catch (error) {
      if (error instanceof SeriesNotFound) {
        return HttpNextResponse.notFound(
          {
            type: 'NotFoundError',
            message: error.message
          },
          request.headers.get('origin')
        )
      }
      throw error
    }
  }, request)
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  const response = await corsMiddleware(request)
  return response
}

// Asegurarse de que las conexiones están listas al iniciar
getConnections().catch(console.error)
