import { ListArticles } from '../ListArticles';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { Collection } from '@/contexts/shared/domain/Collection';
import { InvalidPaginationParams } from '../InvalidPaginationParams';

describe('ListArticles', () => {
  let repository: ArticleRepository;
  let listArticles: ListArticles;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      search: jest.fn(),
      searchAll: jest.fn(),
      searchByPage: jest.fn(),
      searchByBookId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    listArticles = new ListArticles(repository);
  });

  it('should return paginated articles', async () => {
    const now = new Date();
    const articles = Array.from({ length: 2 }, (_, i) => 
      Article.create({
        id: ArticleId.create(`test-id-${i}`),
        title: ArticleTitle.create(`Test Article ${i}`),
        excerpt: ArticleExcerpt.create(`Test Excerpt ${i}`),
        content: ArticleContent.create(`Test Content ${i}`),
        bookIds: ArticleBookIds.create(['book-1']), // Add at least one book ID
        createdAt: now,
        updatedAt: now
      })
    );

    repository.searchByPage = jest.fn().mockResolvedValue(
      new Collection(articles, {
        page: 1,
        limit: 10,
        total: 2
      })
    );

    const result = await listArticles.run(1, 10);

    expect(result.items).toHaveLength(2);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 2
    });
    expect(repository.searchByPage).toHaveBeenCalledWith(1, 10);
  });

  it('should throw InvalidPaginationParams for invalid page', async () => {
    await expect(listArticles.run(0, 10))
      .rejects
      .toThrow(InvalidPaginationParams);
  });

  it('should throw InvalidPaginationParams for invalid limit', async () => {
    await expect(listArticles.run(1, 0))
      .rejects
      .toThrow(InvalidPaginationParams);
  });

  it('should return empty collection when no articles exist', async () => {
    repository.searchByPage = jest.fn().mockResolvedValue(
      new Collection([], {
        page: 1,
        limit: 10,
        total: 0
      })
    );

    const result = await listArticles.run(1, 10);

    expect(result.items).toHaveLength(0);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 0
    });
  });
});
