import { test, expect } from '@playwright/test';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { getArticlesConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';

test.describe('Blog Articles API', () => {
  let connection: PostgresConnection;

  test.beforeAll(async () => {
    connection = await PostgresConnection.create(getArticlesConfig());
    await cleanDatabase();
  });

  test.afterAll(async () => {
    await cleanDatabase();
    await connection.close();
  });

  async function cleanDatabase() {
    await connection.execute('DELETE FROM articles');
    await connection.execute('DELETE FROM books');
  }

  async function createTestArticle(slug: string) {
    // Create a test book first
    await connection.execute(`
      INSERT INTO books (id, title, author, isbn, description, created_at, updated_at)
      VALUES (
        '123e4567-e89b-12d3-a456-426614174000',
        'Clean Code',
        'Robert C. Martin',
        '9780132350884',
        'A book about writing clean code',
        NOW(),
        NOW()
      )
    `);

    // Create article with reference to the book
    await connection.execute(`
      INSERT INTO articles (
        id, title, excerpt, content, book_ids, related_links, slug, created_at, updated_at
      ) VALUES (
        '123e4567-e89b-12d3-a456-426614174001',
        'Writing Clean Code',
        'Learn how to write maintainable code',
        'Full article content about clean code',
        ARRAY['123e4567-e89b-12d3-a456-426614174000']::text[],
        '[{"text": "Clean Code Book", "url": "https://example.com/book"}]'::jsonb,
        $1,
        NOW(),
        NOW()
      )
    `, [slug]);
  }

  test.describe('GET /api/blog/articles', () => {
    test('should return empty array when no articles exist', async ({ request }) => {
      const response = await request.get('/api/blog/articles', {
        headers: { 'Origin': 'https://diegopertusa.com' }
      });

      expect(response.ok()).toBeTruthy();
      expect(response.headers()['access-control-allow-origin']).toBe('https://diegopertusa.com');
      
      const articles = await response.json();
      expect(articles).toEqual([]);
    });

    test('should return articles with their books', async ({ request }) => {
      await createTestArticle('test-article');

      const response = await request.get('/api/blog/articles', {
        headers: { 'Origin': 'https://diegopertusa.com' }
      });

      expect(response.ok()).toBeTruthy();
      const articles = await response.json();

      expect(articles).toHaveLength(1);
      expect(articles[0].title).toBe('Writing Clean Code');
      expect(articles[0].books).toHaveLength(1);
      expect(articles[0].books[0].title).toBe('Clean Code');
    });

    test('should reject requests from non-allowed origins', async ({ request }) => {
      const response = await request.get('/api/blog/articles', {
        headers: { 'Origin': 'https://malicious-site.com' }
      });

      expect(response.status()).toBe(403);
    });
  });

  test.describe('GET /api/blog/articles/by-slug/[slug]', () => {
    test('should return article by slug', async ({ request }) => {
      await createTestArticle('test-article');

      const response = await request.get('/api/blog/articles/by-slug/test-article', {
        headers: { 'Origin': 'https://diegopertusa.com' }
      });

      expect(response.ok()).toBeTruthy();
      expect(response.headers()['access-control-allow-origin']).toBe('https://diegopertusa.com');

      const article = await response.json();
      expect(article.slug).toBe('test-article');
      expect(article.books).toHaveLength(1);
      expect(article.books[0].title).toBe('Clean Code');
    });

    test('should return 404 for non-existent article', async ({ request }) => {
      const response = await request.get('/api/blog/articles/by-slug/non-existent', {
        headers: { 'Origin': 'https://diegopertusa.com' }
      });

      expect(response.status()).toBe(404);
      expect(response.headers()['access-control-allow-origin']).toBe('https://diegopertusa.com');
    });

    test('should reject requests from non-allowed origins', async ({ request }) => {
      const response = await request.get('/api/blog/articles/by-slug/test-article', {
        headers: { 'Origin': 'https://malicious-site.com' }
      });

      expect(response.status()).toBe(403);
    });

    test('should handle CORS preflight requests', async ({ request }) => {
      const response = await request.fetch('/api/blog/articles/by-slug/test-article', {
        method: 'OPTIONS',
        headers: { 
          'Origin': 'https://diegopertusa.com',
          'Access-Control-Request-Method': 'GET'
        }
      });

      expect(response.status()).toBe(204);
      expect(response.headers()['access-control-allow-origin']).toBe('https://diegopertusa.com');
      expect(response.headers()['access-control-allow-methods']).toBe('GET, OPTIONS');
    });
  });
});
