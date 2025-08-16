import { BlogArticle } from '../../domain/BlogArticle'
import { BlogArticleRepository } from '../../domain/BlogArticleRepository'
import { BlogBook } from '../../domain/BlogBook'
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'
import { QueryResult } from 'pg'

interface ArticleRow {
  id: string
  title: string
  excerpt: string
  content: string
  book_ids: string[]
  book_ids_debug?: string
  related_links: string
  slug: string
  created_at: Date
  updated_at: Date
  published_at?: Date | null
  series_id?: string | null
  series_title?: string | null
  series_description?: string | null
  series_created_at?: Date | null
  series_updated_at?: Date | null
}

interface BookRow {
  id: string
  id_text?: string
  title: string
  author: string
  isbn: string | null
  description: string | null
  purchase_link: string | null
  created_at: Date
  updated_at: Date
}

export class PostgresBlogArticleRepository implements BlogArticleRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async findAll(): Promise<BlogArticle[]> {
    // First get all published articles only
    const articlesQuery = `
      SELECT
        a.id,
        a.title,
        a.excerpt,
        a.content,
        a.book_ids,
        a.related_links,
        a.slug,
        a.created_at,
        a.updated_at,
        a.published_at,
        a.series_id,
        s.title as series_title,
        s.description as series_description,
        s.created_at as series_created_at,
        s.updated_at as series_updated_at
      FROM articles a
      LEFT JOIN series s ON a.series_id = s.id
      WHERE a.status = 'PUBLISHED'
      ORDER BY a.created_at DESC;
    `

    const articlesResult =
      await this.connection.execute<ArticleRow>(articlesQuery)
    const articles = articlesResult.rows

    if (articles.length === 0) {
      return []
    }

    // Then get all referenced books
    const allBookIds = articles.reduce((ids: string[], article) => {
      return [...ids, ...(article.book_ids || [])]
    }, [])

    let books: BookRow[] = []
    if (allBookIds.length > 0) {
      const booksQuery = `
        WITH clean_ids AS (
          SELECT DISTINCT trim(unnest($1::text[])) as id
        )
        SELECT b.*, b.id::text as id_text
        FROM books b
        JOIN clean_ids c ON b.id::text = c.id
        ORDER BY b.title;
      `
      const booksResult = await this.connection.execute<BookRow>(booksQuery, [
        allBookIds,
      ])
      books = booksResult.rows
    }

    // Map articles with their books
    return articles.map((article) => {
      const articleBooks = books.filter((book) =>
        article.book_ids.includes(book.id),
      )
      return this.mapToArticle(article, articleBooks)
    })
  }

  async findBySlug(slug: string): Promise<BlogArticle | null> {
    const articleQuery = `
      SELECT 
        a.id,
        a.title,
        a.excerpt,
        a.content,
        a.book_ids,
        a.related_links,
        a.slug,
        a.created_at,
        a.updated_at,
        a.series_id,
        s.title as series_title,
        s.description as series_description,
        s.created_at as series_created_at,
        s.updated_at as series_updated_at
      FROM articles a
      LEFT JOIN series s ON a.series_id = s.id
      WHERE a.slug = $1 AND a.status = 'PUBLISHED';
    `

    const articleResult = await this.connection.execute<ArticleRow>(
      articleQuery,
      [slug],
    )

    if (articleResult.rows.length === 0) {
      return null
    }

    const article = articleResult.rows[0]
    const bookIds = article.book_ids || []

    let books: BookRow[] = []
    if (bookIds.length > 0) {
      const booksQuery = `
        SELECT
          b.*,
          b.id::text as id_text
        FROM books b
        WHERE b.id::text = ANY(
          SELECT regexp_replace(x, '[{}]', '', 'g')
          FROM unnest($1::text[]) AS x
        )
        ORDER BY b.title;
      `
      const booksResult = await this.connection.execute<BookRow>(booksQuery, [
        bookIds,
      ])
      books = booksResult.rows
    }

    return this.mapToArticle(article, books)
  }

  private mapToArticle(article: ArticleRow, books: BookRow[]): BlogArticle {
    const mappedBooks = books.map(
      (book) =>
        new BlogBook(
          book.id_text || book.id,
          book.title,
          book.author,
          book.isbn ?? '',
          book.description ?? '',
          book.purchase_link ?? '',
          new Date(book.created_at),
          new Date(book.updated_at),
        ),
    )

    let serie = null
    if (
      article.series_id &&
      article.series_title &&
      article.series_description &&
      article.series_created_at &&
      article.series_updated_at
    ) {
      serie = {
        id: article.series_id,
        title: article.series_title,
        description: article.series_description,
        createdAt: new Date(article.series_created_at).toISOString(),
        updatedAt: new Date(article.series_updated_at).toISOString(),
      }
    }

    return new BlogArticle(
      article.id,
      article.title,
      article.excerpt,
      article.content,
      mappedBooks,
      typeof article.related_links === 'string'
        ? JSON.parse(article.related_links)
        : article.related_links,
      article.slug,
      new Date(article.created_at),
      new Date(article.updated_at),
      article.published_at ? new Date(article.published_at) : undefined,
      serie,
    )
  }
}
