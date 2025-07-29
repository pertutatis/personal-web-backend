import { Article } from '../Article'
import { ArticleMother } from './mothers/ArticleMother'
import { ArticleRelatedLinksMother } from './mothers/ArticleRelatedLinksMother'
import { ArticleId } from '../ArticleId'
import { ArticleSlug } from '../ArticleSlug'
import { ArticleTitle } from '../ArticleTitle'
import { ArticleExcerpt } from '../ArticleExcerpt'
import { ArticleContent } from '../ArticleContent'
import { ArticleBookIds } from '../ArticleBookIds'
import { ArticleStatus } from '../ArticleStatus'
import { ArticleStatusMother } from './mothers/ArticleStatusMother'
import { ArticleStatusInvalid } from '../ArticleStatusInvalid'

describe('Article', () => {
  const id = new ArticleId('cc8d8194-e099-4e3a-a431-6b4412dc5f6a')
  const slug = new ArticleSlug('test-article')
  const title = new ArticleTitle('Test Article')
  const excerpt = new ArticleExcerpt('Test excerpt')
  const content = new ArticleContent('Test content')
  const createdAt = new Date()
  const updatedAt = new Date()

  it('should create article with all required fields', () => {
    const emptyBookIds = ArticleBookIds.createEmpty()
    const article = Article.create({
      id,
      slug,
      title,
      excerpt,
      content,
      bookIds: emptyBookIds,
      relatedLinks: ArticleRelatedLinksMother.createEmpty(),
      createdAt,
      updatedAt,
    })

    expect(article.id.equals(id)).toBe(true)
    expect(article.slug.value).toBe(slug.value)
    expect(article.title.value).toBe(title.value)
    expect(article.excerpt.value).toBe(excerpt.value)
    expect(article.content.value).toBe(content.value)
    expect(article.relatedLinks.isEmpty).toBe(true)
    expect(article.bookIds.isEmpty).toBe(true)
  })

  it('should create with empty book ids', () => {
    const emptyBookIds = ArticleBookIds.createEmpty()
    const article = Article.create({
      id,
      slug,
      title,
      excerpt,
      content,
      bookIds: emptyBookIds,
      relatedLinks: ArticleRelatedLinksMother.createEmpty(),
      createdAt,
      updatedAt,
    })

    expect(article.bookIds.isEmpty).toBe(true)
  })

  it('should create with book ids', () => {
    const bookIds = ArticleBookIds.create(['book-1', 'book-2'])
    const article = Article.create({
      id,
      slug,
      title,
      excerpt,
      content,
      bookIds,
      relatedLinks: ArticleRelatedLinksMother.createEmpty(),
      createdAt,
      updatedAt,
    })

    expect(article.bookIds.getValue()).toEqual(['book-1', 'book-2'])
  })

  it('should handle related links', () => {
    const emptyBookIds = ArticleBookIds.createEmpty()
    const article = Article.create({
      id,
      slug,
      title,
      excerpt,
      content,
      bookIds: emptyBookIds,
      relatedLinks: ArticleRelatedLinksMother.createMax(),
      createdAt,
      updatedAt,
    })

    expect(article.relatedLinks.length).toBe(10)
  })

  it('should allow empty related links', () => {
    const emptyBookIds = ArticleBookIds.createEmpty()
    const article = Article.create({
      id,
      slug,
      title,
      excerpt,
      content,
      bookIds: emptyBookIds,
      relatedLinks: ArticleRelatedLinksMother.createEmpty(),
      createdAt,
      updatedAt,
    })

    expect(article.relatedLinks.isEmpty).toBe(true)
  })

  it('should update fields', () => {
    const article = ArticleMother.create()
    const newTitle = new ArticleTitle('New Title')

    const updatedArticle = article.update({
      title: newTitle,
    })

    expect(updatedArticle.title.equals(newTitle)).toBe(true)
    expect(updatedArticle.id.equals(article.id)).toBe(true)
  })

  describe('Article Status', () => {
    it('should create article with default DRAFT status', () => {
      const emptyBookIds = ArticleBookIds.createEmpty()
      const article = Article.create({
        id,
        slug,
        title,
        excerpt,
        content,
        bookIds: emptyBookIds,
        relatedLinks: ArticleRelatedLinksMother.createEmpty(),
        createdAt,
        updatedAt,
      })

      expect(article.status.isDraft()).toBe(true)
      expect(article.status.value).toBe('DRAFT')
    })

    it('should create article with explicit DRAFT status', () => {
      const emptyBookIds = ArticleBookIds.createEmpty()
      const draftStatus = ArticleStatusMother.draft()
      const article = Article.create({
        id,
        slug,
        title,
        excerpt,
        content,
        bookIds: emptyBookIds,
        relatedLinks: ArticleRelatedLinksMother.createEmpty(),
        status: draftStatus,
        createdAt,
        updatedAt,
      })

      expect(article.status.isDraft()).toBe(true)
      expect(article.status.value).toBe('DRAFT')
    })

    it('should create article with PUBLISHED status', () => {
      const emptyBookIds = ArticleBookIds.createEmpty()
      const publishedStatus = ArticleStatusMother.published()
      const article = Article.create({
        id,
        slug,
        title,
        excerpt,
        content,
        bookIds: emptyBookIds,
        relatedLinks: ArticleRelatedLinksMother.createEmpty(),
        status: publishedStatus,
        createdAt,
        updatedAt,
      })

      expect(article.status.isPublished()).toBe(true)
      expect(article.status.value).toBe('PUBLISHED')
    })

    it('should publish draft article', () => {
      const article = ArticleMother.createDraft()
      
      const publishedArticle = article.publish()
      
      expect(publishedArticle.status.isPublished()).toBe(true)
      expect(publishedArticle.status.value).toBe('PUBLISHED')
      expect(publishedArticle.id.equals(article.id)).toBe(true)
    })

    it('should not change status when publishing already published article', () => {
      const article = ArticleMother.createPublished()
      
      const publishedArticle = article.publish()
      
      expect(publishedArticle.status.isPublished()).toBe(true)
      expect(publishedArticle.status.value).toBe('PUBLISHED')
      expect(publishedArticle.id.equals(article.id)).toBe(true)
    })

    it('should not allow unpublishing published article', () => {
      const article = ArticleMother.createPublished()
      
      expect(() => article.unpublish()).toThrow(ArticleStatusInvalid)
    })

    it('should allow saving draft article multiple times', () => {
      const article = ArticleMother.createDraft()
      const newTitle = new ArticleTitle('Updated Draft Title')
      
      const updatedArticle = article.update({ title: newTitle })
      
      expect(updatedArticle.status.isDraft()).toBe(true)
      expect(updatedArticle.title.value).toBe('Updated Draft Title')
    })

    it('should include status in primitives', () => {
      const draftArticle = ArticleMother.createDraft()
      const publishedArticle = ArticleMother.createPublished()
      
      const draftPrimitives = draftArticle.toPrimitives()
      const publishedPrimitives = publishedArticle.toPrimitives()
      
      expect(draftPrimitives.status).toBe('DRAFT')
      expect(publishedPrimitives.status).toBe('PUBLISHED')
    })

    it('should check if article is publishable', () => {
      const draftArticle = ArticleMother.createDraft()
      const publishedArticle = ArticleMother.createPublished()
      
      expect(draftArticle.canBePublished()).toBe(true)
      expect(publishedArticle.canBePublished()).toBe(false)
    })

    it('should check if article is draft', () => {
      const draftArticle = ArticleMother.createDraft()
      const publishedArticle = ArticleMother.createPublished()
      
      expect(draftArticle.isDraft()).toBe(true)
      expect(publishedArticle.isDraft()).toBe(false)
    })

    it('should check if article is published', () => {
      const draftArticle = ArticleMother.createDraft()
      const publishedArticle = ArticleMother.createPublished()
      
      expect(draftArticle.isPublished()).toBe(false)
      expect(publishedArticle.isPublished()).toBe(true)
    })
  })
})
