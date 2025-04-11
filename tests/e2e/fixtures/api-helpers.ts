import { APIRequestContext, expect } from '@playwright/test';
import { Pool } from 'pg';
import { getBooksConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';
import { ArticlesApi } from '../apis/articles-api';
import { BooksApi } from '../apis/books-api';
import { TestArticle, TestBook, CreateArticleRequest, generateValidUuid } from './test-data';
import { ArticleResponse, BookResponse, ErrorResponse, PaginatedResponse } from './api-types';

export class ApiHelpers {
  private pool: Pool;

  constructor(
    private request: APIRequestContext,
    private booksApi: BooksApi,
    private articlesApi: ArticlesApi
  ) {
    this.pool = new Pool(getBooksConfig());
  }

  private async cleanDatabaseDirectly() {
    try {
      console.log('Cleaning database directly with SQL...');
      await this.pool.query('TRUNCATE books CASCADE');
      console.log('Database cleaned successfully');
    } catch (error) {
      console.error('Error cleaning database:', error);
      throw error;
    }
  }

  static create(request: APIRequestContext): ApiHelpers {
    const booksApi = new BooksApi(request);
    const articlesApi = new ArticlesApi(request);
    return new ApiHelpers(request, booksApi, articlesApi);
  }

  async createTestBook(book: TestBook): Promise<BookResponse> {
    try {
      const response = await this.booksApi.createBook(book);
      const status = response.status();
      
      if (status !== 201) {
        const errorBody = await response.text();
        console.error('Create book failed:', {
          status,
          body: errorBody,
          requestData: book
        });
        throw new Error(`Failed to create book. Status: ${status}, Body: ${errorBody}`);
      }

      // Get the created book since create returns no content
      const getResponse = await this.booksApi.getBook(book.id);
      if (!getResponse.ok()) {
        throw new Error(`Failed to get created book with id ${book.id}`);
      }
      return await getResponse.json();
    } catch (error) {
      console.error('Error in createTestBook:', error);
      throw error;
    }
  }

  async createTestArticle(article: Omit<TestArticle, 'id'>): Promise<ArticleResponse> {
    const articleWithId: CreateArticleRequest = {
      ...article,
      id: generateValidUuid(Math.floor(Math.random() * 1000))
    };
    const response = await this.articlesApi.createArticle(articleWithId);
    return this.verifySuccessResponse<ArticleResponse>(response, 201);
  }

  async cleanupTestData() {
    console.log('Starting test data cleanup...');
    try {
      await this.cleanDatabaseDirectly();

      const articlesResponse = await this.articlesApi.listArticles({ limit: 100 });
      if (articlesResponse.ok()) {
        const articles = await articlesResponse.json() as PaginatedResponse<ArticleResponse>;
        console.log(`Found ${articles.items.length} articles to delete`);
        
        for (const article of articles.items) {
          try {
            const id = typeof article.id === 'object' && article.id !== null && 'value' in article.id
              ? (article.id as any).value
              : article.id;

            if (!id || typeof id !== 'string') {
              console.error('Invalid article ID format:', article);
              continue;
            }

            console.log(`Attempting to delete article ${id}`);
            const deleteResponse = await this.articlesApi.deleteArticle(id);

            if (!deleteResponse.ok()) {
              console.error(`Failed to delete article ${id}:`, await deleteResponse.text());
            }
          } catch (error) {
            console.error('Error deleting article:', error);
          }
        }
      } else {
        console.error('Failed to list articles:', await articlesResponse.text());
      }

      const booksResponse = await this.booksApi.listBooks({ limit: 100 });
      if (booksResponse.ok()) {
        const books = await booksResponse.json() as PaginatedResponse<BookResponse>;
        console.log(`Found ${books.items.length} books to delete`);
        
        for (const book of books.items) {
          try {
            const deleteResponse = await this.booksApi.deleteBook(book.id);
            if (!deleteResponse.ok()) {
              console.error(`Failed to delete book ${book.id}:`, await deleteResponse.text());
            }
          } catch (error) {
            console.error(`Error deleting book ${book.id}:`, error);
          }
        }
      } else {
        console.error('Failed to list books:', await booksResponse.text());
      }
      
      console.log('Test data cleanup completed');
    } catch (error) {
      console.error('Critical error during cleanup:', error);
      throw error;
    }
  }

  async createTestBookWithArticle(): Promise<{ book: BookResponse; article: ArticleResponse }> {
    const book = await this.createTestBook({
      id: generateValidUuid(0),
      title: 'Test Book for Article',
      author: 'Test Author',
      isbn: '9780321125217',
      description: 'A test book for article reference',
      purchaseLink: 'https://example.com/test-book'
    });

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
    });

    return { book, article };
  }

  async verifySuccessResponse<T>(response: any, expectedStatus = 200): Promise<T> {
    expect(response.status()).toBe(expectedStatus);
    
    // For 204 responses, return null
    if (expectedStatus === 204) {
      return null as T;
    }

    // For 201 responses check if there's a body
    if (expectedStatus === 201) {
      const hasBody = await response.body().then(() => true).catch(() => false);
      if (!hasBody) {
        return null as T;
      }
    }

    const body = await response.json();
    expect(body).toBeDefined();
    return body as T;
  }

  async verifyErrorResponse(response: any, expectedStatus = 400): Promise<ErrorResponse> {
    expect(response.status()).toBe(expectedStatus);
    const error = await response.json();
    expect(error).toHaveProperty('type');
    expect(error).toHaveProperty('message');
    return error;
  }

  async dispose() {
    try {
      await this.pool.end();
      console.log('Database pool closed successfully');
    } catch (error) {
      console.error('Error closing database pool:', error);
    }
  }
}
