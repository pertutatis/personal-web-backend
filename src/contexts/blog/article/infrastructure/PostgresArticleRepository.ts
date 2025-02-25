import { ArticleRepository } from '../domain/ArticleRepository';
import { Article } from '../domain/Article';
import { ArticleId } from '../domain/ArticleId';
import { ArticleTitle } from '../domain/ArticleTitle';
import { ArticleContent } from '../domain/ArticleContent';
import { ArticleBookIds } from '../domain/ArticleBookIds';
import { Collection } from '@/contexts/shared/domain/Collection';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { Book } from '@/contexts/blog/book/domain/Book';
import { BookId } from '@/contexts/blog/book/domain/BookId';
import { BookTitle } from '@/contexts/blog/book/domain/BookTitle';
import { BookAuthor } from '@/contexts/blog/book/domain/BookAuthor';
import { BookIsbn } from '@/contexts/blog/book/domain/BookIsbn';

interface ArticleRow {
  id: string;
  title: string;
  content: string;
  book_ids: string[];
  created_at: Date;
  updated_at: Date;
}

interface BookRow {
  id: string;
  title: string;
  author: string;
  isbn: string;
  created_at: Date;
  updated_at: Date;
}

export class PostgresArticleRepository implements ArticleRepository {
  constructor(
    private readonly articlesConnection: PostgresConnection,
    private readonly booksConnection: PostgresConnection
  ) {}

  async save(article: Article): Promise<void> {
    const primitives = article.toPrimitives();
    await this.articlesConnection.execute(
      'INSERT INTO articles (id, title, content, book_ids, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [
        primitives.id,
        primitives.title,
        primitives.content,
        primitives.bookIds,
        primitives.createdAt,
        primitives.updatedAt
      ]
    );
  }

  async search(id: ArticleId): Promise<Article | null> {
    const articleResult = await this.articlesConnection.queryOne<ArticleRow>(
      'SELECT * FROM articles WHERE id = $1',
      [id.value]
    );

    if (!articleResult) {
      return null;
    }

    const bookResults = await this.booksConnection.query<BookRow>(
      'SELECT * FROM books WHERE id = ANY($1)',
      [articleResult.book_ids]
    );

    const books = bookResults.map(bookRow => this.createBookFromRow(bookRow));
    return this.createArticleFromRows(articleResult, books);
  }

  async searchAll(): Promise<Collection<Article>> {
    const articles = await this.articlesConnection.query<ArticleRow>(
      'SELECT * FROM articles ORDER BY created_at DESC'
    );

    const allBookIds = Array.from(new Set(articles.flatMap(article => article.book_ids)));
    
    const bookResults = await this.booksConnection.query<BookRow>(
      'SELECT * FROM books WHERE id = ANY($1)',
      [allBookIds]
    );

    const books = bookResults.map(bookRow => this.createBookFromRow(bookRow));

    const articlesWithBooks = articles.map(article => {
      const articleBooks = books.filter(book => 
        article.book_ids.includes(book.id.value)
      );
      return this.createArticleFromRows(article, articleBooks);
    });

    return new Collection(articlesWithBooks);
  }

  async searchByPage(page: number, limit: number): Promise<Collection<Article>> {
    const offset = (page - 1) * limit;
    
    const articles = await this.articlesConnection.query<ArticleRow>(
      'SELECT * FROM articles ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const allBookIds = Array.from(new Set(articles.flatMap(article => article.book_ids)));
    
    const bookResults = await this.booksConnection.query<BookRow>(
      'SELECT * FROM books WHERE id = ANY($1)',
      [allBookIds]
    );

    const books = bookResults.map(bookRow => this.createBookFromRow(bookRow));

    const articlesWithBooks = articles.map(article => {
      const articleBooks = books.filter(book => 
        article.book_ids.includes(book.id.value)
      );
      return this.createArticleFromRows(article, articleBooks);
    });

    return new Collection(articlesWithBooks);
  }

  async update(article: Article): Promise<void> {
    const primitives = article.toPrimitives();
    await this.articlesConnection.execute(
      'UPDATE articles SET title = $1, content = $2, book_ids = $3, updated_at = $4 WHERE id = $5',
      [
        primitives.title,
        primitives.content,
        primitives.bookIds,
        primitives.updatedAt,
        primitives.id
      ]
    );
  }

  private createBookFromRow(bookRow: BookRow): Book {
    return Book.create({
      id: BookId.create(bookRow.id),
      title: BookTitle.create(bookRow.title),
      author: BookAuthor.create(bookRow.author),
      isbn: BookIsbn.create(bookRow.isbn),
      createdAt: bookRow.created_at,
      updatedAt: bookRow.updated_at
    });
  }

  private createArticleFromRows(
    articleRow: ArticleRow,
    books: Book[]
  ): Article {
    return Article.create({
      id: ArticleId.create(articleRow.id),
      title: ArticleTitle.create(articleRow.title),
      content: ArticleContent.create(articleRow.content),
      bookIds: ArticleBookIds.create(articleRow.book_ids),
      books,
      createdAt: articleRow.created_at,
      updatedAt: articleRow.updated_at
    });
  }
}
