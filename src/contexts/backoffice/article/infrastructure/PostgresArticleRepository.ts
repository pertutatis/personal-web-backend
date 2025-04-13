import { ArticleRepository } from '../domain/ArticleRepository';
import { Article } from '../domain/Article';
import { ArticleId } from '../domain/ArticleId';
import { ArticleTitle } from '../domain/ArticleTitle';
import { ArticleExcerpt } from '../domain/ArticleExcerpt';
import { ArticleContent } from '../domain/ArticleContent';
import { ArticleBookIds } from '../domain/ArticleBookIds';
import { ArticleRelatedLinks } from '../domain/ArticleRelatedLinks';
import { ArticleRelatedLink } from '../domain/ArticleRelatedLink';
import { ArticleSlug } from '../domain/ArticleSlug';
import { Collection } from '@/contexts/shared/domain/Collection';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { DomainError } from '@/contexts/shared/domain/DomainError';

class ArticleNotFoundError extends DomainError {
  readonly type = 'ArticleNotFoundError';
  
  constructor() {
    super('Article not found');
  }
}

class InvalidBookReferenceError extends DomainError {
  readonly type = 'InvalidBookReferenceError';
  
  constructor() {
    super('One or more referenced books do not exist');
  }
}
import { BookId } from '@/contexts/backoffice/book/domain/BookId';

interface ArticleRow {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  book_ids: string[];
  related_links: Array<{ text: string; url: string }>;
  slug: string;
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
      throw new InvalidBookReferenceError();
    }
  }

  async save(article: Article): Promise<void> {
    const primitives = article.toPrimitives();
    try {
      const bookIdsArray = Array.isArray(primitives.bookIds) ? primitives.bookIds : [];
      await this.validateBookIds(bookIdsArray);
      
      await this.articlesConnection.execute(
        `INSERT INTO articles (
          id, title, excerpt, content, book_ids, related_links, slug, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5::text[], $6::jsonb, $7, $8, $9
        )`,
        [
          primitives.id,
          primitives.title,
          primitives.excerpt,
          primitives.content,
          bookIdsArray,
          JSON.stringify(primitives.relatedLinks || []),
          primitives.slug,
          new Date(primitives.createdAt),
          new Date(primitives.updatedAt)
        ]
      );
    } catch (error) {
      console.error('Error saving article:', error);
      throw error;
    }
  }

  async searchByBookId(bookId: BookId): Promise<Article[]> {
    const result = await this.articlesConnection.execute<ArticleRow>(
      'SELECT * FROM articles WHERE $1 = ANY(book_ids)',
      [bookId.value]
    );

    return result.rows.map(row => this.createArticleFromRow(row));
  }

  async search(id: ArticleId): Promise<Article | null> {
    try {
      const result = await this.articlesConnection.execute<ArticleRow>(
        'SELECT * FROM articles WHERE id = $1',
        [id.value]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const articleRow = result.rows[0];
      return this.createArticleFromRow(articleRow);
    } catch (error) {
      console.error('Error searching for article:', error);
      throw error;
    }
  }

  async searchBySlug(slug: string): Promise<Article | null> {
    try {
      const result = await this.articlesConnection.execute<ArticleRow>(
        'SELECT * FROM articles WHERE slug = $1',
        [slug]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const articleRow = result.rows[0];
      return this.createArticleFromRow(articleRow);
    } catch (error) {
      console.error('Error searching for article by slug:', error);
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

  async update(article: Article): Promise<void> {
    const primitives = article.toPrimitives();

    try {
      const existingArticle = await this.search(article.id);
      if (!existingArticle) {
        throw new ArticleNotFoundError();
      }

      const existingData = existingArticle.toPrimitives();

      if (primitives.bookIds !== existingData.bookIds) {
        await this.validateBookIds(primitives.bookIds);
      }

      await this.articlesConnection.execute(
        `UPDATE articles
         SET title = $1,
             excerpt = $2,
             content = $3,
             book_ids = $4::text[],
             related_links = $5::jsonb,
             slug = $6,
             updated_at = (
               SELECT GREATEST(
                 timezone('UTC', NOW()),
                 (SELECT updated_at + interval '1 second' FROM articles WHERE id = $7)
               )
             )
         WHERE id = $7`,
        [
          primitives.title,
          primitives.excerpt,
          primitives.content,
          primitives.bookIds,
          JSON.stringify(primitives.relatedLinks || []),
          primitives.slug,
          primitives.id
        ]
      );

      const updatedArticle = await this.search(new ArticleId(primitives.id));
      if (!updatedArticle) {
        throw new Error('Article not found after update');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  async delete(id: ArticleId): Promise<void> {
    try {
      const result = await this.articlesConnection.execute(
        'DELETE FROM articles WHERE id = $1',
        [id.value]
      );
      if (result.rowCount === 0) {
        throw new Error('Article not found');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }

  private createArticleFromRow(row: ArticleRow): Article {
    try {
      let relatedLinks: Array<{ text: string; url: string }> = [];
      if (typeof row.related_links === 'string') {
        relatedLinks = JSON.parse(row.related_links);
      } else if (Array.isArray(row.related_links)) {
        relatedLinks = row.related_links;
      }

      return new Article({
        id: new ArticleId(row.id),
        title: new ArticleTitle(row.title),
        excerpt: new ArticleExcerpt(row.excerpt),
        content: new ArticleContent(row.content),
        bookIds: ArticleBookIds.fromValues(row.book_ids || []),
        relatedLinks: ArticleRelatedLinks.create(relatedLinks),
        slug: new ArticleSlug(row.slug),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      });
    } catch (error) {
      console.error('Error creating article from row:', error);
      throw error;
    }
  }
}
