import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { PostgresArticleRepository } from '../PostgresArticleRepository';
import { TestDatabase } from '@/contexts/shared/infrastructure/__tests__/TestDatabase';

describe('PostgresArticleRepository', () => {
  let repository: PostgresArticleRepository;

  beforeAll(async () => {
    const articlesConnection = await TestDatabase.getArticlesConnection();
    const booksConnection = await TestDatabase.getBooksConnection();
    repository = new PostgresArticleRepository(articlesConnection, booksConnection);
  });

  beforeEach(async () => {
    await TestDatabase.cleanAll();
  });

  it('should save and retrieve an article', async () => {
    const now = new Date();
    const article = Article.create({
      id: ArticleId.create('test-id'),
      title: ArticleTitle.create('Test Article'),
      content: ArticleContent.create('Test Content'),
      bookIds: ArticleBookIds.create([]),
      createdAt: now,
      updatedAt: now
    });

    await repository.save(article);

    const retrieved = await repository.search(ArticleId.create('test-id'));
    expect(retrieved).not.toBeNull();
    expect(retrieved?.toPrimitives()).toEqual({
      id: 'test-id',
      title: 'Test Article',
      content: 'Test Content',
      bookIds: [],
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });

  it('should return null when article not found', async () => {
    const result = await repository.search(ArticleId.create('non-existent'));
    expect(result).toBeNull();
  });

  it('should update an article', async () => {
    const now = new Date();
    const article = Article.create({
      id: ArticleId.create('test-id'),
      title: ArticleTitle.create('Test Article'),
      content: ArticleContent.create('Test Content'),
      bookIds: ArticleBookIds.create([]),
      createdAt: now,
      updatedAt: now
    });

    await repository.save(article);

    article.update({
      title: ArticleTitle.create('Updated Title'),
      content: ArticleContent.create('Updated Content'),
      bookIds: ArticleBookIds.create([])
    });

    await repository.update(article);

    const updated = await repository.search(ArticleId.create('test-id'));
    expect(updated?.title.value).toBe('Updated Title');
    expect(updated?.content.value).toBe('Updated Content');
    expect(updated?.bookIds.value).toEqual([]);
  });

  it('should list articles with pagination', async () => {
    const now = new Date();
    const articles = Array.from({ length: 5 }, (_, i) => 
      Article.create({
        id: ArticleId.create(`test-id-${i}`),
        title: ArticleTitle.create(`Test Article ${i}`),
        content: ArticleContent.create(`Test Content ${i}`),
        bookIds: ArticleBookIds.create([]),
        createdAt: now,
        updatedAt: now
      })
    );

    await Promise.all(articles.map(article => repository.save(article)));

    const page1 = await repository.searchByPage(1, 2);
    const page2 = await repository.searchByPage(2, 2);
    const page3 = await repository.searchByPage(3, 2);

    expect(page1.items).toHaveLength(2);
    expect(page2.items).toHaveLength(2);
    expect(page3.items).toHaveLength(1);
  });
});
