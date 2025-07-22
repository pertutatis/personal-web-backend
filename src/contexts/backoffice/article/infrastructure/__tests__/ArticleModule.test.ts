import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection';
import { DatabaseConnectionFactory } from '@/contexts/shared/infrastructure/persistence/DatabaseConnectionFactory';
import { getBlogDatabaseConfig } from '@/contexts/shared/infrastructure/config/database';
import { ArticleModule } from '../DependencyInjection/article.module';
import { BookDeletedDomainEvent } from '@/contexts/backoffice/book/domain/event/BookDeletedDomainEvent';
import { EventBusFactory } from '@/contexts/shared/infrastructure/eventBus/EventBusFactory';
import { TestDatabase } from '@/contexts/shared/infrastructure/__tests__/TestDatabase';
import { ArticleMother } from '../../domain/__tests__/mothers/ArticleMother';
import { PostgresArticleRepository } from '../PostgresArticleRepository';
import { v4 as uuidv4 } from 'uuid';

describe('ArticleModule', () => {
  let repository: PostgresArticleRepository;
  let connection: DatabaseConnection;

  beforeAll(async () => {
    connection = await TestDatabase.getArticlesConnection();
    repository = new PostgresArticleRepository(connection);
  });

  afterAll(async () => {
    await TestDatabase.closeAll();
  });

  beforeEach(async () => {
    await TestDatabase.cleanAll();
  });

  it('should remove book references when handling BookDeletedDomainEvent', async () => {
    // Initialize module
    await ArticleModule.init(connection);

    // Create test book in database
    const bookId = uuidv4();
    await connection.execute(
      `INSERT INTO books (
        id, 
        title, 
        author, 
        isbn, 
        description,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        bookId,
        'Test Book',
        'Test Author',
        '9781234567890',
        'Test Description',
        new Date(),
        new Date()
      ]
    );

    // Verify book exists
    const bookExists = await connection.execute(
      'SELECT EXISTS(SELECT 1 FROM books WHERE id = $1)',
      [bookId]
    );

    expect(bookExists.rows[0].exists).toBe(true);

    // Create test article with book reference
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
