import { NextRequest } from 'next/server';
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling';
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse';
import { OfficialUuidGenerator } from '@/contexts/shared/infrastructure/OfficialUuidGenerator';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { PostgresArticleRepository } from '@/contexts/blog/article/infrastructure/PostgresArticleRepository';
import { ListArticles } from '@/contexts/blog/article/application/ListArticles';
import { CreateArticle } from '@/contexts/blog/article/application/CreateArticle';
import { articlesDbConfig, booksDbConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';

let articlesConnection: PostgresConnection;
let booksConnection: PostgresConnection;

async function getConnections() {
  if (!articlesConnection) {
    articlesConnection = await PostgresConnection.create(articlesDbConfig);
  }
  if (!booksConnection) {
    booksConnection = await PostgresConnection.create(booksDbConfig);
  }
  return { articlesConnection, booksConnection };
}

export async function GET(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const { articlesConnection, booksConnection } = await getConnections();
    const repository = new PostgresArticleRepository(articlesConnection, booksConnection);
    const listArticles = new ListArticles(repository);
    
    const response = await listArticles.run({ page, limit });
    
    return HttpNextResponse.ok(response);
  });
}

export async function POST(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    const body = await request.json();
    
    const { articlesConnection, booksConnection } = await getConnections();
    const repository = new PostgresArticleRepository(articlesConnection, booksConnection);
    const uuidGenerator = new OfficialUuidGenerator();
    const createArticle = new CreateArticle(repository, uuidGenerator);
    
    await createArticle.run({
      title: body.title,
      content: body.content,
      bookIds: body.bookIds
    });
    
    return HttpNextResponse.created();
  });
}
