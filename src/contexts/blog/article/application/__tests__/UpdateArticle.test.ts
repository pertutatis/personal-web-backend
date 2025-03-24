import { UpdateArticle } from '../UpdateArticle';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { ArticleNotFound } from '../ArticleNotFound';

describe('UpdateArticle', () => {
  const mockRepository: jest.Mocked<ArticleRepository> = {
    save: jest.fn(),
    search: jest.fn(),
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

  it('should update an existing article', async () => {
    const existingArticle = Article.create({
      id: ArticleId.create('existing-id'),
      title: ArticleTitle.create('Old Title'),
      excerpt: ArticleExcerpt.create('Old Excerpt'),
      content: ArticleContent.create('Old Content'),
      bookIds: ArticleBookIds.create(['book-1']),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    mockRepository.search.mockResolvedValue(existingArticle);

    await updateArticle.run({
      id: 'existing-id',
      title: 'New Title',
      excerpt: 'New Excerpt',
      content: 'New Content',
      bookIds: ['book-2']
    });

    expect(mockRepository.search).toHaveBeenCalledWith(
      expect.any(ArticleId)
    );
    expect(mockRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.any(ArticleTitle),
        excerpt: expect.any(ArticleExcerpt),
        content: expect.any(ArticleContent),
        bookIds: expect.any(ArticleBookIds)
      })
    );
  });

  it('should update only the excerpt', async () => {
    const existingArticle = Article.create({
      id: ArticleId.create('existing-id'),
      title: ArticleTitle.create('Old Title'),
      excerpt: ArticleExcerpt.create('Old Excerpt'),
      content: ArticleContent.create('Old Content'),
      bookIds: ArticleBookIds.create(['book-1']),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    mockRepository.search.mockResolvedValue(existingArticle);

    const updatedArticle = await updateArticle.run({
      id: 'existing-id',
      excerpt: 'New Excerpt'
    });

    expect(updatedArticle.excerpt.value).toBe('New Excerpt');
    expect(updatedArticle.title.value).toBe('Old Title');
    expect(updatedArticle.content.value).toBe('Old Content');
    expect(updatedArticle.bookIds.getValue()).toEqual(['book-1']);
  });

  it('should throw ArticleNotFound when article does not exist', async () => {
    mockRepository.search.mockResolvedValue(null);

    await expect(updateArticle.run({
      id: 'non-existing-id',
      title: 'New Title',
      excerpt: 'New Excerpt',
      content: 'New Content',
      bookIds: ['book-1']
    }))
      .rejects
      .toThrow(ArticleNotFound);

    expect(mockRepository.search).toHaveBeenCalledWith(
      expect.any(ArticleId)
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
