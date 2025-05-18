import { Article } from '../../domain/Article';
import { ArticleId } from '../../domain/ArticleId';
import { ArticleTitle } from '../../domain/ArticleTitle';
import { ArticleExcerpt } from '../../domain/ArticleExcerpt';
import { ArticleContent } from '../../domain/ArticleContent';
import { ArticleBookIds } from '../../domain/ArticleBookIds';
import { ArticleRelatedLinks } from '../../domain/ArticleRelatedLinks';
import { ArticleRelatedLink } from '../../domain/ArticleRelatedLink';
import { PostgresArticleRepository } from '../PostgresArticleRepository';
import { TestDatabase } from '@/contexts/shared/infrastructure/__tests__/TestDatabase';
import { PostgresMigrations } from '@/contexts/shared/infrastructure/PostgresMigrations';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { v4 as uuidv4 } from 'uuid';

describe('PostgresArticleRepository', () => {
  let repository: PostgresArticleRepository;

  let articlesConnection: PostgresConnection;
  let booksConnection: PostgresConnection;

  beforeAll(async () => {
    await TestDatabase.closeAll();
    articlesConnection = await TestDatabase.getArticlesConnection();
    booksConnection = await TestDatabase.getBooksConnection();
  });

  beforeEach(async () => {
    try {
      // Limpiar datos antes de cada test
      await Promise.all([
        articlesConnection.execute('DELETE FROM articles'),
        booksConnection.execute('DELETE FROM books')
      ]);

      // Recrear el repositorio con las conexiones limpias
      repository = new PostgresArticleRepository(
        await TestDatabase.getArticlesConnection(),
        await TestDatabase.getBooksConnection()
      );
    } catch (error) {
      console.error('Error en beforeEach:', error);
      throw error;
    }
  });

  afterEach(async () => {
    try {
      // Asegurar que no hay transacciones activas
      await Promise.all([
        articlesConnection.execute('ROLLBACK'),
        booksConnection.execute('ROLLBACK')
      ]).catch(() => {});
    } catch (error) {
      console.error('Error en afterEach:', error);
    }
  });

  afterAll(async () => {
    await TestDatabase.closeAll();
  });

  it('should save and retrieve an article', async () => {
    const now = new Date();
    const id = uuidv4();
    const article = Article.create({
      id: new ArticleId(id),
      title: new ArticleTitle('Test Article'),
      excerpt: new ArticleExcerpt('Test Excerpt'),
      content: new ArticleContent('Test Content'),
      bookIds: ArticleBookIds.fromValues([]),
      relatedLinks: ArticleRelatedLinks.createEmpty(),
      createdAt: now,
      updatedAt: now
    });

    await repository.save(article);

    const retrieved = await repository.search(new ArticleId(id));
    expect(retrieved).not.toBeNull();

    const primitives = retrieved?.toPrimitives();
    expect(primitives).toEqual({
      id,
      title: 'Test Article',
      excerpt: 'Test Excerpt',
      content: 'Test Content',
      bookIds: [],
      relatedLinks: [],
      slug: 'test-article',
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });

    expect(new Date(primitives!.createdAt).getTime()).not.toBeNaN();
    expect(new Date(primitives!.updatedAt).getTime()).not.toBeNaN();
  });

  it('should return null when article not found', async () => {
    const result = await repository.search(new ArticleId(uuidv4()));
    expect(result).toBeNull();
  });

  it('should update an article', async () => {
    const now = new Date();
    const id = uuidv4();
    const article = Article.create({
      id: new ArticleId(id),
      title: new ArticleTitle('Test Article'),
      excerpt: new ArticleExcerpt('Test Excerpt'),
      content: new ArticleContent('Test Content'),
      bookIds: ArticleBookIds.fromValues([]),
      relatedLinks: ArticleRelatedLinks.createEmpty(),
      createdAt: now,
      updatedAt: now
    });

    await repository.save(article);

    const updated = article.update({
      title: new ArticleTitle('Updated Title'),
      excerpt: new ArticleExcerpt('Updated Excerpt'),
      content: new ArticleContent('Updated Content'),
      bookIds: ArticleBookIds.fromValues([]),
      relatedLinks: ArticleRelatedLinks.create([
        { text: 'Test Link', url: 'https://example.com' }
      ])
    });

    await repository.update(updated);

    const retrieved = await repository.search(new ArticleId(id));
    expect(retrieved?.title.value).toBe('Updated Title');
    expect(retrieved?.excerpt.value).toBe('Updated Excerpt');
    expect(retrieved?.content.value).toBe('Updated Content');
    expect(retrieved?.bookIds.getValue()).toEqual([]);
    expect(retrieved?.relatedLinks.toPrimitives()).toEqual([
      { text: 'Test Link', url: 'https://example.com' }
    ]);
    expect(retrieved?.slug.value).toBe('updated-title');
  });

  it('should update only the excerpt', async () => {
    const now = new Date();
    const id = uuidv4();
    const article = Article.create({
      id: new ArticleId(id),
      title: new ArticleTitle('Test Article'),
      excerpt: new ArticleExcerpt('Test Excerpt'),
      content: new ArticleContent('Test Content'),
      bookIds: ArticleBookIds.fromValues([]),
      relatedLinks: ArticleRelatedLinks.createEmpty(),
      createdAt: now,
      updatedAt: now
    });

    await repository.save(article);

    const updated = article.update({
      excerpt: new ArticleExcerpt('Updated Excerpt Only')
    });

    await repository.update(updated);

    const retrieved = await repository.search(new ArticleId(id));
    expect(retrieved?.title.value).toBe('Test Article');
    expect(retrieved?.excerpt.value).toBe('Updated Excerpt Only');
    expect(retrieved?.content.value).toBe('Test Content');
    expect(retrieved?.bookIds.getValue()).toEqual([]);
    expect(retrieved?.relatedLinks.toPrimitives()).toEqual([]);
    expect(retrieved?.slug.value).toBe('test-article');
  });

  it('should list articles with pagination', async () => {
    const now = new Date();
    // Create articles in reverse order with different timestamps
    const articles = [];
    for (let i = 5; i >= 1; i--) {
      const createdAt = new Date(now.getTime() - (6 - i) * 1000);
      const article = Article.create({
        id: new ArticleId(uuidv4()),
        title: new ArticleTitle(`Test Article ${i}`),
        excerpt: new ArticleExcerpt(`Test Excerpt ${i}`),
        content: new ArticleContent(`Test Content ${i}`),
        bookIds: ArticleBookIds.fromValues([]),
        relatedLinks: ArticleRelatedLinks.createEmpty(),
        createdAt: createdAt,
        updatedAt: createdAt
      });
      await repository.save(article);
      articles.push(article);
    }

    const page1 = await repository.searchByPage(1, 2);
    const page2 = await repository.searchByPage(2, 2);
    const page3 = await repository.searchByPage(3, 2);

    expect(page1.items).toHaveLength(2);
    expect(page2.items).toHaveLength(2);
    expect(page3.items).toHaveLength(1);

    expect(page1.items[0].excerpt.value).toBe('Test Excerpt 5');
    expect(page1.items[0].slug.value).toBe('test-article-5');
    expect(page1.items[1].excerpt.value).toBe('Test Excerpt 4');
    expect(page1.items[1].slug.value).toBe('test-article-4');
  });
});
