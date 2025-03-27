import { CreateArticle } from '../CreateArticle';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { UuidGenerator } from '@/contexts/shared/domain/UuidGenerator';
import { Article } from '../../domain/Article';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRelatedLinks } from '../../domain/ArticleRelatedLinks';

describe('CreateArticle', () => {
  let repository: jest.Mocked<ArticleRepository>;
  let uuidGenerator: jest.Mocked<UuidGenerator>;
  let createArticle: CreateArticle;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
    } as unknown as jest.Mocked<ArticleRepository>;

    uuidGenerator = {
      generate: jest.fn().mockResolvedValue('test-id'),
    } as unknown as jest.Mocked<UuidGenerator>;

    createArticle = new CreateArticle(repository, uuidGenerator);
  });

  it('should create article with valid data', async () => {
    await createArticle.run({
      title: 'Test Title',
      excerpt: 'Test Excerpt',
      content: 'Test Content',
      bookIds: ['book-1'],
      relatedLinks: []
    });

    expect(repository.save).toHaveBeenCalled();
    const savedArticle = (repository.save as jest.Mock).mock.calls[0][0] as Article;

    expect(savedArticle.id.value).toBe('test-id');
    expect(savedArticle.title.value).toBe('Test Title');
    expect(savedArticle.excerpt.value).toBe('Test Excerpt');
    expect(savedArticle.content.value).toBe('Test Content');
    expect(savedArticle.bookIds.getValue()).toEqual(['book-1']);
    expect(savedArticle.relatedLinks.isEmpty).toBe(true);
  });

  it('should create with empty book ids', async () => {
    await createArticle.run({
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
});
