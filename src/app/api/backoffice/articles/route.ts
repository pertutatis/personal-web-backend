import { NextRequest, NextResponse } from 'next/server';
import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware';
import { PostgresArticleRepository } from '@/contexts/backoffice/article/infrastructure/PostgresArticleRepository';
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection';
import { CreateArticle } from '@/contexts/backoffice/article/application/CreateArticle';
import { ListArticles } from '@/contexts/backoffice/article/application/ListArticles';
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling';
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse';
import { ApiValidationError } from '@/contexts/shared/infrastructure/http/ApiValidationError';
import { getBlogConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';
import { validateRelatedLinks } from '@/contexts/shared/infrastructure/validation/validateRelatedLinks';
import type { RelatedLink } from '@/contexts/shared/infrastructure/validation/validateRelatedLinks';
import { ArticleIdDuplicated } from '@/contexts/backoffice/article/domain/ArticleIdDuplicated';
import { UuidValidator } from '@/contexts/shared/domain/validation/UuidValidator';


async function getConnections() {
  const articlesConnection = await PostgresConnection.create(getBlogConfig());
  return { articlesConnection };
}

export async function GET(request: NextRequest) {
  return executeWithErrorHandling(
    async () => {
    const { articlesConnection } = await getConnections();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const repository = new PostgresArticleRepository(articlesConnection);
    const listArticles = new ListArticles(repository);

    const collection = await listArticles.run({page, limit});
    const { items, total, page: currentPage, limit: itemLimit } = collection.toPrimitives();

    const response = {
      items: items,
      total,
      page: currentPage,
      limit: itemLimit
    };

    return HttpNextResponse.ok(response, request.headers.get('origin'));
    },
    request
  );
}

export async function POST(request: NextRequest) {
  return executeWithErrorHandling(
    async () => {
    const { articlesConnection } = await getConnections();

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
    const id = typeof data.id === 'string' ? data.id.trim() : null;
    const title = typeof data.title === 'string' ? data.title.trim() : null;
    const excerpt = typeof data.excerpt === 'string' ? data.excerpt.trim() : null;
    const articleContent = typeof data.content === 'string' ? data.content.trim() : null;
    const bookIds = Array.isArray(data.bookIds) ? data.bookIds : [];
    const relatedLinks = Array.isArray(data.relatedLinks) ? data.relatedLinks as RelatedLink[] : [];

    // Validate UUID
    if (!id) {
      errors.push('id cannot be empty');
    } else if (!UuidValidator.isValidUuid(id)) {
      errors.push('id must be a valid UUID v4');
    }

    // Validate book UUIDs
    for (const bookId of bookIds) {
      if (!UuidValidator.isValidUuid(bookId)) {
        errors.push(`Book ID ${bookId} must be a valid UUID v4`);
      }
    }

    // Validate title
    if (!title) {
      errors.push('title cannot be empty');
    }

    // Validate excerpt
    if (!excerpt) {
      errors.push('excerpt cannot be empty');
    } else if (excerpt.length > 300) {
      errors.push('excerpt exceeds maximum length of 300 characters');
    }

    // Validate content
    if (!articleContent) {
      errors.push('content cannot be empty');
    } else if (articleContent.length > 20000) {
      errors.push('content exceeds maximum length of 20000 characters');
    }

    if (errors.length > 0) {
      throw new ApiValidationError(errors.join(', '));
    }

    // Validate related links
    validateRelatedLinks(relatedLinks);

    // Create article with validated data
    const articleData = {
      id: id!,
      title: title!,
      excerpt: excerpt!,
      content: articleContent!,
      bookIds: bookIds,
      relatedLinks: relatedLinks.map((link: RelatedLink) => ({
        text: link.text.trim(),
        url: link.url.trim()
      }))
    };

    const repository = new PostgresArticleRepository(articlesConnection);
    const createArticle = new CreateArticle(repository);

    try {
      await createArticle.run(articleData);
      return HttpNextResponse.created(request.headers.get('origin'));
    } catch (error) {
      if (error instanceof ArticleIdDuplicated) {
        return HttpNextResponse.conflict({
          type: 'ValidationError',
          message: error.message
        }, request.headers.get('origin'));
      }
      throw error;
    }
      },
      request
    );
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  const response = await corsMiddleware(request);
  return response;
}

// Asegurarse de que las conexiones están listas al iniciar
getConnections().catch(console.error);
