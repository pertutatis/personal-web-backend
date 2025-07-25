import { BlogArticleMother } from '../../domain/__tests__/mothers/BlogArticleMother'
import { BlogArticleRepositoryMock } from '../../domain/__tests__/mothers/BlogArticleRepositoryMock'
import { GetArticleBySlug } from '../GetArticleBySlug'
import { BlogArticleNotFound } from '../../domain/BlogArticleNotFound'

describe('GetArticleBySlug', () => {
  let repository: BlogArticleRepositoryMock
  let useCase: GetArticleBySlug

  beforeEach(() => {
    repository = new BlogArticleRepositoryMock()
    useCase = new GetArticleBySlug(repository)
  })

  it('should find an existing article by slug', async () => {
    const expectedArticle = BlogArticleMother.create(
      'article-1',
      'Test Article',
      'Test Excerpt',
      'Test Content',
      undefined, // Use default books from mother
      undefined, // Use default related links from mother
      'test-article',
    )

    repository.returnOnFindBySlug(expectedArticle)

    const article = await useCase.execute('test-article')

    repository.assertFindBySlugHasBeenCalledWith('test-article')
    expect(article).toEqual(expectedArticle)
  })

  it('should throw BlogArticleNotFound when article does not exist', async () => {
    repository.returnOnFindBySlug(null)

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      BlogArticleNotFound,
    )

    repository.assertFindBySlugHasBeenCalledWith('non-existent')
  })

  it('should return article with its books', async () => {
    const article = BlogArticleMother.create() // Creates article with default books
    repository.returnOnFindBySlug(article)

    const result = await useCase.execute(article.slug)

    repository.assertFindBySlugHasBeenCalledWith(article.slug)
    expect(result.hasBooks()).toBe(true)
    expect(result.books).toHaveLength(2) // Default from mother
    expect(result.books[0].title).toBeDefined()
    expect(result.books[0].author).toBeDefined()
  })

  it('should return article with empty books array when it has no books', async () => {
    const article = BlogArticleMother.withoutBooks()
    repository.returnOnFindBySlug(article)

    const result = await useCase.execute(article.slug)

    repository.assertFindBySlugHasBeenCalledWith(article.slug)
    expect(result.hasBooks()).toBe(false)
    expect(result.books).toHaveLength(0)
  })

  it('should include related links in the response', async () => {
    const article = BlogArticleMother.create() // Creates article with default related links
    repository.returnOnFindBySlug(article)

    const result = await useCase.execute(article.slug)

    repository.assertFindBySlugHasBeenCalledWith(article.slug)
    expect(result.hasRelatedLinks()).toBe(true)
    expect(result.relatedLinks[0].text).toBeDefined()
    expect(result.relatedLinks[0].url).toBeDefined()
  })
})
