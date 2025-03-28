import { NextRequest } from 'next/server';
import { PostgresArticleRepository } from '@/contexts/blog/article/infrastructure/PostgresArticleRepository';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { GetArticle } from '@/contexts/blog/article/application/GetArticle';
import { UpdateArticle } from '@/contexts/blog/article/application/UpdateArticle';
import { DeleteArticle } from '@/contexts/blog/article/application/DeleteArticle';
import { getArticlesConfig, getBooksConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling';
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse';
import { ApiValidationError } from '@/contexts/shared/infrastructure/http/ApiValidationError';
import { validateRelatedLinks } from '@/contexts/shared/infrastructure/validation/validateRelatedLinks';
import type { RelatedLink } from '@/contexts/shared/infrastructure/validation/validateRelatedLinks';

const articlesConnectionPromise = PostgresConnection.create(getArticlesConfig());
const booksConnectionPromise = PostgresConnection.create(getBooksConfig());

async function getConnections() {
  const [articlesConnection, booksConnection] = await Promise.all([
    articlesConnectionPromise,
    booksConnectionPromise
  ]);
  return { articlesConnection, booksConnection };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(async () => {
    const { articlesConnection, booksConnection } = await getConnections();
    const repository = new PostgresArticleRepository(
      articlesConnection,
      booksConnection
    );
    const getArticle = new GetArticle(repository);

    const article = await getArticle.run(params.id);
    return HttpNextResponse.ok(article.toPrimitives());
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(async () => {
    const { articlesConnection, booksConnection } = await getConnections();
    const repository = new PostgresArticleRepository(articlesConnection, booksConnection);
    const updateArticle = new UpdateArticle(repository);

    // Validate content type
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

    // Get existing article
    const articleFinder = new GetArticle(repository);
    const existingArticle = await articleFinder.run(params.id);
    const existingData = existingArticle.toPrimitives();

    // Build update data only with changed fields
    const updateData: {
      id: string;
      title?: string;
      excerpt?: string;
      content?: string;
      bookIds?: string[];
      relatedLinks?: RelatedLink[];
    } = { id: params.id };

    // Process and validate only provided fields
    if (data.title !== undefined) {
      if (typeof data.title !== 'string' || data.title.trim() === '') {
        throw new ApiValidationError('title cannot be empty');
      }
      updateData.title = data.title.trim();
    }

    if (data.excerpt !== undefined) {
      if (typeof data.excerpt !== 'string') {
        throw new ApiValidationError('excerpt must be a string');
      }
      const excerpt = data.excerpt.trim();
      if (excerpt === '') {
        throw new ApiValidationError('excerpt cannot be empty');
      }
      if (excerpt.length > 160) {
        throw new ApiValidationError('excerpt exceeds maximum length of 160 characters');
      }
      updateData.excerpt = excerpt;
    }

    if (data.content !== undefined) {
      if (typeof data.content !== 'string') {
        throw new ApiValidationError('content must be a string');
      }
      const content = data.content.trim();
      if (content === '') {
        throw new ApiValidationError('content cannot be empty');
      }
      if (content.length > 10000) {
        throw new ApiValidationError('content exceeds maximum length of 10000 characters');
      }
      updateData.content = content;
    }

    if (data.bookIds !== undefined) {
      if (!Array.isArray(data.bookIds)) {
        throw new ApiValidationError('bookIds must be an array');
      }
      updateData.bookIds = data.bookIds;
    }

    if (data.relatedLinks !== undefined) {
      const links = Array.isArray(data.relatedLinks) ? data.relatedLinks as RelatedLink[] : [];
      validateRelatedLinks(links);
      updateData.relatedLinks = links.map((link: RelatedLink) => ({
        text: link.text.trim(),
        url: link.url.trim()
      }));
    }

    // Execute update only with changed fields
    await updateArticle.run(updateData);

    // Get the updated article
    const updatedArticle = await articleFinder.run(params.id);
    return HttpNextResponse.ok(updatedArticle.toPrimitives());
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(async () => {
    const { articlesConnection, booksConnection } = await getConnections();
    const repository = new PostgresArticleRepository(articlesConnection, booksConnection);
    const deleteArticle = new DeleteArticle(repository);

    await deleteArticle.run(params.id);

    return HttpNextResponse.noContent();
  });
}

// Asegurarse de que las conexiones están listas al iniciar
getConnections().catch(console.error);
