import { PublishArticle } from '../PublishArticle'
import { ArticleRepository } from '../../domain/ArticleRepository'
import { ArticleNotFound } from '../ArticleNotFound'
import { ArticleMother } from '../../domain/__tests__/mothers/ArticleMother'
import { ArticleIdMother } from '../../domain/__tests__/mothers/ArticleIdMother'
import { ArticleStatusInvalid } from '../../domain/ArticleStatusInvalid'

describe('PublishArticle', () => {
  let repository: jest.Mocked<ArticleRepository>
  let publishArticle: PublishArticle

  beforeEach(() => {
    repository = {
      search: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<ArticleRepository>

    publishArticle = new PublishArticle(repository)
  })

  it('should publish a draft article', async () => {
    const draftArticle = ArticleMother.createDraft()
    repository.search.mockResolvedValue(draftArticle)

    await publishArticle.run({
      id: draftArticle.id.value,
    })

    expect(repository.update).toHaveBeenCalled()
    const updatedArticle = (repository.update as jest.Mock).mock.calls[0][0]

    expect(updatedArticle.isPublished()).toBe(true)
    expect(updatedArticle.status.value).toBe('PUBLISHED')
    expect(updatedArticle.id.equals(draftArticle.id)).toBe(true)
  })

  it('should not change status when publishing already published article', async () => {
    const publishedArticle = ArticleMother.createPublished()
    repository.search.mockResolvedValue(publishedArticle)

    await publishArticle.run({
      id: publishedArticle.id.value,
    })

    expect(repository.update).toHaveBeenCalled()
    const updatedArticle = (repository.update as jest.Mock).mock.calls[0][0]

    expect(updatedArticle.isPublished()).toBe(true)
    expect(updatedArticle.status.value).toBe('PUBLISHED')
    expect(updatedArticle.id.equals(publishedArticle.id)).toBe(true)
  })

  it('should throw ArticleNotFound when article does not exist', async () => {
    const articleId = ArticleIdMother.create()
    repository.search.mockResolvedValue(null)

    await expect(
      publishArticle.run({
        id: articleId.value,
      }),
    ).rejects.toThrow(ArticleNotFound)

    expect(repository.update).not.toHaveBeenCalled()
  })

  it('should update the article timestamps when publishing', async () => {
    const draftArticle = ArticleMother.createDraft()
    const originalUpdatedAt = draftArticle.updatedAt
    repository.search.mockResolvedValue(draftArticle)

    // Mock current time to be later
    const mockNow = new Date(originalUpdatedAt.getTime() + 1000)
    jest.useFakeTimers()
    jest.setSystemTime(mockNow)

    await publishArticle.run({
      id: draftArticle.id.value,
    })

    const updatedArticle = (repository.update as jest.Mock).mock.calls[0][0]
    expect(updatedArticle.updatedAt).toEqual(mockNow)

    jest.useRealTimers()
  })

  it('should maintain all other article properties when publishing', async () => {
    const draftArticle = ArticleMother.createDraft()
    repository.search.mockResolvedValue(draftArticle)

    await publishArticle.run({
      id: draftArticle.id.value,
    })

    const updatedArticle = (repository.update as jest.Mock).mock.calls[0][0]

    expect(updatedArticle.title.equals(draftArticle.title)).toBe(true)
    expect(updatedArticle.excerpt.equals(draftArticle.excerpt)).toBe(true)
    expect(updatedArticle.content.equals(draftArticle.content)).toBe(true)
    expect(updatedArticle.slug.equals(draftArticle.slug)).toBe(true)
    expect(updatedArticle.bookIds.equals(draftArticle.bookIds)).toBe(true)
    expect(updatedArticle.relatedLinks.equals(draftArticle.relatedLinks)).toBe(true)
    expect(updatedArticle.createdAt).toEqual(draftArticle.createdAt)
  })

  it('should validate article ID format', async () => {
    await expect(
      publishArticle.run({
        id: 'invalid-uuid',
      }),
    ).rejects.toThrow()

    expect(repository.search).not.toHaveBeenCalled()
    expect(repository.update).not.toHaveBeenCalled()
  })
}) 