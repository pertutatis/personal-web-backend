import { NextRequest } from 'next/server';
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling';
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse';
import { OfficialUuidGenerator } from '@/contexts/shared/infrastructure/OfficialUuidGenerator';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { PostgresBookRepository } from '@/contexts/blog/book/infrastructure/PostgresBookRepository';
import { ListBooks } from '@/contexts/blog/book/application/ListBooks';
import { CreateBook } from '@/contexts/blog/book/application/CreateBook';
import { booksDbConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';

let connection: PostgresConnection;

async function getConnection() {
  if (!connection) {
    connection = await PostgresConnection.create(booksDbConfig);
  }
  return connection;
}

export async function GET(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const connection = await getConnection();
    const repository = new PostgresBookRepository(connection);
    const listBooks = new ListBooks(repository);
    
    const response = await listBooks.run({ page, limit });
    
    return HttpNextResponse.ok(response);
  });
}

export async function POST(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    const body = await request.json();
    
    const connection = await getConnection();
    const repository = new PostgresBookRepository(connection);
    const uuidGenerator = new OfficialUuidGenerator();
    const createBook = new CreateBook(repository, uuidGenerator);
    
    await createBook.run({
      title: body.title,
      author: body.author,
      isbn: body.isbn
    });
    
    return HttpNextResponse.created();
  });
}
