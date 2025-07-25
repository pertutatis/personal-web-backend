import { BlogArticleRepositoryFactory } from '@/contexts/blog/article/infrastructure/persistence/BlogArticleRepositoryFactory'
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

    return NextResponse.json(articles)
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
