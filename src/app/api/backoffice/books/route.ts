import { NextRequest } from 'next/server'
import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware'
import { PostgresBookRepository } from '@/contexts/backoffice/book/infrastructure/PostgresBookRepository'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { CreateBook } from '@/contexts/backoffice/book/application/CreateBook'
import { ListBooks } from '@/contexts/backoffice/book/application/ListBooks'
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling'
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'
import { ApiValidationError } from '@/contexts/shared/infrastructure/http/ApiValidationError'
import { getBlogConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig'
import { BookIdDuplicated } from '@/contexts/backoffice/book/domain/BookIdDuplicated'
import { BookIdInvalid } from '@/contexts/backoffice/book/domain/BookIdInvalid'
import { BookIsbnDuplicated } from '@/contexts/backoffice/book/domain/BookIsbnDuplicated'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

async function getConnection() {
  return await PostgresConnection.create(getBlogConfig())
}

export async function GET(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    const connection = await getConnection()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '10')

    const repository = new PostgresBookRepository(connection)
    const listBooks = new ListBooks(repository)

    const books = await listBooks.run({ page, limit })

    return HttpNextResponse.ok(
      {
        items: books.items.map((book) => book.toFormattedPrimitives()),
        page: books.pagination.page,
        limit: books.pagination.limit,
        total: books.pagination.total,
      },
      request.headers.get('origin'),
    )
  }, request)
}

export async function POST(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new ApiValidationError('Content-Type must be application/json')
    }

    const requestBody = await request.text()

    let bookData
    try {
      const parsedBody = JSON.parse(requestBody)
      const data = parsedBody.data || parsedBody
      if (!data || typeof data !== 'object') {
        throw new ApiValidationError('Invalid request data format')
      }

      // UUID validation
      if (!data.id) {
        throw new ApiValidationError('id is required')
      }

      if (typeof data.id !== 'string') {
        throw new ApiValidationError('id must be a string')
      }

      // Validación estricta de campos
      if (typeof data.title !== 'string') {
        throw new ApiValidationError('title must be a string')
      }

      if (typeof data.author !== 'string') {
        throw new ApiValidationError('author must be a string')
      }

      if (typeof data.description !== 'string') {
        throw new ApiValidationError('description must be a string')
      }

      if (
        data.purchaseLink !== null &&
        data.purchaseLink !== undefined &&
        typeof data.purchaseLink !== 'string'
      ) {
        throw new ApiValidationError('purchaseLink must be a string or null')
      }

      const title = data.title.trim()
      const author = data.author.trim()
      const description = data.description.trim()

      if (title === '') {
        throw new ApiValidationError('title cannot be empty')
      }

      if (author === '') {
        throw new ApiValidationError('author cannot be empty')
      }

      if (description === '') {
        throw new ApiValidationError('description cannot be empty')
      }

      if (!data.isbn) {
        throw new ApiValidationError('isbn is required')
      }

      // Validar que el purchaseLink sea una URL válida si está presente
      if (data.purchaseLink && typeof data.purchaseLink === 'string') {
        try {
          new URL(data.purchaseLink)
        } catch (e) {
          throw new ApiValidationError('purchaseLink must be a valid URL')
        }
      }

      bookData = {
        id: data.id,
        title,
        author,
        isbn: data.isbn,
        description,
        purchaseLink: data.purchaseLink,
      }
    } catch (e: any) {
      Logger.info(e)

      if (e instanceof ApiValidationError) {
        throw e
      }
      if (e instanceof SyntaxError) {
        throw new ApiValidationError('Invalid JSON format')
      }
      const message = e instanceof Error ? e.message : 'Invalid request data'
      throw new ApiValidationError(message)
    }

    const connection = await getConnection()
    const repository = new PostgresBookRepository(connection)
    const createBook = new CreateBook(repository)

    try {
      await createBook.run(bookData)
      return HttpNextResponse.created(request.headers.get('origin'))
    } catch (error) {
      if (error instanceof BookIdDuplicated) {
        return HttpNextResponse.conflict(
          {
            type: 'ValidationError',
            message: error.message,
          },
          request.headers.get('origin'),
        )
      }
      if (error instanceof BookIdInvalid) {
        return HttpNextResponse.badRequest(
          {
            type: 'ValidationError',
            message: error.message,
          },
          request.headers.get('origin'),
        )
      }
      if (error instanceof BookIsbnDuplicated) {
        return HttpNextResponse.conflict(
          {
            type: 'ValidationError',
            message: error.message,
          },
          request.headers.get('origin'),
        )
      }
      throw error
    }
  }, request)
}

export async function OPTIONS(request: NextRequest) {
  const response = await corsMiddleware(request)
  return response
}

// Asegurarse de que la conexión está lista al iniciar
getConnection().catch(console.error)
