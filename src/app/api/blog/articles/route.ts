import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { getBlogDatabaseConfig } from '@/contexts/shared/infrastructure/config/database'
import { NextResponse } from 'next/server'
import { Logger } from '@/contexts/shared/infrastructure/Logger'
import { PostgresBlogArticleRepository } from '@/contexts/blog/article/infrastructure/persistence/BlogArticleRepository'
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'

export async function GET() {
  let connection: DatabaseConnection | undefined

  try {
    connection = await PostgresConnection.create(getBlogDatabaseConfig())
    const repository = new PostgresBlogArticleRepository(connection)
    const articles = await repository.findAll()

    // Asegura que todos los artículos incluyan el campo 'serie' (aunque sea undefined)
    const articlesWithSerie = articles.map((a) => ({
      ...a,
      publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    }))
    return NextResponse.json(articlesWithSerie)
  } catch (error) {
    Logger.error('Error fetching articles:', error)
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
