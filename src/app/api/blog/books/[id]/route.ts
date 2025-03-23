import { NextRequest } from 'next/server';
import { PostgresBookRepository } from '@/contexts/blog/book/infrastructure/PostgresBookRepository';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { GetBook } from '@/contexts/blog/book/application/GetBook';
import { UpdateBook } from '@/contexts/blog/book/application/UpdateBook';
import { DeleteBook as DeleteBookAction } from '@/contexts/blog/book/application/DeleteBook';
import { getBooksConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling';
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse';
import { ValidationError } from '@/contexts/shared/domain/ValidationError';
import { BookIsbn } from '@/contexts/blog/book/domain/BookIsbn';

// Crear conexión como promesa para asegurar una única instancia
const booksConnectionPromise = PostgresConnection.create(getBooksConfig());

async function getConnection() {
  return await booksConnectionPromise;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(async () => {
    const connection = await getConnection();
    const repository = new PostgresBookRepository(connection);
    const getBook = new GetBook(repository);

    const book = await getBook.run(params.id);
    return HttpNextResponse.ok(book.toPrimitives());
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(async () => {
    const connection = await getConnection();
    const repository = new PostgresBookRepository(connection);
    const updateBook = new UpdateBook(repository);
    
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new ValidationError('Content-Type must be application/json');
    }

    let data;
    try {
      const clone = request.clone();
      const rawBody = await clone.json();
      data = rawBody.data || rawBody;
      if (!data || typeof data !== 'object') {
        throw new ValidationError('Invalid request data format');
      }
    } catch (e) {
      throw new ValidationError('Invalid request body');
    }

    const updatedBook = await updateBook.run({
      id: params.id,
      title: data.title,
      author: data.author,
      isbn: data.isbn
    });

    const primitives = {
      ...updatedBook.toPrimitives(),
    };
    return HttpNextResponse.ok(primitives);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return executeWithErrorHandling(async () => {
    const connection = await getConnection();
    const repository = new PostgresBookRepository(connection);
    const deleteBook = new DeleteBookAction(repository);

    await deleteBook.run(params.id);
    return HttpNextResponse.noContent();
  });
}

// Asegurarse de que la conexión está lista al iniciar
getConnection().catch(console.error);
