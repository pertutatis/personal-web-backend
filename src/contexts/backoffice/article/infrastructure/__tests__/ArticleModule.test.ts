import { ArticleModule } from '../DependencyInjection/article.module';
import { BookDeletedDomainEvent } from '@/contexts/backoffice/book/domain/event/BookDeletedDomainEvent';
import { EventBusFactory } from '@/contexts/shared/infrastructure/eventBus/EventBusFactory';
import { PostgresConnection } from '@/contexts/shared/infrastructure/PostgresConnection';
import { TestDatabase } from '@/contexts/shared/infrastructure/__tests__/TestDatabase';
import { ArticleMother } from '../../domain/__tests__/mothers/ArticleMother';
import { PostgresArticleRepository } from '../PostgresArticleRepository';

describe('ArticleModule', () => {
  let articlesConnection: PostgresConnection;
  let booksConnection: PostgresConnection;
  let repository: PostgresArticleRepository;

  beforeAll(async () => {
    articlesConnection = await TestDatabase.getArticlesConnection();
    booksConnection = await TestDatabase.getBooksConnection();
    repository = new PostgresArticleRepository(articlesConnection, booksConnection);
  });

  afterAll(async () => {
    await TestDatabase.closeAll();
  });

  beforeEach(async () => {
    await TestDatabase.cleanAll();
  });

  it('should remove book references when handling BookDeletedDomainEvent', async () => {
    // Initialize module
    await ArticleModule.init(articlesConnection, booksConnection);

    // Create test article with book reference
    const bookId = 'test-book-id';
    const article = ArticleMother.withBookReferences([bookId]);
    await repository.save(article);

    // Verify article has book reference
    const savedArticle = await repository.search(article.id);
    expect(savedArticle?.bookIds.getValue()).toContain(bookId);

    // Dispatch book deleted event
    const event = new BookDeletedDomainEvent({
      aggregateId: bookId,
      occurredOn: new Date()
    });
    await EventBusFactory.getInstance().publish([event]);

    // Verify book reference was removed
    const updatedArticle = await repository.search(article.id);
    expect(updatedArticle?.bookIds.getValue()).not.toContain(bookId);
  });
});
