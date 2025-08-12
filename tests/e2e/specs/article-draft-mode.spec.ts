import { test, expect } from '@playwright/test'
import { ArticlesApi } from '../apis/articles-api'
import { AuthAPI } from '../apis/auth-api'
import { ApiHelpers } from '../fixtures/api-helpers'
import { AuthHelper } from '../helpers/auth.helper'
import { v4 as uuidv4 } from 'uuid'

test.describe('Article Draft Mode', () => {
  let articlesAPI: ArticlesApi
  let authAPI: AuthAPI
  let helpers: ApiHelpers

  test.beforeEach(async ({ request }) => {
    articlesAPI = new ArticlesApi(request)
    authAPI = new AuthAPI(request)
    // helpers = new ApiHelpers(request) // Note: May need specific constructor args
  })

  test.describe('Creating Articles with Status', () => {
    test('should create article as DRAFT by default', async ({ request }) => {
      const articleData = {
        id: uuidv4(),
        title: 'Draft Article by Default',
        excerpt: 'This article should be draft by default',
        content: 'Content for draft article',
        bookIds: [],
        relatedLinks: [],
        slug: 'draft-article-by-default',
      }

      const response = await articlesAPI.createArticle(articleData)
      expect(response.status()).toBe(201)

      // Verify article was created as DRAFT
      const getResponse = await articlesAPI.getArticle(articleData.id)
      expect(getResponse.status()).toBe(200)
      const articleBody = await getResponse.json()
      expect(articleBody.status).toBe('DRAFT')
    })

    test('should create article with explicit DRAFT status', async ({
      request,
    }) => {
      const articleData = {
        id: uuidv4(),
        title: 'Explicit Draft Article',
        excerpt: 'This article is explicitly set as draft',
        content: 'Content for explicit draft article',
        bookIds: [],
        relatedLinks: [],
        slug: 'explicit-draft-article',
        status: 'DRAFT',
      } as any

      const response = await articlesAPI.createArticle(articleData)
      expect(response.status()).toBe(201)

      // Verify article status
      const getResponse = await articlesAPI.getArticle(articleData.id)
      expect(getResponse.status()).toBe(200)
      const articleBody = await getResponse.json()
      expect(articleBody.status).toBe('DRAFT')
    })

    test('should create article with PUBLISHED status', async ({ request }) => {
      const articleData = {
        id: uuidv4(),
        title: 'Published Article',
        excerpt: 'This article is created as published',
        content: 'Content for published article',
        bookIds: [],
        relatedLinks: [],
        slug: 'published-article',
        status: 'PUBLISHED',
      } as any

      const response = await articlesAPI.createArticle(articleData)
      expect(response.status()).toBe(201)

      // Verify article status
      const getResponse = await articlesAPI.getArticle(articleData.id)
      expect(getResponse.status()).toBe(200)
      const articleBody = await getResponse.json()
      expect(articleBody.status).toBe('PUBLISHED')
    })

    test('should reject invalid status values', async ({ request }) => {
      const articleData = {
        id: uuidv4(),
        title: 'Invalid Status Article',
        excerpt: 'This article has invalid status',
        content: 'Content for invalid status article',
        bookIds: [],
        relatedLinks: [],
        slug: 'invalid-status-article',
        status: 'INVALID_STATUS',
      } as any

      const response = await articlesAPI.createArticle(articleData)
      expect(response.status()).toBe(400)
      const errorBody = await response.json()
      expect(errorBody.message).toContain(
        'status must be either "DRAFT" or "PUBLISHED"',
      )
    })
  })

  test.describe('Publishing Articles', () => {
    test('should publish a DRAFT article via publish endpoint', async ({
      request,
    }) => {
      // Create a draft article
      const articleData = {
        id: uuidv4(),
        title: 'Article to Publish',
        excerpt: 'This article will be published',
        content: 'Content for article to publish',
        bookIds: [],
        relatedLinks: [],
        slug: 'article-to-publish',
        status: 'DRAFT',
      } as any

      await articlesAPI.createArticle(articleData)

      // Publish the article
      const publishResponse = await articlesAPI.publishArticle(articleData.id)
      expect(publishResponse.status()).toBe(200)
      const publishBody = await publishResponse.json()
      expect(publishBody.message).toBe('Article published successfully')

      // Verify article is now published
      const getResponse = await articlesAPI.getArticle(articleData.id)
      expect(getResponse.status()).toBe(200)
      const articleBody = await getResponse.json()
      expect(articleBody.status).toBe('PUBLISHED')
    })

    test('should handle publishing already published article', async ({
      request,
    }) => {
      // Create a published article
      const articleData = {
        id: uuidv4(),
        title: 'Already Published Article',
        excerpt: 'This article is already published',
        content: 'Content for already published article',
        bookIds: [],
        relatedLinks: [],
        slug: 'already-published-article',
        status: 'PUBLISHED',
      } as any

      await articlesAPI.createArticle(articleData)

      // Try to publish again - should succeed without error
      const publishResponse = await articlesAPI.publishArticle(articleData.id)
      expect(publishResponse.status()).toBe(200)

      // Verify article is still published
      const getResponse = await articlesAPI.getArticle(articleData.id)
      expect(getResponse.status()).toBe(200)
      const articleBody = await getResponse.json()
      expect(articleBody.status).toBe('PUBLISHED')
    })

    test('should reject publishing non-existent article', async ({
      request,
    }) => {
      const nonExistentId = uuidv4()
      const publishResponse = await articlesAPI.publishArticle(nonExistentId)
      expect(publishResponse.status()).toBe(404)
    })
  })

  test.describe('Updating Article Status', () => {
    test('should update DRAFT article to PUBLISHED via PUT', async ({
      request,
    }) => {
      // Create a draft article
      const articleData = {
        id: uuidv4(),
        title: 'Draft to Publish via PUT',
        excerpt: 'This article will be published via PUT',
        content: 'Content for draft to publish',
        bookIds: [],
        relatedLinks: [],
        status: 'DRAFT',
      }

      await articlesAPI.createArticle(articleData)

      // Update status to PUBLISHED
      const updateResponse = await articlesAPI.updateArticle(articleData.id, {
        status: 'PUBLISHED',
      })
      expect(updateResponse.status()).toBe(204)

      // Verify article is now published
      const getResponse = await articlesAPI.getArticle(articleData.id)
      expect(getResponse.status()).toBe(200)
      const articleBody = await getResponse.json()
      expect(articleBody.status).toBe('PUBLISHED')
    })

    test('should prevent PUBLISHED article from reverting to DRAFT', async ({
      request,
    }) => {
      // Create a published article
      const articleData = {
        id: uuidv4(),
        title: 'Published Article',
        excerpt: 'This article is published',
        content: 'Content for published article',
        bookIds: [],
        relatedLinks: [],
        status: 'PUBLISHED',
      }

      await articlesAPI.createArticle(articleData)

      // Try to revert to DRAFT - should fail
      const updateResponse = await articlesAPI.updateArticle(articleData.id, {
        status: 'DRAFT',
      })
      expect(updateResponse.status()).toBe(400)
      const errorBody = await updateResponse.json()
      expect(errorBody.message).toContain('Invalid article status')
    })

    test('should allow other field updates without affecting status', async ({
      request,
    }) => {
      // Create a draft article
      const articleData = {
        id: uuidv4(),
        title: 'Original Title',
        excerpt: 'Original excerpt',
        content: 'Original content',
        bookIds: [],
        relatedLinks: [],
        status: 'DRAFT',
      }

      await articlesAPI.createArticle(articleData)

      // Update title without changing status
      const updateResponse = await articlesAPI.updateArticle(articleData.id, {
        title: 'Updated Title',
      })
      expect(updateResponse.status()).toBe(204)

      // Verify title updated but status unchanged
      const getResponse = await articlesAPI.getArticle(articleData.id)
      expect(getResponse.status()).toBe(200)
      const articleBody = await getResponse.json()
      expect(articleBody.title).toBe('Updated Title')
      expect(articleBody.status).toBe('DRAFT')
    })
  })

  test.describe('Blog Endpoint Filtering', () => {
    test('should only return PUBLISHED articles in blog endpoints', async ({
      request,
    }) => {
      // Create both draft and published articles
      const draftArticle = {
        id: uuidv4(),
        title: 'Draft Article for Blog Test',
        excerpt: 'This draft should not appear in blog',
        content: 'Draft content',
        bookIds: [],
        relatedLinks: [],
        slug: 'draft-article-for-blog-test',
        status: 'DRAFT',
      }

      const publishedArticle = {
        id: uuidv4(),
        title: 'Published Article for Blog Test',
        excerpt: 'This published article should appear in blog',
        content: 'Published content',
        bookIds: [],
        relatedLinks: [],
        slug: 'published-article-for-blog-test',
        status: 'PUBLISHED',
      }

      // Create both articles
      await articlesAPI.createArticle(draftArticle)
      await articlesAPI.createArticle(publishedArticle)

      // Check blog articles list endpoint (public)
      const blogListResponse = await request.get('/api/blog/articles')
      expect(blogListResponse.status()).toBe(200)

      const blogData = await blogListResponse.json()
      const articleTitles = blogData.map((article: any) => article.title)

      // Should contain published article but not draft
      expect(articleTitles).toContain('Published Article for Blog Test')
      expect(articleTitles).not.toContain('Draft Article for Blog Test')

      // Check blog article by slug endpoint (public)
      const blogSlugResponse = await request.get(
        `/api/blog/articles/by-slug/${publishedArticle.slug}`,
      )
      expect(blogSlugResponse.status()).toBe(200)

      const draftSlugResponse = await request.get(
        `/api/blog/articles/by-slug/${draftArticle.slug}`,
      )
      expect(draftSlugResponse.status()).toBe(404)
    })
  })

  test.describe('Status Validation', () => {
    test('should reject invalid status in update request', async ({
      request,
    }) => {
      // Create a draft article
      const articleData = {
        id: uuidv4(),
        title: 'Article for Status Validation',
        excerpt: 'Testing status validation',
        content: 'Content for status validation',
        bookIds: [],
        relatedLinks: [],
        status: 'DRAFT',
      }

      await articlesAPI.createArticle(articleData)

      // Try to update with invalid status
      const updateResponse = await articlesAPI.updateArticle(articleData.id, {
        status: 'INVALID_STATUS',
      })
      expect(updateResponse.status()).toBe(400)
      const errorBody = await updateResponse.json()
      expect(errorBody.message).toContain(
        'status must be either "DRAFT" or "PUBLISHED"',
      )
    })

    test('should handle empty status in update request', async ({
      request,
    }) => {
      // Create a draft article
      const articleData = {
        id: uuidv4(),
        title: 'Article for Empty Status Test',
        excerpt: 'Testing empty status',
        content: 'Content for empty status test',
        bookIds: [],
        relatedLinks: [],
        status: 'DRAFT',
      }

      await articlesAPI.createArticle(articleData)

      // Update with empty status should be rejected
      const updateResponse = await articlesAPI.updateArticle(articleData.id, {
        status: '',
      })
      expect(updateResponse.status()).toBe(400)
    })
  })

  test.describe('Backoffice vs Blog Context', () => {
    test('should show both DRAFT and PUBLISHED articles in backoffice', async ({
      request,
    }) => {
      // Create both types of articles
      const draftArticle = {
        id: uuidv4(),
        title: 'Backoffice Draft Article',
        excerpt: 'Draft in backoffice',
        content: 'Draft content',
        bookIds: [],
        relatedLinks: [],
        status: 'DRAFT',
      }

      const publishedArticle = {
        id: uuidv4(),
        title: 'Backoffice Published Article',
        excerpt: 'Published in backoffice',
        content: 'Published content',
        bookIds: [],
        relatedLinks: [],
        status: 'PUBLISHED',
      }

      await articlesAPI.createArticle(draftArticle)
      await articlesAPI.createArticle(publishedArticle)

      // Check backoffice list - should show both
      const backofficeResponse = await articlesAPI.listArticles()
      expect(backofficeResponse.status()).toBe(200)

      const backofficeData = await backofficeResponse.json()
      const articleTitles = backofficeData.items.map(
        (article: any) => article.title,
      )
      expect(articleTitles).toContain('Backoffice Draft Article')
      expect(articleTitles).toContain('Backoffice Published Article')

      // Should be able to get both by ID
      const getDraftResponse = await articlesAPI.getArticle(draftArticle.id)
      expect(getDraftResponse.status()).toBe(200)
      const draftBody = await getDraftResponse.json()
      expect(draftBody.status).toBe('DRAFT')

      const getPublishedResponse = await articlesAPI.getArticle(
        publishedArticle.id,
      )
      expect(getPublishedResponse.status()).toBe(200)
      const publishedBody = await getPublishedResponse.json()
      expect(publishedBody.status).toBe('PUBLISHED')
    })
  })
})
