import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { PostgresConfig } from '@/contexts/shared/config/PostgresConfig';
import { PostgresBlogArticleRepository } from '@/contexts/blog/article/infrastructure/persistence/PostgresBlogArticleRepository';
import { NextResponse } from 'next/server';

async function getConnections() {
  const articlesConnection = await PostgresConnection.create(
    PostgresConfig.getArticlesDbConfig()
  );
  const booksConnection = await PostgresConnection.create(
    PostgresConfig.getBooksDbConfig()
  );
  return { articlesConnection, booksConnection };
}

export async function GET() {
  let articlesConnection: PostgresConnection | undefined;
  let booksConnection: PostgresConnection | undefined;

  try {
    const connections = await getConnections();
    articlesConnection = connections.articlesConnection;
    booksConnection = connections.booksConnection;

    const repository = new PostgresBlogArticleRepository(
      articlesConnection,
      booksConnection
    );

    const articles = await repository.findAll();
    return NextResponse.json(articles);

  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );

  } finally {
    if (articlesConnection) {
      await articlesConnection.close();
    }
    if (booksConnection) {
      await booksConnection.close();
    }
  }
}
