import { NextRequest } from 'next/server';
import { PostgresBookRepository } from '@/contexts/blog/book/infrastructure/PostgresBookRepository';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { CreateBook } from '@/contexts/blog/book/application/CreateBook';
import { ListBooks } from '@/contexts/blog/book/application/ListBooks';
import { GetBook } from '@/contexts/blog/book/application/GetBook';
import { Book } from '@/contexts/blog/book/domain/Book';
import { BookId } from '@/contexts/blog/book/domain/BookId';
import { BookTitle } from '@/contexts/blog/book/domain/BookTitle';
import { BookAuthor } from '@/contexts/blog/book/domain/BookAuthor';
import { BookIsbn } from '@/contexts/blog/book/domain/BookIsbn';
import { BookDescription } from '@/contexts/blog/book/domain/BookDescription';
import { BookPurchaseLink } from '@/contexts/blog/book/domain/BookPurchaseLink';
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling';
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse';
import { ValidationError } from '@/contexts/shared/domain/ValidationError';
import { getBooksConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';
import { OfficialUuidGenerator } from '@/contexts/shared/infrastructure/OfficialUuidGenerator';

// Crear conexión como promesa para asegurar una única instancia
const booksConnectionPromise = PostgresConnection.create(getBooksConfig());
const uuidGenerator = new OfficialUuidGenerator();

async function getConnection() {
  return await booksConnectionPromise;
}

export async function GET(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    const connection = await getConnection();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const repository = new PostgresBookRepository(connection);
    const listBooks = new ListBooks(repository);

    const books = await listBooks.run(page, limit);

    return HttpNextResponse.ok({
      items: books.items.map(book => book.toFormattedPrimitives()),
      page: books.pagination.page,
      limit: books.pagination.limit,
      total: books.pagination.total
    });
  });
}

export async function POST(request: NextRequest) {
  return executeWithErrorHandling(async () => {
    console.log('POST /api/blog/books - Start');
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid Content-Type:', contentType);
      throw new ValidationError('Content-Type must be application/json');
    }

    const requestBody = await request.text();
    console.log('Raw request body:', requestBody);
    
    let bookData;
    try {
      const parsedBody = JSON.parse(requestBody);
      console.log('Parsed request body:', parsedBody);

      const data = parsedBody.data || parsedBody;
      if (!data || typeof data !== 'object') {
        console.error('Invalid request structure:', parsedBody);
        throw new ValidationError('Invalid request data format');
      }

      // Log raw input for debugging
      console.log('Raw input validation:', {
        title: { value: data.title, type: typeof data.title },
        author: { value: data.author, type: typeof data.author },
        isbn: { value: data.isbn, type: typeof data.isbn },
        description: { value: data.description, type: typeof data.description },
        purchaseLink: { value: data.purchaseLink, type: typeof data.purchaseLink }
      });

      // Validación estricta de campos
      if (typeof data.title !== 'string') {
        throw new ValidationError('title must be a string');
      }

      if (typeof data.author !== 'string') {
        throw new ValidationError('author must be a string');
      }

      if (typeof data.description !== 'string') {
        throw new ValidationError('description must be a string');
      }

      if (data.purchaseLink !== null && data.purchaseLink !== undefined && typeof data.purchaseLink !== 'string') {
        throw new ValidationError('purchaseLink must be a string or null');
      }

      const title = data.title.trim();
      const author = data.author.trim();
      const description = data.description.trim();
      
      if (title === '') {
        throw new ValidationError('title cannot be empty');
      }

      if (author === '') {
        throw new ValidationError('author cannot be empty');
      }

      if (description === '') {
        throw new ValidationError('description cannot be empty');
      }

      if (!data.isbn) {
        throw new ValidationError('isbn is required');
      }

      bookData = {
        title,
        author,
        isbn: data.isbn,
        description,
        purchaseLink: data.purchaseLink
      };
      console.log('Validation successful:', bookData);
    } catch (e) {
      if (e instanceof ValidationError) {
        console.error('Validation failed:', e.message);
        throw e;
      }
      console.error('Error processing request:', e);
      throw new ValidationError('Invalid request data');
    }

    const connection = await getConnection();
    const repository = new PostgresBookRepository(connection);
    const createBook = new CreateBook(repository, uuidGenerator);

    console.log('Creating book with data:', bookData);
    const book = await createBook.run(bookData);
    const primitives = book.toFormattedPrimitives();
    return HttpNextResponse.created(primitives);
  });
}

// Asegurarse de que la conexión está lista al iniciar
getConnection().catch(console.error);
