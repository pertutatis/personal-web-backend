import { PostgresArticleRepository } from '../PostgresArticleRepository';
import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { getTestConfig } from '@/contexts/shared/infrastructure/config/DatabaseConfig';

describe('PostgresArticleRepository', () => {
  let articlesConnection: PostgresConnection;
  let booksConnection: PostgresConnection;
  let repository: PostgresArticleRepository;

  beforeAll(async () => {
    articlesConnection = await PostgresConnection.create(getTestConfig('test_articles'));
    booksConnection = await PostgresConnection.create(getTestConfig('test_books'));
    repository = new PostgresArticleRepository(articlesConnection, booksConnection);
  });

  afterAll(async () => {
    await articlesConnection.close();
    await booksConnection.close();
  });

  beforeEach(async () => {
    await articlesConnection.execute('DELETE FROM articles');
  });

  it('should save and retrieve an article', async () => {
    const article = Article.create({
      id: ArticleId.create('test-id'),
      title: ArticleTitle.create('Test Article'),
      content: ArticleContent.create('Test Content'),
      bookIds: ArticleBookIds.create([]),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await repository.save(article);

    const retrieved = await repository.search(ArticleId.create('test-id'));
    expect(retrieved).not.toBeNull();
    expect(retrieved?.toPrimitives()).toEqual({
      ...article.toPrimitives(),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });

  it('should return null when article not found', async () => {
    const result = await repository.search(ArticleId.create('non-existent'));
    expect(result).toBeNull();
  });

  it('should update an article', async () => {
    const article = Article.create({
      id: ArticleId.create('test-id'),
      title: ArticleTitle.create('Test Article'),
      content: ArticleContent.create('Test Content'),
      bookIds: ArticleBookIds.create([]),
      createdAt: new Date(),
      updatedAt: new Date()
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
  });

  it('should list articles with pagination', async () => {
    const articles = Array.from({ length: 5 }, (_, i) => 
      Article.create({
        id: ArticleId.create(`test-id-${i}`),
        title: ArticleTitle.create(`Test Article ${i}`),
        content: ArticleContent.create(`Test Content ${i}`),
        bookIds: ArticleBookIds.create([]),
        createdAt: new Date(),
        updatedAt: new Date()
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
