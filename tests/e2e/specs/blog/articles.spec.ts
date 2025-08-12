import { test, expect } from '@playwright/test'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { ArticleHelper, TestArticle } from '../../helpers/article.helper'
import { BookHelper, TestBook } from '../../helpers/book.helper'
import { SeriesHelper } from '../../helpers/series.helper'

test.describe('Blog Articles API', () => {
  let validBook: TestBook
  let validArticle: TestArticle

  test.beforeEach(async ({ request }) => {
    validBook = BookHelper.generateRandomTestBook({
      id: '76318adb-7551-48b9-97bb-97ac3f8ef354',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      description: 'A book about writing clean code',
      purchaseLink: 'https://example.com/clean-code',
    })

    validArticle = ArticleHelper.generateRandomTestArticle({
      bookIds: ['76318adb-7551-48b9-97bb-97ac3f8ef354'],
      slug: 'writing-clean-code',
      title: 'Writing Clean Code',
    })
  })

  test.describe('GET /api/blog/articles', () => {
    test('should return empty array when no articles exist', async ({
      request,
    }) => {
      const response = await request.get('/api/blog/articles', {
        headers: { Origin: 'https://diegopertusa.com' },
      })

      expect(response.ok()).toBeTruthy()
      expect(response.headers()['access-control-allow-origin']).toBe(
        'https://diegopertusa.com',
      )

      const articles = await response.json()
      expect(articles).toEqual([])
    })

    test('should return articles with their books', async ({ request }) => {
      await BookHelper.createBook(request, validBook)
      await ArticleHelper.createArticle(request, validArticle)
      await ArticleHelper.publishArticle(request, validArticle.id)

      const response = await request.get('/api/blog/articles', {
        headers: { Origin: 'https://diegopertusa.com' },
      })

      expect(response.ok()).toBeTruthy()
      const articles = await response.json()

      expect(articles).toHaveLength(1)
      expect(articles[0].title).toBe('Writing Clean Code')
      expect(articles[0].books).toHaveLength(1)
      expect(articles[0].books[0].title).toBe('Clean Code')
    })

    test('should reject requests from non-allowed origins', async ({
      request,
    }) => {
      const response = await request.get('/api/blog/articles', {
        headers: { Origin: 'https://malicious-site.com' },
      })

      expect(response.status()).toBe(403)
    })
  })

  test.describe('GET /api/blog/articles/by-slug/[slug]', () => {
    test('should return article by slug', async ({ request }) => {
      await BookHelper.createBook(request, validBook)
      await ArticleHelper.createArticle(request, validArticle)
      await ArticleHelper.publishArticle(request, validArticle.id)

      const response = await request.get(
        '/api/blog/articles/by-slug/writing-clean-code',
        {
          headers: { Origin: 'https://diegopertusa.com' },
        },
      )

      expect(response.ok()).toBeTruthy()
      expect(response.headers()['access-control-allow-origin']).toBe(
        'https://diegopertusa.com',
      )

      const article = await response.json()
      expect(article.slug).toBe('writing-clean-code')
      expect(article.books).toHaveLength(1)
      expect(article.books[0].title).toBe('Clean Code')
    })

    test('should return 404 for non-existent article', async ({ request }) => {
      const response = await request.get(
        '/api/blog/articles/by-slug/non-existent',
        {
          headers: { Origin: 'https://diegopertusa.com' },
        },
      )

      expect(response.status()).toBe(404)
      expect(response.headers()['access-control-allow-origin']).toBe(
        'https://diegopertusa.com',
      )
    })

    test('should reject requests from non-allowed origins', async ({
      request,
    }) => {
      const response = await request.get(
        '/api/blog/articles/by-slug/test-article',
        {
          headers: { Origin: 'https://malicious-site.com' },
        },
      )

      expect(response.status()).toBe(403)
    })

    test('should handle CORS preflight requests', async ({ request }) => {
      const response = await request.fetch(
        '/api/blog/articles/by-slug/test-article',
        {
          method: 'OPTIONS',
          headers: {
            Origin: 'https://diegopertusa.com',
            'Access-Control-Request-Method': 'GET',
          },
        },
      )

      expect(response.status()).toBe(200)
      expect(response.headers()['access-control-allow-origin']).toBe(
        'https://diegopertusa.com',
      )
      expect(response.headers()['access-control-allow-methods']).toBe(
        'GET, POST, PUT, DELETE, OPTIONS',
      )
    })
  })

  test.describe('Integración artículo-serie en endpoint público', () => {
    test('debe exponer la información de la serie asociada en la respuesta', async ({
      request,
    }) => {
      // Crear serie
      const testSeries = SeriesHelper.generateRandomTestSeries()
      const createSeriesResp = await SeriesHelper.createSeries(
        request,
        testSeries,
      )
      expect(createSeriesResp.ok()).toBeTruthy()

      // Crear artículo asociado a la serie
      const testArticle = ArticleHelper.generateRandomTestArticle({
        seriesId: testSeries.id,
        slug: 'article-with-series',
        title: 'Article with series',
      })
      await ArticleHelper.createArticle(request, testArticle)
      await ArticleHelper.publishArticle(request, testArticle.id)

      // Consultar endpoint público
      const response = await request.get('/api/blog/articles', {
        headers: { Origin: 'https://diegopertusa.com' },
      })
      expect(response.ok()).toBeTruthy()
      const articles = await response.json()
      const found = articles.find((a: any) => a.slug === 'article-with-series')
      expect(found).toBeDefined()
      expect(found.serie).toBeDefined()
      expect(found.serie.id).toBe(testSeries.id)
      expect(found.serie.title).toBe(testSeries.title)
      expect(found.serie.description).toBe(testSeries.description)
      expect(found.serie.createdAt).toBeDefined()
      expect(found.serie.updatedAt).toBeDefined()
    })
  })

  test.describe('GET /api/blog/articles/by-slug/[slug] con serie', () => {
    test('debe exponer la información de la serie asociada en la respuesta de detalle', async ({
      request,
    }) => {
      // Crear serie
      const testSeries = SeriesHelper.generateRandomTestSeries()
      const createSeriesResp = await SeriesHelper.createSeries(
        request,
        testSeries,
      )
      expect(createSeriesResp.ok()).toBeTruthy()

      // Crear artículo asociado a la serie
      const testArticle = ArticleHelper.generateRandomTestArticle({
        seriesId: testSeries.id,
        slug: 'article-with-series-detail',
        title: 'Article with series detail',
      })
      await ArticleHelper.createArticle(request, testArticle)
      await ArticleHelper.publishArticle(request, testArticle.id)

      // Consultar endpoint de detalle
      const response = await request.get(
        '/api/blog/articles/by-slug/article-with-series-detail',
        { headers: { Origin: 'https://diegopertusa.com' } },
      )
      expect(response.ok()).toBeTruthy()
      const article = await response.json()
      expect(article.slug).toBe('article-with-series-detail')
      expect(article.serie).toBeDefined()
      expect(article.serie.id).toBe(testSeries.id)
      expect(article.serie.title).toBe(testSeries.title)
      expect(article.serie.description).toBe(testSeries.description)
      expect(article.serie.createdAt).toBeDefined()
      expect(article.serie.updatedAt).toBeDefined()
    })
  })
})
