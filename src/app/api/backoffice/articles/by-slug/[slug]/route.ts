import { NextRequest } from 'next/server';
import { PostgresArticleRepository } from '@/contexts/backoffice/article/infrastructure/PostgresArticleRepository';
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection';
import { getArticlesConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling';
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse';

const articlesConnectionPromise = PostgresConnection.create(getArticlesConfig());

async function getConnections() {
  const [articlesConnection] = await Promise.all([
    articlesConnectionPromise,
  ]);
  return { articlesConnection };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return executeWithErrorHandling(async () => {
    const { articlesConnection } = await getConnections();
    const repository = new PostgresArticleRepository(
      articlesConnection
    );

    const article = await repository.searchBySlug(params.slug);
    if (!article) {
      return HttpNextResponse.notFound(`Article with slug '${params.slug}' not found`);
    }

    return HttpNextResponse.ok(article.toPrimitives());
  });
}

// Asegurarse de que las conexiones están listas al iniciar
getConnections().catch(console.error);
