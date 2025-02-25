import { NextRequest } from 'next/server';
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling';
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { PostgresBookRepository } from '@/contexts/blog/book/infrastructure/PostgresBookRepository';
import { GetBook } from '@/contexts/blog/book/application/GetBook';
import { UpdateBook } from '@/contexts/blog/book/application/UpdateBook';
import { BookNotFound } from '@/contexts/blog/book/application/BookNotFound';
import { booksDbConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';

let connection: PostgresConnection;

async function getConnection() {
  if (!connection) {
    connection = await PostgresConnection.create(booksDbConfig);
  }
  return connection;
}

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: NextRequest, { params }: Params) {
  return executeWithErrorHandling(async () => {
    const connection = await getConnection();
    const repository = new PostgresBookRepository(connection);
    const getBook = new GetBook(repository);
    
    try {
      const book = await getBook.run(params.id);
      return HttpNextResponse.ok(book.toPrimitives());
    } catch (error) {
      if (error instanceof BookNotFound) {
        return HttpNextResponse.notFound(error.message);
      }
      throw error;
    }
  });
}

export async function PUT(request: NextRequest, { params }: Params) {
  return executeWithErrorHandling(async () => {
    const body = await request.json();
    
    const connection = await getConnection();
    const repository = new PostgresBookRepository(connection);
    const updateBook = new UpdateBook(repository);
    
    try {
      await updateBook.run({
        id: params.id,
        title: body.title,
        author: body.author,
        isbn: body.isbn
      });
      
      return HttpNextResponse.ok();
    } catch (error) {
      if (error instanceof BookNotFound) {
        return HttpNextResponse.notFound(error.message);
      }
      throw error;
    }
  });
}
