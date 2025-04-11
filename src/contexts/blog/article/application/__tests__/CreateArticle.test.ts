import { CreateArticle } from '../CreateArticle';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRelatedLinks } from '../../domain/ArticleRelatedLinks';
import { ArticleIdDuplicated } from '../../domain/ArticleIdDuplicated';
import { ArticleIdMother } from '../../domain/__tests__/mothers/ArticleIdMother';

describe('CreateArticle', () => {
  let repository: jest.Mocked<ArticleRepository>;
  let createArticle: CreateArticle;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      search: jest.fn().mockResolvedValue(null),
    } as unknown as jest.Mocked<ArticleRepository>;

    createArticle = new CreateArticle(repository);
  });

  const validUUID = 'cc8d8194-e099-4e3a-a431-6b4412dc5f6a';

  it('should create article with valid data', async () => {
    await createArticle.run({
      id: validUUID,
      title: 'Test Title',
      excerpt: 'Test Excerpt',
      content: 'Test Content',
      bookIds: ['dd7d8194-e099-4e3a-a431-6b4412dc5f6b'],
      relatedLinks: []
    });

    expect(repository.save).toHaveBeenCalled();
    const savedArticle = (repository.save as jest.Mock).mock.calls[0][0] as Article;

    expect(savedArticle.id.value).toBe(validUUID);
    expect(savedArticle.title.value).toBe('Test Title');
    expect(savedArticle.excerpt.value).toBe('Test Excerpt');
    expect(savedArticle.content.value).toBe('Test Content');
    expect(savedArticle.bookIds.getValue()).toEqual(['dd7d8194-e099-4e3a-a431-6b4412dc5f6b']);
    expect(savedArticle.relatedLinks.isEmpty).toBe(true);
  });

  it('should create with empty book ids', async () => {
    await createArticle.run({
      id: validUUID,
      title: 'Test Title',
      excerpt: 'Test Excerpt',
      content: 'Test Content',
      bookIds: [],
      relatedLinks: []
    });

    const savedArticle = (repository.save as jest.Mock).mock.calls[0][0] as Article;
    expect(savedArticle.bookIds.isEmpty).toBe(true);
  });

  it('should create article with related links', async () => {
    const relatedLinks = [
      { text: 'Link 1', url: 'https://example1.com' },
      { text: 'Link 2', url: 'https://example2.com' }
    ];

    await createArticle.run({
      id: validUUID,
      title: 'Test Title',
      excerpt: 'Test Excerpt',
      content: 'Test Content',
      bookIds: [],
      relatedLinks
    });

    const savedArticle = (repository.save as jest.Mock).mock.calls[0][0] as Article;
    expect(savedArticle.relatedLinks.length).toBe(2);
    expect(savedArticle.relatedLinks.toPrimitives()).toEqual(relatedLinks);
  });

  it('should throw error when id already exists', async () => {
    repository.search.mockResolvedValue({} as Article);

    await expect(createArticle.run({
      id: validUUID,
      title: 'Test Title',
      excerpt: 'Test Excerpt',
      content: 'Test Content',
      bookIds: [],
      relatedLinks: []
    }))
    .rejects
    .toThrow(ArticleIdDuplicated);
  });

  it('should throw error on invalid UUID format', async () => {
    await expect(createArticle.run({
      id: 'invalid-uuid',
      title: 'Test Title',
      excerpt: 'Test Excerpt',
      content: 'Test Content',
      bookIds: [],
      relatedLinks: []
    }))
    .rejects
    .toThrow('Invalid UUID v4 format');
  });
});
