import { ListArticles } from '../ListArticles';
import { ArticleRepository } from '../../domain/ArticleRepository';
import { Article } from '../../domain/Article';
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
    // Crear UUIDs únicos para cada artículo
    const uuid1 = 'cc8d8194-e099-4e3a-a431-6b4412dc5f6a';
    const uuid2 = 'dd7d8194-e099-4e3a-a431-6b4412dc5f6b';

    const articles = [
      Article.create({
        id: ArticleIdMother.create(uuid1),
        title: new ArticleTitle('Test Article 1'),
        excerpt: new ArticleExcerpt('Test Excerpt 1'),
        content: new ArticleContent('Test Content 1'),
        slug: ArticleSlug.fromTitle('Test Article 1'),
        bookIds: ArticleBookIds.create([]),
        relatedLinks: ArticleRelatedLinks.create([]),
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      Article.create({
        id: ArticleIdMother.create(uuid2),
        title: new ArticleTitle('Test Article 2'),
        excerpt: new ArticleExcerpt('Test Excerpt 2'),
        content: new ArticleContent('Test Content 2'),
        slug: ArticleSlug.fromTitle('Test Article 2'),
        bookIds: ArticleBookIds.create([]),
        relatedLinks: ArticleRelatedLinks.create([]),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ];

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
