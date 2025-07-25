import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { getBlogDatabaseConfig } from '@/contexts/shared/infrastructure/config/database'
import { NextRequest, NextResponse } from 'next/server'
import { Logger } from '@/contexts/shared/infrastructure/Logger'
import { PostgresBlogArticleRepository } from '@/contexts/blog/article/infrastructure/persistence/BlogArticleRepository'
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  let connection: DatabaseConnection | undefined

  try {
    connection = await PostgresConnection.create(getBlogDatabaseConfig())
    const repository = new PostgresBlogArticleRepository(connection)
    const article = await repository.findBySlug(params.slug)

    if (!article) {
      Logger.info('Article not found', { slug: params.slug })
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    Logger.error('Error fetching article:', {
      error,
      slug: params.slug,
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  } finally {
    if (connection) {
      await connection.close()
    }
  }
}
