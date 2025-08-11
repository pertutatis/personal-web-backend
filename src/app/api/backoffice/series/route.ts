import { NextRequest } from 'next/server'
import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware'
import { PostgresSeriesRepository } from '@/contexts/backoffice/series/infrastructure/persistence/PostgresSeriesRepository'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { CreateSeries } from '@/contexts/backoffice/series/application/CreateSeries'
import { ListSeries } from '@/contexts/backoffice/series/application/ListSeries'
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling'
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'
import { ApiValidationError } from '@/contexts/shared/infrastructure/http/ApiValidationError'
import { getBlogConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig'
import { UuidValidator } from '@/contexts/shared/domain/validation/UuidValidator'
import { SeriesTitleAlreadyExists } from '@/contexts/backoffice/series/application/SeriesTitleAlreadyExists'

async function getConnections() {
  const seriesConnection = await PostgresConnection.create(getBlogConfig())
  return { seriesConnection }
}

export async function GET(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    const { seriesConnection } = await getConnections()
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    const repository = new PostgresSeriesRepository(seriesConnection)
    const listSeries = new ListSeries(repository)

    const series = await listSeries.run({
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    })

    return HttpNextResponse.ok({ data: series }, request.headers.get('origin'))
  }, request)
}

export async function POST(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    const { seriesConnection } = await getConnections()

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
    const id = typeof data.id === 'string' ? data.id.trim() : null
    const title = typeof data.title === 'string' ? data.title.trim() : null
    const description = typeof data.description === 'string' ? data.description.trim() : null

    // Validate UUID
    if (!id) {
      errors.push('id cannot be empty')
    } else if (!UuidValidator.isValidUuid(id)) {
      errors.push('id must be a valid UUID v4')
    }

    // Validate title
    if (!title) {
      errors.push('title cannot be empty')
    } else if (title.length > 255) {
      errors.push('title exceeds maximum length of 255 characters')
    }

    // Validate description
    if (!description) {
      errors.push('description cannot be empty')
    } else if (description.length > 1000) {
      errors.push('description exceeds maximum length of 1000 characters')
    }

    if (errors.length > 0) {
      throw new ApiValidationError(errors.join(', '))
    }

    // Create series with validated data
    const seriesData = {
      id: id!,
      title: title!,
      description: description!
    }

    const repository = new PostgresSeriesRepository(seriesConnection)
    const createSeries = new CreateSeries(repository, {
      publish: async (events) => {
        // TODO: Implement event bus
        console.log('Events published:', events)
      }
    })

    try {
      await createSeries.run(seriesData)
      return HttpNextResponse.created(request.headers.get('origin'))
    } catch (error) {
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

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  const response = await corsMiddleware(request)
  return response
}

// Asegurarse de que las conexiones están listas al iniciar
getConnections().catch(console.error)
