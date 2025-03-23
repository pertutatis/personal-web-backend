import { BookRepository } from '../domain/BookRepository';
import { Book } from '../domain/Book';
import { BookId } from '../domain/BookId';
import { BookTitle } from '../domain/BookTitle';
import { BookAuthor } from '../domain/BookAuthor';
import { BookIsbn } from '../domain/BookIsbn';
import { Collection } from '@/contexts/shared/domain/Collection';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';

interface BookRow {
  id: string;
  title: string;
  author: string;
  isbn: string;
  created_at: Date;
  updated_at: Date;
}

export class PostgresBookRepository implements BookRepository {
  constructor(private readonly connection: PostgresConnection) {}

  async save(book: Book): Promise<void> {
    const primitives = book.toPrimitives();
    await this.connection.execute(
      'INSERT INTO books (id, title, author, isbn, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [
        primitives.id,
        primitives.title,
        primitives.author,
        primitives.isbn,
        primitives.createdAt,
        primitives.updatedAt
      ]
    );
  }

  async search(id: BookId): Promise<Book | null> {
    const result = await this.connection.execute<BookRow>(
      'SELECT * FROM books WHERE id = $1',
      [id.value]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.createBookFromRow(result.rows[0]);
  }

  async searchByIsbn(isbn: string): Promise<Book | null> {
    const normalizedIsbn = BookIsbn.normalizeISBN(isbn);
    const result = await this.connection.execute<BookRow>(
      'SELECT * FROM books WHERE isbn = $1',
      [normalizedIsbn]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.createBookFromRow(result.rows[0]);
  }

  async searchAll(): Promise<Book[]> {
    const result = await this.connection.execute<BookRow>(
      'SELECT * FROM books ORDER BY created_at DESC'
    );

    return result.rows.map(row => this.createBookFromRow(row));
  }

  async searchByPage(page: number, limit: number): Promise<Collection<Book>> {
    const offset = (page - 1) * limit;
    
    const countResult = await this.connection.execute<{ total: string }>(
      'SELECT COUNT(*) as total FROM books'
    );
    
    const total = parseInt(countResult.rows[0].total);

    const result = await this.connection.execute<BookRow>(
      'SELECT * FROM books ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return new Collection(result.rows.map(row => this.createBookFromRow(row)), {
      page,
      limit,
      total
    });
  }

  async update(book: Book): Promise<void> {
    const primitives = book.toPrimitives();
    await this.connection.execute(
      'UPDATE books SET title = $1, author = $2, isbn = $3, updated_at = $4 WHERE id = $5',
      [
        primitives.title,
        primitives.author,
        primitives.isbn,
        primitives.updatedAt,
        primitives.id
      ]
    );
  }

  async delete(id: BookId): Promise<void> {
    await this.connection.execute(
      'DELETE FROM books WHERE id = $1',
      [id.value]
    );
  }

  async searchByIds(ids: BookId[]): Promise<Book[]> {
    if (ids.length === 0) {
      return [];
    }

    const result = await this.connection.execute<BookRow>(
      'SELECT * FROM books WHERE id = ANY($1)',
      [ids.map(id => id.value)]
    );

    return result.rows.map(row => this.createBookFromRow(row));
  }

  private createBookFromRow(row: BookRow): Book {
    return Book.create({
      id: BookId.create(row.id),
      title: BookTitle.create(row.title),
      author: BookAuthor.create(row.author),
      isbn: BookIsbn.create(row.isbn),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }
}
