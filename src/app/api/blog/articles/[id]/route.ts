import { NextRequest } from 'next/server';
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling';
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { PostgresArticleRepository } from '@/contexts/blog/article/infrastructure/PostgresArticleRepository';
import { GetArticle } from '@/contexts/blog/article/application/GetArticle';
import { UpdateArticle } from '@/contexts/blog/article/application/UpdateArticle';
import { ArticleNotFound } from '@/contexts/blog/article/application/ArticleNotFound';
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

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: NextRequest, { params }: Params) {
  return executeWithErrorHandling(async () => {
    const { articlesConnection, booksConnection } = await getConnections();
    const repository = new PostgresArticleRepository(articlesConnection, booksConnection);
    const getArticle = new GetArticle(repository);
    
    try {
      const article = await getArticle.run(params.id);
      return HttpNextResponse.ok(article.toPrimitives());
    } catch (error) {
      if (error instanceof ArticleNotFound) {
        return HttpNextResponse.notFound(error.message);
      }
      throw error;
    }
  });
}

export async function PUT(request: NextRequest, { params }: Params) {
  return executeWithErrorHandling(async () => {
    const body = await request.json();
    
    const { articlesConnection, booksConnection } = await getConnections();
    const repository = new PostgresArticleRepository(articlesConnection, booksConnection);
    const updateArticle = new UpdateArticle(repository);
    
    try {
      await updateArticle.run({
        id: params.id,
        title: body.title,
        content: body.content,
        bookIds: body.bookIds
      });
      
      return HttpNextResponse.ok();
    } catch (error) {
      if (error instanceof ArticleNotFound) {
        return HttpNextResponse.notFound(error.message);
      }
      throw error;
    }
  });
}
