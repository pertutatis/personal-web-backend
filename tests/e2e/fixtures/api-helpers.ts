import { APIRequestContext, expect } from '@playwright/test'
import { Pool } from 'pg'
import { ArticlesApi } from '../apis/articles-api'
import { BooksApi } from '../apis/books-api'
import { TestArticle, TestBook, CreateArticleRequest } from './test-data'
import { ArticleResponse, BookResponse, ErrorResponse, PaginatedResponse } from './api-types'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../setup/config'

export class ApiHelpers {
  private articlesPool: Pool
  private booksPool: Pool

  constructor(
    private request: APIRequestContext,
    private booksApi: BooksApi,
    private articlesApi: ArticlesApi
  ) {
    // Create connection pools for both databases
    this.articlesPool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.databases.articles
    })

    this.booksPool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.databases.books
    })
  }

  private async cleanDatabasesDirectly() {
    try {
      console.log('Cleaning database directly with SQL...')
      await Promise.all([
        this.booksPool.query('TRUNCATE books CASCADE'),
        this.articlesPool.query('TRUNCATE articles CASCADE')
      ])
      console.log('Database cleaned successfully')
    } catch (error) {
      console.error('Error cleaning database:', error)
      throw error
    }
  }

  static create(request: APIRequestContext): ApiHelpers {
    const booksApi = new BooksApi(request)
    const articlesApi = new ArticlesApi(request)
    return new ApiHelpers(request, booksApi, articlesApi)
  }

  async createTestBook(book: TestBook): Promise<BookResponse> {
    try {
      const response = await this.booksApi.createBook(book)
      expect(response.status()).toBe(201)
      expect(await response.text()).toBe('')

      // Get the created book since create returns no content
      const getResponse = await this.booksApi.getBook(book.id)
      expect(getResponse.ok()).toBe(true)
      return await getResponse.json()
    } catch (error) {
      console.error('Error in createTestBook:', error)
      throw error
    }
  }

  async createTestArticle(article: Partial<Omit<TestArticle, 'id'>>): Promise<ArticleResponse> {
    const articleId = uuidv4()
    const slug = article.title
      ? article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : `test-article-${articleId}`

    const articleWithId: CreateArticleRequest = {
      id: articleId,
      title: article.title || 'Test Article',
      excerpt: article.excerpt || 'Test excerpt',
      content: article.content || 'Test content',
      bookIds: article.bookIds || [],
      relatedLinks: article.relatedLinks || [],
      slug
    }

    const response = await this.articlesApi.createArticle(articleWithId)
    expect(response.status()).toBe(201)
    expect(await response.text()).toBe('')

    // Get the created article since create returns no content
    const getResponse = await this.articlesApi.getArticle(articleId)
    expect(getResponse.ok()).toBe(true)
    return await getResponse.json()
  }

  async cleanupTestData() {
    console.log('Starting test data cleanup...')
    try {
      await this.cleanDatabasesDirectly()

      const articlesResponse = await this.articlesApi.listArticles({ limit: 100 })
      if (articlesResponse.ok()) {
        const response = await articlesResponse.json();
        const articles = response?.data || [];
        console.log(`Found ${articles.length} articles to delete`)
        
        for (const article of articles) {
          try {
            const id = typeof article.id === 'object' && article.id !== null && 'value' in article.id
              ? (article.id as any).value
              : article.id

            if (!id || typeof id !== 'string') {
              console.error('Invalid article ID format:', article)
              continue
            }

            console.log(`Attempting to delete article ${id}`)
            const deleteResponse = await this.articlesApi.deleteArticle(id)
            if (!deleteResponse.ok()) {
              console.error(`Failed to delete article ${id}:`, await deleteResponse.text())
            }
          } catch (error) {
            console.error('Error deleting article:', error)
          }
        }
      } else {
        console.error('Failed to list articles:', await articlesResponse.text())
      }

      const booksResponse = await this.booksApi.listBooks({ limit: 100 })
      if (booksResponse.ok()) {
        const response = await booksResponse.json();
        const books = response?.data || [];
        console.log(`Found ${books.length} books to delete`)
        
        for (const book of books) {
          try {
            const deleteResponse = await this.booksApi.deleteBook(book.id)
            if (!deleteResponse.ok()) {
              console.error(`Failed to delete book ${book.id}:`, await deleteResponse.text())
            }
          } catch (error) {
            console.error(`Error deleting book ${book.id}:`, error)
          }
        }
      } else {
        console.error('Failed to list books:', await booksResponse.text())
      }
      
      console.log('Test data cleanup completed')
    } catch (error) {
      console.error('Critical error during cleanup:', error)
      throw error
    }
  }

  async createTestBookWithArticle(): Promise<{ book: BookResponse; article: ArticleResponse }> {
    const book = await this.createTestBook({
      id: uuidv4(),
      title: 'Test Book for Article',
      author: 'Test Author',
      isbn: '9780321125217',
      description: 'A test book for article reference',
      purchaseLink: 'https://example.com/test-book'
    })

    const article = await this.createTestArticle({
      title: 'Test Article with Book',
      excerpt: 'Test article excerpt with book reference',
      content: 'Test content with book reference',
      bookIds: [book.id],
      relatedLinks: [
        {
          text: 'Related Test Link',
          url: 'https://example.com/test-related'
        }
      ]
    })

    return { book, article }
  }

  async verifySuccessResponse<T>(response: any, expectedStatus = 200): Promise<T> {
    expect(response.status()).toBe(expectedStatus)
    
    // For 204 and 201 responses, verify empty body
    if (expectedStatus === 204 || expectedStatus === 201) {
      const body = await response.text()
      expect(body).toBe('')
      return null as T
    }

    // For other successful responses, expect and parse JSON body
    const body = await response.json()
    expect(body).toBeDefined()
    return body as T
  }

  async verifyErrorResponse(response: any, expectedStatus = 400): Promise<ErrorResponse> {
    expect(response.status()).toBe(expectedStatus)
    const error = await response.json()
    expect(error).toHaveProperty('type')
    expect(error).toHaveProperty('message')
    return error
  }

  async dispose() {
    try {
      await Promise.all([
        this.articlesPool.end(),
        this.booksPool.end()
      ])
      console.log('Database pools closed successfully')
    } catch (error) {
      console.error('Error closing database pools:', error)
    }
  }
}
