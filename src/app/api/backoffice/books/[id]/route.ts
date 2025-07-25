import { NextRequest } from 'next/server';
import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware';
import { EventBusFactory } from '@/contexts/shared/infrastructure/eventBus/EventBusFactory';
import { PostgresBookRepository } from '@/contexts/backoffice/book/infrastructure/PostgresBookRepository';
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection';
import { GetBook } from '@/contexts/backoffice/book/application/GetBook';
import { UpdateBook } from '@/contexts/backoffice/book/application/UpdateBook';
import { DeleteBook as DeleteBookAction } from '@/contexts/backoffice/book/application/DeleteBook';
import { getBlogConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling';
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse';
import { ApiValidationError } from '@/contexts/shared/infrastructure/http/ApiValidationError';
import { BookIsbn } from '@/contexts/backoffice/book/domain/BookIsbn';
import { ArticleSubscribers } from '@/contexts/backoffice/article/infrastructure/DependencyInjection/ArticleSubscribers';


async function getConnection() {
  const connection = await PostgresConnection.create(getBlogConfig());
  await ArticleSubscribers.init(connection);
  return connection;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(
    async () => {
    const connection = await getConnection();
    const repository = new PostgresBookRepository(connection);
    const getBook = new GetBook(repository);

    const book = await getBook.run(params.id);
    return HttpNextResponse.ok(book.toFormattedPrimitives(), request.headers.get('origin'));
    },
    request
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(
    async () => {
    const connection = await getConnection();
    const repository = new PostgresBookRepository(connection);
    const updateBook = new UpdateBook(repository);
    
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new ApiValidationError('Content-Type must be application/json');
    }

    let data;
    try {
      const clone = request.clone();
      const rawBody = await clone.json();
      data = rawBody.data || rawBody;
      if (!data || typeof data !== 'object') {
        throw new ApiValidationError('Invalid request data format');
      }

      // Validar tipos de datos
      if (data.title !== undefined && typeof data.title !== 'string') {
        throw new ApiValidationError('title must be a string');
      }
      if (data.author !== undefined && typeof data.author !== 'string') {
        throw new ApiValidationError('author must be a string');
      }
      if (data.description !== undefined && typeof data.description !== 'string') {
        throw new ApiValidationError('description must be a string');
      }
      if (data.purchaseLink !== undefined && data.purchaseLink !== null && typeof data.purchaseLink !== 'string') {
        throw new ApiValidationError('purchaseLink must be a string or null');
      }

      // Validar valores vacíos
      if (data.title === '') {
        throw new ApiValidationError('title cannot be empty');
      }
      if (data.author === '') {
        throw new ApiValidationError('author cannot be empty');
      }
      if (data.description === '') {
        throw new ApiValidationError('description cannot be empty');
      }
    } catch (e) {
      if (e instanceof ApiValidationError) {
        throw e;
      }
      throw new ApiValidationError('Invalid request body');
    }

    await updateBook.run({
      id: params.id,
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      description: data.description,
      purchaseLink: data.purchaseLink
    });

    return HttpNextResponse.noContent(request.headers.get('origin'));
    },
    request
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(
    async () => {
    const connection = await getConnection();
    const repository = new PostgresBookRepository(connection);
    const eventBus = EventBusFactory.getInstance();
    const deleteBook = new DeleteBookAction(repository, eventBus);

    await deleteBook.run(params.id);
    return HttpNextResponse.noContent(request.headers.get('origin'));
    },
    request
  );
}

export async function OPTIONS(request: NextRequest) {
  const response = await corsMiddleware(request);
  return response;
}

// Asegurarse de que la conexión está lista al iniciar
getConnection().catch(console.error);
