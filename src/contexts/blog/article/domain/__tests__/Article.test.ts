import { Article } from '../Article';
import { ArticleId } from '../ArticleId';
import { ArticleTitle } from '../ArticleTitle';
import { ArticleContent } from '../ArticleContent';
import { ArticleBookIds } from '../ArticleBookIds';
import { ArticleTitleEmpty } from '../ArticleTitleEmpty';
import { ArticleContentEmpty } from '../ArticleContentEmpty';
import { ArticleBookIdsEmpty } from '../ArticleBookIdsEmpty';

describe('Article', () => {
  const now = new Date();
  const validArticleData = {
    id: ArticleId.create('test-id'),
    title: ArticleTitle.create('Test Article'),
    content: ArticleContent.create('Test Content'),
    bookIds: ArticleBookIds.create(['book-1']),
    createdAt: now,
    updatedAt: now
  };

  it('should create a valid article', () => {
    const article = Article.create(validArticleData);

    expect(article.id.toString()).toBe('test-id');
    expect(article.title.toString()).toBe('Test Article');
    expect(article.content.toString()).toBe('Test Content');
    expect(article.bookIds.toString()).toBe('book-1');
    expect(article.createdAt).toBe(now);
    expect(article.updatedAt).toBe(now);
  });

  it('should create an article event when created', () => {
    const article = Article.create(validArticleData);
    const events = article.pullDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('article.created');
  });

  it('should update article properties', () => {
    const article = Article.create(validArticleData);
    const newTitle = ArticleTitle.create('Updated Title');
    const newContent = ArticleContent.create('Updated Content');
    const newBookIds = ArticleBookIds.create(['book-2', 'book-3']);

    article.update({
      title: newTitle,
      content: newContent,
      bookIds: newBookIds
    });

    expect(article.title.toString()).toBe('Updated Title');
    expect(article.content.toString()).toBe('Updated Content');
    expect(article.bookIds.toString()).toBe('book-2,book-3');
  });

  it('should create an updated event when updated', () => {
    const article = Article.create(validArticleData);
    article.update({
      title: ArticleTitle.create('Updated Title'),
      content: ArticleContent.create('Updated Content'),
      bookIds: ArticleBookIds.create(['book-2'])
    });
    
    const events = article.pullDomainEvents();
    expect(events).toHaveLength(2);
    expect(events[1].eventName).toBe('article.updated');
  });

  it('should convert to primitives', () => {
    const article = Article.create(validArticleData);
    const primitives = article.toPrimitives();

    expect(primitives).toEqual({
      id: 'test-id',
      title: 'Test Article',
      content: 'Test Content',
      bookIds: ['book-1'],
      createdAt: now,
      updatedAt: now
    });
  });

  it('should not create article with empty title', () => {
    expect(() => 
      Article.create({
        ...validArticleData,
        title: ArticleTitle.create('')
      })
    ).toThrow(ArticleTitleEmpty);
  });

  it('should not create article with empty content', () => {
    expect(() => 
      Article.create({
        ...validArticleData,
        content: ArticleContent.create('')
      })
    ).toThrow(ArticleContentEmpty);
  });

  it('should not create article without book ids', () => {
    expect(() => 
      Article.create({
        ...validArticleData,
        bookIds: ArticleBookIds.create([])
      })
    ).toThrow(ArticleBookIdsEmpty);
  });
});
