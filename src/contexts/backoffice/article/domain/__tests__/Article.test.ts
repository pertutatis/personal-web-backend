import { Article } from '../Article';
import { ArticleMother } from './mothers/ArticleMother';
import { ArticleRelatedLinksMother } from './mothers/ArticleRelatedLinksMother';
import { ArticleId } from '../ArticleId';
import { ArticleSlug } from '../ArticleSlug';
import { ArticleTitle } from '../ArticleTitle';
import { ArticleExcerpt } from '../ArticleExcerpt';
import { ArticleContent } from '../ArticleContent';
import { ArticleBookIds } from '../ArticleBookIds';

describe('Article', () => {
  const id = new ArticleId('cc8d8194-e099-4e3a-a431-6b4412dc5f6a');
  const slug = new ArticleSlug('test-article');
  const title = new ArticleTitle('Test Article');
  const excerpt = new ArticleExcerpt('Test excerpt');
  const content = new ArticleContent('Test content');
  const createdAt = new Date();
  const updatedAt = new Date();

  it('should create article with all required fields', () => {
    const emptyBookIds = ArticleBookIds.createEmpty();
    const article = Article.create({
      id,
      slug,
      title,
      excerpt,
      content,
      bookIds: emptyBookIds,
      relatedLinks: ArticleRelatedLinksMother.createEmpty(),
      createdAt,
      updatedAt
    });

    expect(article.id.equals(id)).toBe(true);
    expect(article.slug.value).toBe(slug.value);
    expect(article.title.value).toBe(title.value);
    expect(article.excerpt.value).toBe(excerpt.value);
    expect(article.content.value).toBe(content.value);
    expect(article.relatedLinks.isEmpty).toBe(true);
    expect(article.bookIds.isEmpty).toBe(true);
  });

  it('should create with empty book ids', () => {
    const emptyBookIds = ArticleBookIds.createEmpty();
    const article = Article.create({
      id,
      slug,
      title,
      excerpt,
      content,
      bookIds: emptyBookIds,
      relatedLinks: ArticleRelatedLinksMother.createEmpty(),
      createdAt,
      updatedAt
    });

    expect(article.bookIds.isEmpty).toBe(true);
  });

  it('should create with book ids', () => {
    const bookIds = ArticleBookIds.create(['book-1', 'book-2']);
    const article = Article.create({
      id,
      slug,
      title,
      excerpt,
      content,
      bookIds,
      relatedLinks: ArticleRelatedLinksMother.createEmpty(),
      createdAt,
      updatedAt
    });

    expect(article.bookIds.getValue()).toEqual(['book-1', 'book-2']);
  });

  it('should handle related links', () => {
    const emptyBookIds = ArticleBookIds.createEmpty();
    const article = Article.create({
      id,
      slug,
      title,
      excerpt,
      content,
      bookIds: emptyBookIds,
      relatedLinks: ArticleRelatedLinksMother.createMax(),
      createdAt,
      updatedAt
    });

    expect(article.relatedLinks.length).toBe(10);
  });

  it('should allow empty related links', () => {
    const emptyBookIds = ArticleBookIds.createEmpty();
    const article = Article.create({
      id,
      slug,
      title,
      excerpt,
      content,
      bookIds: emptyBookIds,
      relatedLinks: ArticleRelatedLinksMother.createEmpty(),
      createdAt,
      updatedAt
    });

    expect(article.relatedLinks.isEmpty).toBe(true);
  });

  it('should update fields', () => {
    const article = ArticleMother.create();
    const newTitle = new ArticleTitle('New Title');

    const updatedArticle = article.update({
      title: newTitle
    });

    expect(updatedArticle.title.equals(newTitle)).toBe(true);
    expect(updatedArticle.id.equals(article.id)).toBe(true);
  });
});
