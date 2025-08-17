import { BlogArticleMother } from '../../domain/__tests__/mothers/BlogArticleMother'
import { BlogBookMother } from '../../domain/__tests__/mothers/BlogBookMother'
import { BlogArticleRepositoryMock } from '../../domain/__tests__/mothers/BlogArticleRepositoryMock'
import { ListArticles } from '../ListArticles'

describe('ListArticles', () => {
  let repository: BlogArticleRepositoryMock
  let useCase: ListArticles

  beforeEach(() => {
    repository = new BlogArticleRepositoryMock()
    useCase = new ListArticles(repository)
  })

  it('should return all published articles ordered by publishedAt descending', async () => {
    const article1 = BlogArticleMother.create(
      'article-1',
      'Article 1',
      'Excerpt 1',
      'Content 1',
      [],
      [],
      'article-1',
      new Date('2024-01-01'), // updatedAt
      new Date('2024-01-01'),
      new Date('2024-01-05'), // publishedAt
    )

    const article2 = BlogArticleMother.create(
      'article-2',
      'Article 2',
      'Excerpt 2',
      'Content 2',
      [],
      [],
      'article-2',
      new Date('2024-01-02'), // updatedAt
      new Date('2024-01-02'),
      new Date('2024-01-02'), // publishedAt
    )

    const article3 = BlogArticleMother.create(
      'article-3',
      'Article 3',
      'Excerpt 3',
      'Content 3',
      [],
      [],
      'article-3',
      new Date('2024-01-03'), // updatedAt
      new Date('2024-01-03'),
      new Date('2024-01-03'), // publishedAt
    )

    // Return articles in random order
    repository.returnOnFindAll([article1, article3, article2])

    const articles = await useCase.execute()

    // Verify repository was called
    repository.assertFindAllHasBeenCalled()

    // Verify articles are returned in correct order (newest first)
    expect(articles).toHaveLength(3)
    expect(articles[0].id).toBe('article-1')
    expect(articles[1].id).toBe('article-3')
    expect(articles[2].id).toBe('article-2')
  })

  it('should return empty array when no articles exist', async () => {
    repository.returnOnFindAll([])

    const articles = await useCase.execute()

    repository.assertFindAllHasBeenCalled()
    expect(articles).toHaveLength(0)
  })

  it('should return articles with their books', async () => {
    const articles = [
      BlogArticleMother.create(
        'article-1',
        'Article 1',
        'Excerpt 1',
        'Content 1',
        BlogBookMother.createMultiple(2),
        [],
        'article-1',
        new Date('2024-01-01'),
        new Date('2024-01-01'), // updatedAt
        new Date('2024-01-01'), // publishedAt
      ),
      BlogArticleMother.create(
        'article-2',
        'Article 2',
        'Excerpt 2',
        'Content 2',
        BlogBookMother.createMultiple(2),
        [],
        'article-2',
        new Date('2024-01-02'),
        new Date('2024-01-02'), // updatedAt
        new Date('2024-01-02'), // publishedAt
      ),
    ]
    repository.returnOnFindAll(articles)

    const result = await useCase.execute()

    repository.assertFindAllHasBeenCalled()
    expect(result).toHaveLength(2)
    expect(result[0].hasBooks()).toBe(true)
    expect(result[1].hasBooks()).toBe(true)
  })
})
