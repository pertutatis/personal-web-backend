import { NextRequest } from 'next/server'
import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware'
import { PostgresArticleRepository } from '@/contexts/backoffice/article/infrastructure/PostgresArticleRepository'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { getBlogDatabaseConfig } from '@/contexts/shared/infrastructure/config/database'
import { GetArticle } from '@/contexts/backoffice/article/application/GetArticle'
import { UpdateArticle } from '@/contexts/backoffice/article/application/UpdateArticle'
import { DeleteArticle } from '@/contexts/backoffice/article/application/DeleteArticle'
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling'
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'
import { ApiValidationError } from '@/contexts/shared/infrastructure/http/ApiValidationError'
import { validateRelatedLinks } from '@/contexts/shared/infrastructure/validation/validateRelatedLinks'
import type { RelatedLink } from '@/contexts/shared/infrastructure/validation/validateRelatedLinks'
import { UuidValidator } from '@/contexts/shared/domain/validation/UuidValidator'
import { ArticleIdInvalid } from '@/contexts/backoffice/article/domain/ArticleIdInvalid'
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return executeWithErrorHandling(async () => {
    // Validate UUID format
    if (!UuidValidator.isValidUuid(params.id)) {
      throw new ArticleIdInvalid()
    }

    let connection: DatabaseConnection | undefined

    try {
      connection = await PostgresConnection.create(getBlogDatabaseConfig())
      const repository = new PostgresArticleRepository(connection)
      const getArticle = new GetArticle(repository)

      const article = await getArticle.run(params.id)
      return HttpNextResponse.ok(
        article.toPrimitives(),
        request.headers.get('origin'),
      )
    } finally {
      if (connection) {
        await connection.close()
      }
    }
  }, request)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return executeWithErrorHandling(async () => {
    // Validate UUID format
    if (!UuidValidator.isValidUuid(params.id)) {
      throw new ArticleIdInvalid()
    }

    let connection: DatabaseConnection | undefined

    try {
      connection = await PostgresConnection.create(getBlogDatabaseConfig())
      const repository = new PostgresArticleRepository(connection)
      const updateArticle = new UpdateArticle(repository)

      // Validate content type
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

      // Get existing article to verify it exists
      const articleFinder = new GetArticle(repository)
      await articleFinder.run(params.id)

      // Build update data only with changed fields
      const updateData: {
        id: string
        title?: string
        excerpt?: string
        content?: string
        bookIds?: string[]
        relatedLinks?: RelatedLink[]
        status?: string
      } = { id: params.id }

      // Process and validate only provided fields
      if (data.title !== undefined) {
        if (typeof data.title !== 'string' || data.title.trim() === '') {
          throw new ApiValidationError('title cannot be empty')
        }
        updateData.title = data.title.trim()
      }

      if (data.excerpt !== undefined) {
        if (typeof data.excerpt !== 'string') {
          throw new ApiValidationError('excerpt must be a string')
        }
        const excerpt = data.excerpt.trim()
        if (excerpt === '') {
          throw new ApiValidationError('excerpt cannot be empty')
        }
        if (excerpt.length > 300) {
          throw new ApiValidationError(
            'excerpt exceeds maximum length of 300 characters',
          )
        }
        updateData.excerpt = excerpt
      }

      if (data.content !== undefined) {
        if (typeof data.content !== 'string') {
          throw new ApiValidationError('content must be a string')
        }
        const content = data.content.trim()
        if (content === '') {
          throw new ApiValidationError('content cannot be empty')
        }
        if (content.length > 20000) {
          throw new ApiValidationError(
            'content exceeds maximum length of 20000 characters',
          )
        }
        updateData.content = content
      }

      if (data.status !== undefined) {
        if (typeof data.status !== 'string') {
          throw new ApiValidationError('status must be a string')
        }
        const status = data.status.trim()
        if (status !== 'DRAFT' && status !== 'PUBLISHED') {
          throw new ApiValidationError('status must be either "DRAFT" or "PUBLISHED"')
        }
        updateData.status = status
      }

      if (data.bookIds !== undefined) {
        if (!Array.isArray(data.bookIds)) {
          throw new ApiValidationError('bookIds must be an array')
        }
        // Validate each book ID is a valid UUID
        for (const bookId of data.bookIds) {
          if (!UuidValidator.isValidUuid(bookId)) {
            throw new ApiValidationError('All book IDs must be valid UUID v4')
          }
        }
        updateData.bookIds = data.bookIds
      }

      if (data.relatedLinks !== undefined) {
        const links = Array.isArray(data.relatedLinks)
          ? (data.relatedLinks as RelatedLink[])
          : []
        validateRelatedLinks(links)
        updateData.relatedLinks = links.map((link: RelatedLink) => ({
          text: link.text.trim(),
          url: link.url.trim(),
        }))
      }

      // Execute update only with changed fields
      await updateArticle.run(updateData)

      return HttpNextResponse.noContent(request.headers.get('origin'))
    } finally {
      if (connection) {
        await connection.close()
      }
    }
  }, request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return executeWithErrorHandling(async () => {
    // Validate UUID format
    if (!UuidValidator.isValidUuid(params.id)) {
      throw new ArticleIdInvalid()
    }

    let connection: DatabaseConnection | undefined

    try {
      connection = await PostgresConnection.create(getBlogDatabaseConfig())
      const repository = new PostgresArticleRepository(connection)
      const deleteArticle = new DeleteArticle(repository)

      await deleteArticle.run(params.id)

      return HttpNextResponse.noContent(request.headers.get('origin'))
    } finally {
      if (connection) {
        await connection.close()
      }
    }
  }, request)
}

export async function OPTIONS(request: NextRequest) {
  return corsMiddleware(request)
}
