import { BookRepository } from '../domain/BookRepository';
import { Book } from '../domain/Book';
import { BookId } from '../domain/BookId';
import { BookTitle } from '../domain/BookTitle';
import { BookAuthor } from '../domain/BookAuthor';
import { BookIsbn } from '../domain/BookIsbn';
import { BookDescription } from '../domain/BookDescription';
import { BookPurchaseLink } from '../domain/BookPurchaseLink';
import { BookIdDuplicated } from '../domain/BookIdDuplicated';
import { BookIsbnDuplicated } from '../domain/BookIsbnDuplicated';
import { Collection } from '@/contexts/shared/domain/Collection';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';

interface BookRow {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  purchase_link: string | null;
  created_at: Date;
  updated_at: Date;
}

export class PostgresBookRepository implements BookRepository {
  constructor(private readonly connection: PostgresConnection) {}

  async save(book: Book): Promise<void> {
    const exists = await this.exists(book.id);
    if (exists) {
      throw new BookIdDuplicated(book.id.value);
    }

    // Verificar si el ISBN ya existe
    const existingBookWithIsbn = await this.searchByIsbn(book.isbn.value);
    if (existingBookWithIsbn) {
      throw new BookIsbnDuplicated(book.isbn.value);
    }

    const primitives = book.toPrimitives();
    const purchaseLink = primitives.purchaseLink || null;
    await this.connection.execute(
      'INSERT INTO books (id, title, author, isbn, description, purchase_link, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        primitives.id,
        primitives.title,
        primitives.author,
        primitives.isbn,
        primitives.description,
        purchaseLink,
        primitives.createdAt,
        primitives.updatedAt
      ]
    );
  }

  async exists(id: BookId): Promise<boolean> {
    const result = await this.connection.execute<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM books WHERE id = $1) as exists',
      [id.value]
    );

    return result.rows[0].exists;
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
    const purchaseLink = primitives.purchaseLink || null;
    await this.connection.execute(
      'UPDATE books SET title = $1, author = $2, isbn = $3, description = $4, purchase_link = $5, updated_at = $6 WHERE id = $7',
      [
        primitives.title,
        primitives.author,
        primitives.isbn,
        primitives.description,
        purchaseLink,
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
      id: new BookId(row.id),
      title: new BookTitle(row.title),
      author: new BookAuthor(row.author),
      isbn: new BookIsbn(row.isbn),
      description: new BookDescription(row.description),
      purchaseLink: row.purchase_link ? BookPurchaseLink.create(row.purchase_link) : BookPurchaseLink.createEmpty(),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }
}
