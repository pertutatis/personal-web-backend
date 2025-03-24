import { APIRequestContext, expect } from '@playwright/test';
import { Pool } from 'pg';
import { getBooksConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';
import { ArticlesApi } from '../apis/articles-api';
import { BooksApi } from '../apis/books-api';
import { TestArticle, TestBook } from './test-data';
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
      
      const responseData = await response.json();
      expect(responseData.id).toBeDefined();
      return responseData;
    } catch (error) {
      console.error('Error in createTestBook:', error);
      throw error;
    }
  }

  async createTestArticle(article: TestArticle): Promise<ArticleResponse> {
    const response = await this.articlesApi.createArticle(article);
    return this.verifySuccessResponse<ArticleResponse>(response, 201);
  }

  async cleanupTestData() {
    console.log('Starting test data cleanup...');
    
    try {
      // Primero limpiar la base de datos directamente
      await this.cleanDatabaseDirectly();

      // Limpiar artículos a través de la API
      const articlesResponse = await this.articlesApi.listArticles({ limit: 100 });
      if (articlesResponse.ok()) {
        const articles = await articlesResponse.json() as PaginatedResponse<ArticleResponse>;
        console.log(`Found ${articles.items.length} articles to delete`);
        
        // Delete all articles
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
              const errorText = await deleteResponse.text();
              console.error(`Failed to delete article ${id}:`, errorText);
            } else {
              console.log(`Successfully deleted article ${id}`);
            }
          } catch (error) {
            console.error('Error deleting article:', error);
          }
        }
      } else {
        const errorText = await articlesResponse.text();
        console.error('Failed to list articles:', errorText);
      }

      // Luego eliminar los libros
      const booksResponse = await this.booksApi.listBooks({ limit: 100 });
      if (booksResponse.ok()) {
        const books = await booksResponse.json() as PaginatedResponse<BookResponse>;
        console.log(`Found ${books.items.length} books to delete`);
        
        for (const book of books.items) {
          try {
            const deleteResponse = await this.booksApi.deleteBook(book.id.toString());
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
      title: 'Test Book for Article',
      author: 'Test Author',
      isbn: '9780321125217'
    });

    const article = await this.createTestArticle({
      title: 'Test Article with Book',
      excerpt: 'Test article excerpt with book reference',
      content: 'Test content with book reference',
      bookIds: [book.id]
    });

    return { book, article };
  }

  async verifySuccessResponse<T>(response: any, expectedStatus = 200): Promise<T> {
    expect(response.status()).toBe(expectedStatus);
    const body = await response.json();
    expect(body).toBeDefined();
    return body as T;
  }

  async verifyErrorResponse(response: any, expectedStatus = 400): Promise<ErrorResponse> {
    expect(response.status()).toBe(expectedStatus);
    const error = await response.json();
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
