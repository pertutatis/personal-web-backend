import { ArticleTitleEmpty } from '../ArticleTitleEmpty';
import { ArticleContentEmpty } from '../ArticleContentEmpty';
import { ArticleBookIdsEmpty } from '../ArticleBookIdsEmpty';
import { ArticleMother } from './mothers/ArticleMother';
import { ArticleTitleMother } from './mothers/ArticleTitleMother';
import { ArticleContentMother } from './mothers/ArticleContentMother';
import { ArticleBookIdsMother } from './mothers/ArticleBookIdsMother';

describe('Article', () => {
  it('should create a valid article', () => {
    const now = new Date();
    const article = ArticleMother.withDates(now, now);

    expect(article.id.toString()).toBeDefined();
    expect(article.title.toString()).toBe('10 Clean Code Principles Every Developer Should Follow');
    expect(article.content.toString()).toContain('Clean code is not just about making the code work');
    expect(article.bookIds.toString()).toBe('cc8d8194-e099-4e3a-a431-6b4412dc5f6a,7d7f60ce-5a49-4be7-8c5e-c4b4375087c8');
    expect(article.createdAt).toBe(now);
    expect(article.updatedAt).toBe(now);
  });

  it('should create an article event when created', () => {
    const article = ArticleMother.create();
    const events = article.pullDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('article.created');
  });

  it('should update article properties', () => {
    const article = ArticleMother.create();
    const newTitle = ArticleTitleMother.create('Updated Title');
    const newContent = ArticleContentMother.create('Updated Content');
    const newBookIds = ArticleBookIdsMother.create(['book-2', 'book-3']);

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
    const article = ArticleMother.create();
    article.update({
      title: ArticleTitleMother.create('Updated Title'),
      content: ArticleContentMother.create('Updated Content'),
      bookIds: ArticleBookIdsMother.create(['book-2'])
    });
    
    const events = article.pullDomainEvents();
    expect(events).toHaveLength(2);
    expect(events[1].eventName).toBe('article.updated');
  });

  it('should convert to primitives', () => {
    const now = new Date();
    const article = ArticleMother.withDates(now, now);
    const primitives = article.toPrimitives();

    expect(primitives).toEqual({
      id: article.id.toString(),
      title: '10 Clean Code Principles Every Developer Should Follow',
      content: expect.stringContaining('Clean code is not just about making the code work'),
      bookIds: ['cc8d8194-e099-4e3a-a431-6b4412dc5f6a', '7d7f60ce-5a49-4be7-8c5e-c4b4375087c8'],
      createdAt: now,
      updatedAt: now
    });
  });

  it('should not create article with empty title', () => {
    expect(() => {
      ArticleMother.create(
        undefined,
        ArticleTitleMother.empty()
      );
    }).toThrow(ArticleTitleEmpty);
  });

  it('should not create article with empty content', () => {
    expect(() => {
      ArticleMother.create(
        undefined,
        undefined,
        ArticleContentMother.empty()
      );
    }).toThrow(ArticleContentEmpty);
  });

  it('should not create article without book ids', () => {
    expect(() => {
      ArticleMother.create(
        undefined,
        undefined,
        undefined,
        ArticleBookIdsMother.empty()
      );
    }).toThrow(ArticleBookIdsEmpty);
  });
});
