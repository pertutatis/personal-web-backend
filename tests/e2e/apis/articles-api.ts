import { APIRequestContext } from '@playwright/test';
import { ArticleResponse, PaginatedResponse } from '../fixtures/api-types';
import { CreateArticleRequest, TestArticle } from '../fixtures/test-data';

export class ArticlesApi {
  constructor(private request: APIRequestContext) {}

  async createArticle(article: CreateArticleRequest) {
    const response = await this.request.post('/api/blog/articles', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      data: article
    });
    
    if (!response.ok()) {
      console.error('Error creating article:', await response.text());
    }
    
    return response;
  }

  private getIdValue(id: string | object): string {
    if (typeof id === 'string') return id;
    if (typeof id === 'object' && id !== null) {
      if ('_value' in id) return (id as any)._value;
      if ('id' in id && typeof (id as any).id === 'string') return (id as any).id;
      if ('id' in id && typeof (id as any).id === 'object' && '_value' in (id as any).id) {
        return (id as any).id._value;
      }
    }
    console.error('Invalid ID format:', id);
    throw new Error(`Invalid ID format: ${JSON.stringify(id)}`);
  }

  async getArticle(id: string | object) {
    const articleId = this.getIdValue(id);
    return this.request.get(`/api/blog/articles/${articleId}`);
  }

  async getArticleBySlug(slug: string) {
    return this.request.get(`/api/blog/articles/by-slug/${slug}`);
  }

  async updateArticle(id: string | object, article: Partial<TestArticle>) {
    const articleId = this.getIdValue(id);
    return this.request.put(`/api/blog/articles/${articleId}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      data: article
    });
  }

  async deleteArticle(id: string | object) {
    const articleId = this.getIdValue(id);
    return this.request.delete(`/api/blog/articles/${articleId}`);
  }

  async listArticles({ page, limit }: { page?: number; limit?: number } = {}) {
    const searchParams = new URLSearchParams();
    if (page !== undefined) searchParams.append('page', page.toString());
    if (limit !== undefined) searchParams.append('limit', limit.toString());
    
    const queryString = searchParams.toString();
    const url = `/api/blog/articles${queryString ? `?${queryString}` : ''}`;
    return this.request.get(url);
  }

  // Helper methods para obtener datos tipados
  async getArticleTyped(id: string): Promise<ArticleResponse> {
    const response = await this.getArticle(id);
    return response.json();
  }

  async getArticleBySlugTyped(slug: string): Promise<ArticleResponse> {
    const response = await this.getArticleBySlug(slug);
    return response.json();
  }

  async listArticlesTyped(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ArticleResponse>> {
    const response = await this.listArticles(params);
    return response.json();
  }
}
