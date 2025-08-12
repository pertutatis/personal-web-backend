import { test, expect } from '@playwright/test'
import { PostgresConnection } from '@/contexts/shared/infrastructure/persistence/PostgresConnection'
import { ArticleHelper, TestArticle } from '../../helpers/article.helper'
import { BookHelper, TestBook } from '../../helpers/book.helper'

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
})
