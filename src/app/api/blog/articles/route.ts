import { NextRequest } from 'next/server';
import { PostgresArticleRepository } from '@/contexts/blog/article/infrastructure/PostgresArticleRepository';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { CreateArticle } from '@/contexts/blog/article/application/CreateArticle';
import { ListArticles } from '@/contexts/blog/article/application/ListArticles';
import { Article } from '@/contexts/blog/article/domain/Article';
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling';
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse';
import { ApiValidationError } from '@/contexts/shared/infrastructure/http/ApiValidationError';
import { getArticlesConfig, getBooksConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';
import { OfficialUuidGenerator } from '@/contexts/shared/infrastructure/OfficialUuidGenerator';
import { validateRelatedLinks } from '@/contexts/shared/infrastructure/validation/validateRelatedLinks';
import type { RelatedLink } from '@/contexts/shared/infrastructure/validation/validateRelatedLinks';

// Crear conexiones como promesas para asegurar una única instancia
const articlesConnectionPromise = PostgresConnection.create(getArticlesConfig());
const booksConnectionPromise = PostgresConnection.create(getBooksConfig());
const uuidGenerator = new OfficialUuidGenerator();

async function getConnections() {
  const [articlesConnection, booksConnection] = await Promise.all([
    articlesConnectionPromise,
    booksConnectionPromise
  ]);
  return { articlesConnection, booksConnection };
}

export async function GET(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    const { articlesConnection, booksConnection } = await getConnections();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const repository = new PostgresArticleRepository(articlesConnection, booksConnection);
    const listArticles = new ListArticles(repository);

    const collection = await listArticles.run({page, limit});
    const response = collection.toPrimitives();

    return HttpNextResponse.ok(response);
  });
}

export async function POST(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    const { articlesConnection, booksConnection } = await getConnections();

    // Validate request content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new ApiValidationError('Content-Type must be application/json');
    }

    // Parse request body
    let rawBody;
    try {
      const clone = request.clone();
      rawBody = await clone.json();
    } catch (e) {
      throw new ApiValidationError('Invalid JSON in request body');
    }

    const data = (rawBody && (rawBody.data || rawBody.body || rawBody)) || {};
    const errors = [];

    // Validate fields
    const title = typeof data.title === 'string' ? data.title.trim() : null;
    const excerpt = typeof data.excerpt === 'string' ? data.excerpt.trim() : null;
    const articleContent = typeof data.content === 'string' ? data.content.trim() : null;
    const bookIds = Array.isArray(data.bookIds) ? data.bookIds : [];
    const relatedLinks = Array.isArray(data.relatedLinks) ? data.relatedLinks as RelatedLink[] : [];

    // Validate title
    if (!title) {
      errors.push('title cannot be empty');
    }

    // Validate excerpt
    if (!excerpt) {
      errors.push('excerpt cannot be empty');
    } else if (excerpt.length > 160) {
      errors.push('excerpt exceeds maximum length of 160 characters');
    }

    // Validate content
    if (!articleContent) {
      errors.push('content cannot be empty');
    } else if (articleContent.length > 10000) {
      errors.push('content exceeds maximum length of 10000 characters');
    }

    if (errors.length > 0) {
      throw new ApiValidationError(errors.join(', '));
    }

    // Validate related links
    validateRelatedLinks(relatedLinks);

    // Create article with validated data
    const articleData = {
      title: title!,
      excerpt: excerpt!,
      content: articleContent!,
      bookIds: bookIds,
      relatedLinks: relatedLinks.map((link: RelatedLink) => ({
        text: link.text.trim(),
        url: link.url.trim()
      }))
    };

    const repository = new PostgresArticleRepository(articlesConnection, booksConnection);
    const createArticle = new CreateArticle(repository, uuidGenerator);
    
    const article = await createArticle.run(articleData);
    return HttpNextResponse.created(article.toPrimitives());
  });
}

// Asegurarse de que las conexiones están listas al iniciar
getConnections().catch(console.error);
