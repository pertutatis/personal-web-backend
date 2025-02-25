import { ListArticles } from '../ListArticles';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { Collection } from '@/contexts/shared/domain/Collection';
import { InvalidPaginationParams } from '../InvalidPaginationParams';

describe('ListArticles', () => {
  const mockRepository: jest.Mocked<ArticleRepository> = {
    save: jest.fn(),
    search: jest.fn(),
    searchAll: jest.fn(),
    searchByPage: jest.fn(),
    update: jest.fn()
  };

  const listArticles = new ListArticles(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all articles when no pagination is provided', async () => {
    const articles = new Collection([
      Article.create({
        id: ArticleId.create('article-1'),
        title: ArticleTitle.create('Article 1'),
        content: ArticleContent.create('Content 1'),
        bookIds: ArticleBookIds.create(['book-1']),
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      Article.create({
        id: ArticleId.create('article-2'),
        title: ArticleTitle.create('Article 2'),
        content: ArticleContent.create('Content 2'),
        bookIds: ArticleBookIds.create(['book-2']),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ]);

    mockRepository.searchAll.mockResolvedValue(articles);

    const result = await listArticles.run({});

    expect(result).toBe(articles);
    expect(mockRepository.searchAll).toHaveBeenCalled();
    expect(mockRepository.searchByPage).not.toHaveBeenCalled();
  });

  it('should return paginated articles when pagination is provided', async () => {
    const articles = new Collection([
      Article.create({
        id: ArticleId.create('article-1'),
        title: ArticleTitle.create('Article 1'),
        content: ArticleContent.create('Content 1'),
        bookIds: ArticleBookIds.create(['book-1']),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ]);

    mockRepository.searchByPage.mockResolvedValue(articles);

    const result = await listArticles.run({ page: 1, limit: 1 });

    expect(result).toBe(articles);
    expect(mockRepository.searchByPage).toHaveBeenCalledWith(1, 1);
    expect(mockRepository.searchAll).not.toHaveBeenCalled();
  });

  it('should throw error when page is less than 1', async () => {
    await expect(listArticles.run({ page: 0, limit: 10 }))
      .rejects
      .toThrow(InvalidPaginationParams);
  });

  it('should throw error when limit is less than 1', async () => {
    await expect(listArticles.run({ page: 1, limit: 0 }))
      .rejects
      .toThrow(InvalidPaginationParams);
  });
});
