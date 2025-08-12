import { test, expect } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'
import { AuthHelper } from './auth.helper'

export interface TestArticle {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  bookIds: string[]
  relatedLinks: Array<{
    text: string
    url: string
  }>
  seriesId?: string // UUID de la serie asociada (opcional)
}

export class ArticleHelper {
  /**
   * Genera un artículo de prueba con ID aleatorio
   */
  static generateRandomTestArticle(
    overrides: Partial<TestArticle> = {},
  ): TestArticle {
    const randomSuffix = Math.random().toString(36).substring(7)
    const title = `Test Article ${randomSuffix}`

    return {
      id: uuidv4(),
      title: title,
      content: 'This is a test article content',
      excerpt: 'This is a test excerpt',
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      bookIds: [],
      relatedLinks: [
        {
          text: 'Related Link',
          url: 'https://example.com/related',
        },
      ],
      ...overrides,
    }
  }

  /**
   * Crea un artículo para pruebas
   */
  static async createArticle(
    request: any,
    article: TestArticle,
  ): Promise<Response> {
    return await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/articles',
      {
        method: 'POST',
        data: article,
      },
    )
  }

  static async publishArticle(
    request: any,
    articleId: string,
  ): Promise<Response> {
    return await AuthHelper.makeAuthenticatedRequest(
      request,
      `/api/backoffice/articles/${articleId}/publish`,
      {
        method: 'POST',
      },
    )
  }

  /**
   * Limpia la base de datos de artículos para pruebas
   */
  static async cleanupArticles(request: any): Promise<void> {
    await AuthHelper.makeAuthenticatedRequest(
      request,
      '/api/backoffice/articles/test-cleanup',
      {
        method: 'POST',
      },
    )
  }
}
