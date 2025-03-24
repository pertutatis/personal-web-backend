import { ArticleRepository } from '../domain/ArticleRepository';
import { Article } from '../domain/Article';
import { ArticleId } from '../domain/ArticleId';
import { ArticleTitle } from '../domain/ArticleTitle';
import { ArticleExcerpt } from '../domain/ArticleExcerpt';
import { ArticleContent } from '../domain/ArticleContent';
import { ArticleBookIds } from '../domain/ArticleBookIds';
import { Collection } from '@/contexts/shared/domain/Collection';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { ValidationError } from '@/contexts/shared/domain/ValidationError';
import { Book } from '@/contexts/blog/book/domain/Book';
import { BookId } from '@/contexts/blog/book/domain/BookId';
import { BookTitle } from '@/contexts/blog/book/domain/BookTitle';
import { BookAuthor } from '@/contexts/blog/book/domain/BookAuthor';
import { BookIsbn } from '@/contexts/blog/book/domain/BookIsbn';

interface ArticleRow {
  id: string;
  title: string;
  excerpt: string;
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

  private async validateBookIds(bookIds: string[]): Promise<void> {
    if (bookIds.length === 0) {
      return;
    }

    const result = await this.booksConnection.execute<{ count: string }>(
      'SELECT COUNT(*) as count FROM books WHERE id = ANY($1::text[])',
      [bookIds]
    );

    const existingCount = parseInt(result.rows[0].count);
    if (existingCount !== bookIds.length) {
      throw new ValidationError('One or more referenced books do not exist');
    }
  }

  async save(article: Article): Promise<void> {
    const primitives = article.toPrimitives();
    console.log('Saving article with primitives:', primitives);

    try {
      const bookIdsArray = Array.isArray(primitives.bookIds) ? primitives.bookIds : [];
      await this.validateBookIds(bookIdsArray);
      
      console.log('Inserting article with book_ids:', bookIdsArray);
      await this.articlesConnection.execute(
        'INSERT INTO articles (id, title, excerpt, content, book_ids, created_at, updated_at) VALUES ($1, $2, $3, $4, $5::text[], $6, $7)',
        [
          primitives.id,
          primitives.title,
          primitives.excerpt,
          primitives.content,
          bookIdsArray,
          new Date(primitives.createdAt),
          new Date(primitives.updatedAt)
        ]
      );
      console.log('Article saved successfully');
    } catch (error) {
      console.error('Error saving article:', error);
      throw error;
    }
  }

  async search(id: ArticleId): Promise<Article | null> {
    console.log('Searching for article with id:', id.value);

    try {
      const result = await this.articlesConnection.execute<ArticleRow>(
        'SELECT * FROM articles WHERE id = $1',
        [id.value]
      );

      if (result.rows.length === 0) {
        console.log('Article not found');
        return null;
      }

      const articleRow = result.rows[0];
      console.log('Found article row:', articleRow);
      const article = this.createArticleFromRow(articleRow);
      console.log('Created article:', article.toPrimitives());
      return article;
    } catch (error) {
      console.error('Error searching for article:', error);
      throw error;
    }
  }

  async searchAll(): Promise<Article[]> {
    const result = await this.articlesConnection.execute<ArticleRow>(
      'SELECT * FROM articles ORDER BY created_at DESC'
    );

    return result.rows.map(row => this.createArticleFromRow(row));
  }

  async searchByPage(page: number, limit: number): Promise<Collection<Article>> {
    const offset = (page - 1) * limit;
    
    const countResult = await this.articlesConnection.execute<{ total: string }>(
      'SELECT COUNT(*) as total FROM articles'
    );
    
    const total = parseInt(countResult.rows[0].total);

    const result = await this.articlesConnection.execute<ArticleRow>(
      'SELECT * FROM articles ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const articles = result.rows.map(row => this.createArticleFromRow(row));

    return new Collection(articles, {
      page,
      limit,
      total
    });
  }

  async searchByBookId(bookId: BookId): Promise<Article[]> {
    const result = await this.articlesConnection.execute<ArticleRow>(
      'SELECT * FROM articles WHERE $1 = ANY(book_ids)',
      [bookId.value]
    );

    return result.rows.map(row => this.createArticleFromRow(row));
  }

  async update(article: Article): Promise<void> {
    const primitives = article.toPrimitives();
    console.log('Updating article:', primitives);

    try {
      const existingArticle = await this.search(article.id);
      if (!existingArticle) {
        throw new ValidationError('Article not found');
      }

      // Get existing data
      const existingData = existingArticle.toPrimitives();

      // Validate book IDs if they've been updated
      if (primitives.bookIds !== existingData.bookIds) {
        await this.validateBookIds(primitives.bookIds);
      }

      // Execute the update query with all fields, ensuring updated_at is in UTC and greater than current timestamp
      await this.articlesConnection.execute(
        `UPDATE articles
         SET title = $1,
             excerpt = $2,
             content = $3,
             book_ids = $4::text[],
             updated_at = (
               SELECT GREATEST(
                 timezone('UTC', NOW()),
                 (SELECT updated_at + interval '1 second' FROM articles WHERE id = $5)
               )
             )
         WHERE id = $5
         RETURNING id, title, excerpt, content, book_ids, created_at AT TIME ZONE 'UTC' as created_at, updated_at AT TIME ZONE 'UTC' as updated_at`,
        [
          primitives.title,
          primitives.excerpt,
          primitives.content,
          primitives.bookIds,
          primitives.id
        ]
      );

      // Forzar recarga del artículo para obtener los timestamps actualizados
      const updatedArticle = await this.search(ArticleId.create(primitives.id));
      if (!updatedArticle) {
        throw new Error('Article not found after update');
      }

      console.log('Article updated successfully');
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  async delete(id: ArticleId): Promise<void> {
    try {
      console.log(`Attempting to delete article with ID: ${id.value}`);
      const result = await this.articlesConnection.execute(
        'DELETE FROM articles WHERE id = $1',
        [id.value]
      );
      if (result.rowCount === 0) {
        console.log('No article found to delete');
        throw new Error('Article not found');
      }
      console.log('Article deleted successfully');
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }

  private createArticleFromRow(row: ArticleRow): Article {
    console.log('Creating article from row:', row);
    try {
      const article = Article.create({
        id: ArticleId.create(row.id),
        title: ArticleTitle.create(row.title),
        excerpt: ArticleExcerpt.create(row.excerpt),
        content: ArticleContent.create(row.content),
        bookIds: ArticleBookIds.create(row.book_ids || []),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      });
      console.log('Created article primitives:', article.toPrimitives());
      return article;
    } catch (error) {
      console.error('Error creating article from row:', error);
      throw error;
    }
  }
}
