import { APIRequestContext } from '@playwright/test';
import { BookResponse, PaginatedResponse } from '../fixtures/api-types';
import { TestBook } from '../fixtures/test-data';
import { AuthHelper } from '../helpers/auth.helper';

export class BooksApi {
  constructor(private request: APIRequestContext) {}

  private async getAuthHeaders() {
    const token = await AuthHelper.generateToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async createBook(book: TestBook) {
    try {
      console.log('Sending create book request:', book);
      const response = await this.request.post('/api/backoffice/books', {
        headers: await this.getAuthHeaders(),
        data: book,
        timeout: 10000 // Aumentar el timeout a 10 segundos
      });

      if (!response.ok()) {
        const errorText = await response.text();
        console.error('Create book failed:', {
          status: response.status(),
          statusText: response.statusText(),
          body: errorText
        });
      }

      return response;
    } catch (error) {
      console.error('Error in createBook:', error);
      throw error;
    }
  }

  private formatId(id: string | number | object): string {
    console.log('Formatting ID:', id, 'Type:', typeof id);
    if (typeof id === 'string') return id;
    if (typeof id === 'number') return id.toString();
    if (typeof id === 'object' && id !== null) {
      console.log('ID is object:', id);
      return String(id);
    }
    throw new Error(`Invalid ID format: ${id}`);
  }

  async getBook(id: string | number | object) {
    const bookId = this.formatId(id);
    return this.request.get(`/api/backoffice/books/${bookId}`, {
      headers: await this.getAuthHeaders()
    });
  }

  async updateBook(id: string | number | object, book: Partial<TestBook>) {
    const bookId = this.formatId(id);
    return this.request.put(`/api/backoffice/books/${bookId}`, {
      headers: await this.getAuthHeaders(),
      data: book
    });
  }

  async deleteBook(id: string | number | object) {
    const bookId = this.formatId(id);
    return this.request.delete(`/api/backoffice/books/${bookId}`, {
      headers: await this.getAuthHeaders()
    });
  }

  async listBooks({ page, limit }: { page?: number; limit?: number } = {}) {
    const searchParams = new URLSearchParams();
    if (page !== undefined) searchParams.append('page', page.toString());
    if (limit !== undefined) searchParams.append('limit', limit.toString());
    
    const queryString = searchParams.toString();
    const url = `/api/backoffice/books${queryString ? `?${queryString}` : ''}`;
    return this.request.get(url, {
      headers: await this.getAuthHeaders()
    });
  }

  // Helper methods para obtener datos tipados
  async getBookTyped(id: string): Promise<BookResponse> {
    const response = await this.getBook(id);
    return response.json();
  }

  async listBooksTyped(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<BookResponse>> {
    const response = await this.listBooks(params);
    return response.json();
  }
}
