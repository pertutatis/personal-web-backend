import { UpdateArticle } from '../UpdateArticle';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { ArticleNotFound } from '../ArticleNotFound';
import { ArticleRelatedLinks } from '../../domain/ArticleRelatedLinks';
import { ArticleSlug } from '../../domain/ArticleSlug';

describe('UpdateArticle', () => {
  const existingArticleId = 'existing-article-id';
  const existingArticle = Article.create({
    id: ArticleId.create(existingArticleId),
    title: ArticleTitle.create('Original Title'),
    excerpt: ArticleExcerpt.create('Original Excerpt'),
    content: ArticleContent.create('Original Content'),
    bookIds: ArticleBookIds.create(['book-1']),
    relatedLinks: ArticleRelatedLinks.create([]),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const mockRepository: jest.Mocked<ArticleRepository> = {
    save: jest.fn(),
    search: jest.fn().mockImplementation(async (id) => {
      return id.value === existingArticleId ? existingArticle : null;
    }),
    searchBySlug: jest.fn(),
    searchAll: jest.fn(),
    searchByPage: jest.fn(),
    searchByBookId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  const updateArticle = new UpdateArticle(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update an existing article with all fields', async () => {
    const request = {
      id: existingArticleId,
      title: 'Updated Title',
      excerpt: 'Updated Excerpt',
      content: 'Updated Content',
      bookIds: ['book-2'],
      relatedLinks: [
        { text: 'Updated Link', url: 'https://example.com/updated' }
      ]
    };

    const updatedArticle = await updateArticle.run(request);

    expect(mockRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(ArticleId),
        title: expect.any(ArticleTitle),
        excerpt: expect.any(ArticleExcerpt),
        content: expect.any(ArticleContent),
        bookIds: expect.any(ArticleBookIds),
        relatedLinks: expect.any(ArticleRelatedLinks),
        slug: expect.any(ArticleSlug)
      })
    );

    expect(updatedArticle.title.value).toBe(request.title);
    expect(updatedArticle.excerpt.value).toBe(request.excerpt);
    expect(updatedArticle.content.value).toBe(request.content);
    expect(updatedArticle.bookIds.getValue()).toEqual(request.bookIds);
    expect(updatedArticle.relatedLinks.toPrimitives()).toEqual(request.relatedLinks);
    expect(updatedArticle.slug.value).toBe('updated-title');
  });

  it('should update only specified fields', async () => {
    const request = {
      id: existingArticleId,
      title: 'Updated Title Only'
    };

    const updatedArticle = await updateArticle.run(request);

    expect(updatedArticle.title.value).toBe(request.title);
    expect(updatedArticle.excerpt.value).toBe(existingArticle.excerpt.value);
    expect(updatedArticle.content.value).toBe(existingArticle.content.value);
    expect(updatedArticle.bookIds.getValue()).toEqual(existingArticle.bookIds.getValue());
    expect(updatedArticle.relatedLinks.toPrimitives()).toEqual(existingArticle.relatedLinks.toPrimitives());
    expect(updatedArticle.slug.value).toBe('updated-title-only');
  });

  it('should update related links only', async () => {
    const request = {
      id: existingArticleId,
      relatedLinks: [
        { text: 'New Link', url: 'https://example.com/new' }
      ]
    };

    const updatedArticle = await updateArticle.run(request);

    expect(updatedArticle.title.value).toBe(existingArticle.title.value);
    expect(updatedArticle.relatedLinks.toPrimitives()).toEqual(request.relatedLinks);
    expect(updatedArticle.slug.value).toBe('original-title');
  });

  it('should throw ArticleNotFound for non-existing article', async () => {
    const request = {
      id: 'non-existing-id',
      title: 'New Title'
    };

    await expect(updateArticle.run(request)).rejects.toThrow(ArticleNotFound);
  });
});
