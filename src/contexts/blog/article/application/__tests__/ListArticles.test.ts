import { ListArticles } from '../ListArticles';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleSlug } from '../../domain/ArticleSlug';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRelatedLinks } from '../../domain/ArticleRelatedLinks';
import { Collection } from '@/contexts/shared/domain/Collection';
import { ArticleIdMother } from '../../domain/__tests__/mothers/ArticleIdMother';
import { InvalidPaginationParams } from '../InvalidPaginationParams';

describe('ListArticles', () => {
  let repository: jest.Mocked<ArticleRepository>;
  let listArticles: ListArticles;

  beforeEach(() => {
    repository = {
      searchByPage: jest.fn(),
    } as unknown as jest.Mocked<ArticleRepository>;

    listArticles = new ListArticles(repository);
  });

  it('should return paginated articles', async () => {
    const articles = Array.from({ length: 2 }, (_, i) => 
      Article.create({
        id: ArticleIdMother.sequence(i + 1),
        title: new ArticleTitle(`Test Article ${i}`),
        excerpt: new ArticleExcerpt(`Test Excerpt ${i}`),
        content: new ArticleContent(`Test Content ${i}`),
        bookIds: ArticleBookIds.create([]),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    );

    const collection = new Collection(articles, {
      page: 1,
      limit: 10,
      total: 2
    });

    repository.searchByPage.mockResolvedValue(collection);

    const result = await listArticles.run({ page: 1, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
    expect(result.pagination.total).toBe(2);
  });

  it('should throw error on invalid pagination parameters', async () => {
    await expect(listArticles.run({ page: 0, limit: 10 }))
      .rejects
      .toThrow(InvalidPaginationParams);

    await expect(listArticles.run({ page: 1, limit: 0 }))
      .rejects
      .toThrow(InvalidPaginationParams);
  });
});
