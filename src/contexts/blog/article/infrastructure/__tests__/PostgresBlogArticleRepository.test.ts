import { TestDatabase } from '@/contexts/shared/infrastructure/__tests__/TestDatabase'
import { TestHelper } from '@/contexts/shared/infrastructure/__tests__/TestHelper'
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'
import { PostgresBlogArticleRepository } from '../persistence/BlogArticleRepository'
import { BlogArticle } from '../../domain/BlogArticle'
import { BlogBook } from '../../domain/BlogBook'
import { v4 as uuid } from 'uuid'

describe('PostgresBlogArticleRepository', () => {
  let connection: DatabaseConnection
  let repository: PostgresBlogArticleRepository

  beforeAll(async () => {
    connection = await TestDatabase.getArticlesConnection()
    repository = new PostgresBlogArticleRepository(connection)
  })

  beforeEach(async () => {
    await TestDatabase.cleanAll()
  })

  afterAll(async () => {
    await TestDatabase.closeAll()
  })

  const createTestBook = async (): Promise<BlogBook> => {
    const book = new BlogBook(
      uuid(),
      'Clean Code',
      'Robert C. Martin',
      '9780132350884',
      'A book about writing clean code',
      'https://example.com/clean-code',
      new Date('2024-01-01'),
      new Date('2024-01-02'),
    )

    await connection.execute(
      `INSERT INTO books (id, title, author, isbn, description, purchase_link, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        book.id,
        book.title,
        book.author,
        book.isbn,
        book.description,
        book.purchaseLink,
        book.createdAt,
        book.updatedAt,
      ],
    )

    return book
  }

  const createTestArticle = async (book?: BlogBook): Promise<BlogArticle> => {
    const article = new BlogArticle(
      uuid(),
      'Test Article',
      'Test Excerpt',
      'Test Content',
      book ? [book] : [],
      [{ url: 'https://test.com', text: 'Test Link' }],
      `test-slug-${uuid()}`,
      new Date(),
      new Date(),
    )

    await connection.execute(
      `INSERT INTO articles (id, title, excerpt, content, book_ids, related_links, slug, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        article.id,
        article.title,
        article.excerpt,
        article.content,
        book ? [book.id] : [],
        JSON.stringify(article.relatedLinks),
        article.slug,
        article.createdAt,
        article.updatedAt,
      ],
    )

    return article
  }

  describe('findAll', () => {
    it('should return empty array when no articles exist', async () => {
      const articles = await repository.findAll()
      expect(articles).toHaveLength(0)
    })

    it('should return articles with their books', async () => {
      const book = await createTestBook()
      const article = await createTestArticle(book)

      const articles = await repository.findAll()

      expect(articles).toHaveLength(1)
      expect(articles[0].id).toBe(article.id)
      expect(articles[0].books).toHaveLength(1)
      expect(articles[0].books[0].title).toBe(book.title)
    })

    it('should return articles without books', async () => {
      await createTestArticle()
      const articles = await repository.findAll()
      expect(articles).toHaveLength(1)
      expect(articles[0].books).toHaveLength(0)
    })

    it('should return articles ordered by creation date desc', async () => {
      const olderDate = new Date('2024-01-01')
      const newerDate = new Date('2024-01-02')

      const article1 = await createTestArticle()
      const article2 = await createTestArticle()

      await connection.execute(
        'UPDATE articles SET created_at = $1 WHERE id = $2',
        [olderDate, article1.id],
      )

      await connection.execute(
        'UPDATE articles SET created_at = $1 WHERE id = $2',
        [newerDate, article2.id],
      )

      const articles = await repository.findAll()
      expect(articles).toHaveLength(2)
      expect(articles[0].id).toBe(article2.id)
      expect(articles[1].id).toBe(article1.id)
    })
  })

  describe('findBySlug', () => {
    it('should return null for non-existent slug', async () => {
      const article = await repository.findBySlug('non-existent')
      expect(article).toBeNull()
    })

    it('should find article by slug with its books', async () => {
      const book = await createTestBook()
      const createdArticle = await createTestArticle(book)

      const article = await repository.findBySlug(createdArticle.slug)
      expect(article).not.toBeNull()
      expect(article!.id).toBe(createdArticle.id)
      expect(article!.books).toHaveLength(1)
      expect(article!.books[0].title).toBe(book.title)
    })

    it('should find article without books', async () => {
      const createdArticle = await createTestArticle()
      const article = await repository.findBySlug(createdArticle.slug)
      expect(article).not.toBeNull()
      expect(article!.id).toBe(createdArticle.id)
      expect(article!.books).toHaveLength(0)
    })

    it('should return all article fields correctly', async () => {
      const book = await createTestBook()
      const createdArticle = await createTestArticle(book)

      const article = await repository.findBySlug(createdArticle.slug)
      expect(article).not.toBeNull()
      expect(article!.id).toBe(createdArticle.id)
      expect(article!.title).toBe(createdArticle.title)
      expect(article!.excerpt).toBe(createdArticle.excerpt)
      expect(article!.content).toBe(createdArticle.content)
      expect(article!.slug).toBe(createdArticle.slug)
      expect(article!.relatedLinks).toEqual(createdArticle.relatedLinks)
      expect(article!.books).toHaveLength(1)
      expect(article!.books[0].id).toBe(book.id)
    })
  })
})
