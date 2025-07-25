import { ArticleRepository } from '../domain/ArticleRepository'
import { Article } from '../domain/Article'
import { ArticleId } from '../domain/ArticleId'
import { ArticleTitle } from '../domain/ArticleTitle'
import { ArticleExcerpt } from '../domain/ArticleExcerpt'
import { ArticleContent } from '../domain/ArticleContent'
import { ArticleBookIds } from '../domain/ArticleBookIds'
import { ArticleRelatedLinks } from '../domain/ArticleRelatedLinks'
import { ArticleSlug } from '../domain/ArticleSlug'
import { Collection } from '@/contexts/shared/domain/Collection'
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'
import { BookId } from '@/contexts/backoffice/book/domain/BookId'
import { InvalidBookReferenceError } from '@/contexts/backoffice/article/domain/InvalidBookReferenceError'
import { ArticleNotFoundError } from '@/contexts/backoffice/article/domain/ArticleNotFoundError'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

interface ArticleRow {
  id: string
  title: string
  excerpt: string
  content: string
  book_ids: string[]
  related_links: Array<{ text: string; url: string }>
  slug: string
  created_at: Date
  updated_at: Date
}

export class PostgresArticleRepository implements ArticleRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  private async validateBookIds(bookIds: string[]): Promise<void> {
    if (bookIds.length === 0) {
      return
    }

    try {
      // Validate all IDs are valid UUIDs
      bookIds.forEach((id) => new BookId(id))

      const result = await this.connection.execute<{
        id: string
        exists: boolean
      }>(
        `
        WITH book_ids AS (
          SELECT UNNEST($1::text[]) as id
        )
        SELECT
          book_ids.id,
          EXISTS (
            SELECT 1 FROM books
            WHERE books.id::text = book_ids.id::text
          ) as exists
        FROM book_ids
        `,
        [bookIds],
      )

      const missingIds = result.rows
        .filter((row) => !row.exists)
        .map((row) => row.id)

      if (missingIds.length > 0) {
        throw new InvalidBookReferenceError(missingIds[0])
      }
    } catch (error) {
      Logger.error('Error validating book IDs:', error)
      throw error
    }
  }

  async save(article: Article): Promise<void> {
    const primitives = article.toPrimitives()
    try {
      const bookIdsArray = Array.isArray(primitives.bookIds)
        ? primitives.bookIds
        : []

      await this.validateBookIds(bookIdsArray)

      await this.connection.execute(
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
          new Date(primitives.updatedAt),
        ],
      )
    } catch (error) {
      Logger.error('Error saving article:', error)
      throw error
    }
  }

  async searchByBookId(bookId: BookId): Promise<Article[]> {
    const result = await this.connection.execute<ArticleRow>(
      'SELECT * FROM articles WHERE $1 = ANY(book_ids)',
      [bookId.value],
    )

    return Promise.all(result.rows.map((row) => this.createArticleFromRow(row)))
  }

  async search(id: ArticleId): Promise<Article | null> {
    try {
      const result = await this.connection.execute<ArticleRow>(
        'SELECT * FROM articles WHERE id = $1',
        [id.value],
      )

      if (result.rows.length === 0) {
        return null
      }

      const articleRow = result.rows[0]
      return this.createArticleFromRow(articleRow)
    } catch (error) {
      Logger.error('Error searching for article:', error)
      throw error
    }
  }

  async searchBySlug(slug: string): Promise<Article | null> {
    try {
      const result = await this.connection.execute<ArticleRow>(
        'SELECT * FROM articles WHERE slug = $1',
        [slug],
      )

      if (result.rows.length === 0) {
        return null
      }

      const articleRow = result.rows[0]
      return this.createArticleFromRow(articleRow)
    } catch (error) {
      Logger.error('Error searching for article by slug:', error)
      throw error
    }
  }

  async searchAll(): Promise<Article[]> {
    const result = await this.connection.execute<ArticleRow>(
      'SELECT * FROM articles ORDER BY created_at DESC',
    )

    return Promise.all(result.rows.map((row) => this.createArticleFromRow(row)))
  }

  async searchByPage(
    page: number,
    limit: number,
  ): Promise<Collection<Article>> {
    const offset = (page - 1) * limit

    const countResult = await this.connection.execute<{ total: string }>(
      'SELECT COUNT(*) as total FROM articles',
    )

    const total = parseInt(countResult.rows[0].total)

    const result = await this.connection.execute<ArticleRow>(
      'SELECT * FROM articles ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset],
    )

    const articles = await Promise.all(
      result.rows.map((row) => this.createArticleFromRow(row)),
    )

    return new Collection(articles, {
      page,
      limit,
      total,
    })
  }

  async update(article: Article): Promise<void> {
    const primitives = article.toPrimitives()

    try {
      const existingArticle = await this.search(article.id)
      if (!existingArticle) {
        throw new ArticleNotFoundError()
      }

      const existingData = existingArticle.toPrimitives()

      if (primitives.bookIds !== existingData.bookIds) {
        await this.validateBookIds(primitives.bookIds)
      }

      await this.connection.execute(
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
          primitives.id,
        ],
      )

      const updatedArticle = await this.search(new ArticleId(primitives.id))
      if (!updatedArticle) {
        throw new Error('Article not found after update')
      }
    } catch (error) {
      Logger.error('Error updating article:', error)
      throw error
    }
  }

  async delete(id: ArticleId): Promise<void> {
    try {
      const result = await this.connection.execute(
        'DELETE FROM articles WHERE id = $1',
        [id.value],
      )
      if (result.rowCount === 0) {
        throw new Error('Article not found')
      }
    } catch (error) {
      Logger.error('Error deleting article:', error)
      throw error
    }
  }

  async removeBookReference(bookId: BookId): Promise<void> {
    try {
      await this.connection.execute(
        `UPDATE articles
         SET book_ids = array_remove(book_ids, $1::text),
             updated_at = timezone('UTC', NOW())
         WHERE $1 = ANY(book_ids)`,
        [bookId.value],
      )
    } catch (error) {
      Logger.error('Error removing book reference from articles:', error)
      throw error
    }
  }

  private createArticleFromRow(row: ArticleRow): Article {
    try {
      let relatedLinks: Array<{ text: string; url: string }> = []
      if (typeof row.related_links === 'string') {
        relatedLinks = JSON.parse(row.related_links)
      } else if (Array.isArray(row.related_links)) {
        relatedLinks = row.related_links
      }

      return new Article({
        id: new ArticleId(row.id),
        title: new ArticleTitle(row.title),
        excerpt: new ArticleExcerpt(row.excerpt),
        content: new ArticleContent(row.content),
        bookIds: ArticleBookIds.create(row.book_ids || []),
        relatedLinks: ArticleRelatedLinks.create(relatedLinks),
        slug: new ArticleSlug(row.slug),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      })
    } catch (error) {
      Logger.error('Error creating article from row:', error)
      throw error
    }
  }
}
