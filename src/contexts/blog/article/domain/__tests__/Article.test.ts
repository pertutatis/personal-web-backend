import { ArticleTitleEmpty } from '../ArticleTitleEmpty';
import { ArticleContentEmpty } from '../ArticleContentEmpty';
import { ArticleExcerptEmpty } from '../ArticleExcerptEmpty';
import { ArticleBookIdsEmpty } from '../ArticleBookIdsEmpty';
import { ArticleMother } from './mothers/ArticleMother';
import { ArticleTitleMother } from './mothers/ArticleTitleMother';
import { ArticleContentMother } from './mothers/ArticleContentMother';
import { ArticleExcerptMother } from './mothers/ArticleExcerptMother';
import { ArticleBookIdsMother } from './mothers/ArticleBookIdsMother';
import { ArticleExcerpt } from '../ArticleExcerpt';

describe('Article', () => {
  it('should create a valid article', () => {
    const now = new Date();
    const article = ArticleMother.withDates(now, now);

    expect(article.id.toString()).toBeDefined();
    expect(article.title.toString()).toBe('10 Clean Code Principles Every Developer Should Follow');
    expect(article.excerpt.toString()).toBe('A guide to writing clean, maintainable code');
    expect(article.content.toString()).toContain('Clean code is not just about making the code work');
    expect(article.bookIds.toString()).toBe('cc8d8194-e099-4e3a-a431-6b4412dc5f6a,7d7f60ce-5a49-4be7-8c5e-c4b4375087c8');
    expect(article.createdAt.toISOString()).toBe(now.toISOString());
    expect(article.updatedAt.toISOString()).toBe(now.toISOString());
  });

  it('should create an article event when created', () => {
    const article = ArticleMother.create();
    const events = article.pullDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('article.created');
  });

  it('should update article properties and timestamp', () => {
    const createdAt = new Date('2025-01-01T00:00:00Z');
    const article = ArticleMother.withDates(createdAt, createdAt);
    const newTitle = ArticleTitleMother.create('Updated Title');
    const newExcerpt = ArticleExcerpt.create('Updated Excerpt');
    const newContent = ArticleContentMother.create('Updated Content');
    const newBookIds = ArticleBookIdsMother.create(['book-2', 'book-3']);

    const updatedArticle = article.update({
      title: newTitle,
      excerpt: newExcerpt,
      content: newContent,
      bookIds: newBookIds
    });

    expect(updatedArticle.title.toString()).toBe('Updated Title');
    expect(updatedArticle.excerpt.toString()).toBe('Updated Excerpt');
    expect(updatedArticle.content.toString()).toBe('Updated Content');
    expect(updatedArticle.bookIds.toString()).toBe('book-2,book-3');
    expect(updatedArticle.createdAt).toEqual(createdAt);
    expect(updatedArticle.updatedAt.getTime()).toBeGreaterThan(createdAt.getTime());
  });

  it('should create an updated event when updated', () => {
    const createdAt = new Date('2025-01-01T00:00:00Z');
    const article = ArticleMother.withDates(createdAt, createdAt);
    const newTitle = ArticleTitleMother.create('Updated Title');

    const updatedArticle = article.update({
      title: newTitle
    });
    
    // The article should have only the update event
    const events = updatedArticle.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('article.updated');
  });

  it('should convert to primitives', () => {
    const now = new Date();
    const article = ArticleMother.withDates(now, now);
    const primitives = article.toPrimitives();

    expect(primitives).toEqual({
      id: article.id.toString(),
      title: '10 Clean Code Principles Every Developer Should Follow',
      excerpt: 'A guide to writing clean, maintainable code',
      content: expect.stringContaining('Clean code is not just about making the code work'),
      bookIds: ['cc8d8194-e099-4e3a-a431-6b4412dc5f6a', '7d7f60ce-5a49-4be7-8c5e-c4b4375087c8'],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    });
  });

  it('should not create article with empty title', () => {
    expect(() => {
      ArticleTitleMother.create('');
    }).toThrow(ArticleTitleEmpty);
  });

  it('should not create article with empty excerpt', () => {
    expect(() => {
      ArticleExcerpt.create('');
    }).toThrow(ArticleExcerptEmpty);
  });

  it('should not create article with empty content', () => {
    expect(() => {
      ArticleContentMother.create('');
    }).toThrow(ArticleContentEmpty);
  });

  it('should allow article creation without book ids', () => {
    const article = ArticleMother.create(
      undefined,
      undefined,
      undefined,
      undefined,
      ArticleBookIdsMother.empty()
    );
    expect(article.bookIds.getValue()).toEqual([]);
  });
});
