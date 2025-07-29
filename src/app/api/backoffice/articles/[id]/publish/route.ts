import { NextRequest } from 'next/server'
import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware'
import { PostgresArticleRepository } from '@/contexts/backoffice/article/infrastructure/PostgresArticleRepository'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { getBlogDatabaseConfig } from '@/contexts/shared/infrastructure/config/database'
import { PublishArticle } from '@/contexts/backoffice/article/application/PublishArticle'
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling'
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'
import { UuidValidator } from '@/contexts/shared/domain/validation/UuidValidator'
import { ArticleIdInvalid } from '@/contexts/backoffice/article/domain/ArticleIdInvalid'
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'

export async function POST(
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
      const publishArticle = new PublishArticle(repository)

      await publishArticle.run({ id: params.id })

      return HttpNextResponse.ok(
        { message: 'Article published successfully' },
        request.headers.get('origin'),
      )
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