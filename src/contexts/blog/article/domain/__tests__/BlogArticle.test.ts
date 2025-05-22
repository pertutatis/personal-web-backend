import { BlogArticleMother } from './mothers/BlogArticleMother';
import { BlogBookMother } from './mothers/BlogBookMother';
import { BlogArticle } from '../BlogArticle';

describe('BlogArticle', () => {
  it('should create a BlogArticle with all properties', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const title = 'Writing Clean Code';
    const excerpt = 'Learn how to write maintainable code';
    const content = 'Full article content about clean code';
    const books = BlogBookMother.createMultiple(2);
    const relatedLinks = [
      { text: 'Clean Code Book', url: 'https://example.com/book' }
    ];
    const slug = 'writing-clean-code';
    const createdAt = new Date('2024-01-01');
    const updatedAt = new Date('2024-01-02');

    const article = new BlogArticle(
      id,
      title,
      excerpt,
      content,
      books,
      relatedLinks,
      slug,
      createdAt,
      updatedAt
    );

    expect(article.id).toBe(id);
    expect(article.title).toBe(title);
    expect(article.excerpt).toBe(excerpt);
    expect(article.content).toBe(content);
    expect(article.books).toEqual(books);
    expect(article.relatedLinks).toEqual(relatedLinks);
    expect(article.slug).toBe(slug);
    expect(article.createdAt).toBe(createdAt);
    expect(article.updatedAt).toBe(updatedAt);
  });

  it('should create a BlogArticle without books', () => {
    const article = BlogArticleMother.withoutBooks();

    expect(article.books).toHaveLength(0);
    expect(article.hasBooks()).toBe(false);
  });

  it('should create a BlogArticle without related links', () => {
    const article = BlogArticleMother.withoutRelatedLinks();

    expect(article.relatedLinks).toHaveLength(0);
    expect(article.hasRelatedLinks()).toBe(false);
  });

  it('should be immutable', () => {
    const original = BlogArticleMother.create();
    const clone = original.clone();

    expect(original).not.toBe(clone); // Different instances
    expect(original.equals(clone)).toBe(true); // Same content
    expect(original).toEqual(clone); // Deep equality

    // Verify books are also cloned
    expect(original.books[0]).not.toBe(clone.books[0]);
    expect(original.books[0]).toEqual(clone.books[0]);

    // Verify relatedLinks are cloned
    expect(original.relatedLinks).not.toBe(clone.relatedLinks);
    expect(original.relatedLinks).toEqual(clone.relatedLinks);
  });

  it('should find a book by ID', () => {
    const books = BlogBookMother.createMultiple(3);
    const article = BlogArticleMother.create(
      'article-1',
      'Test Article',
      'Excerpt',
      'Content',
      books
    );

    const foundBook = article.findBook(books[1].id);
    const notFoundBook = article.findBook('non-existent-id');

    expect(foundBook).toBeDefined();
    expect(foundBook).toEqual(books[1]);
    expect(notFoundBook).toBeUndefined();
  });

  it('should create multiple unique articles', () => {
    const articles = BlogArticleMother.createMultiple(3);

    expect(articles).toHaveLength(3);
    expect(articles[0].id).not.toBe(articles[1].id);
    expect(articles[1].id).not.toBe(articles[2].id);
    expect(articles[0].title).toBe('Article 1');
    expect(articles[1].title).toBe('Article 2');
    expect(articles[2].title).toBe('Article 3');

    // Each article should have its own books
    articles.forEach(article => {
      expect(article.hasBooks()).toBe(true);
      expect(article.books).toHaveLength(2);
    });
  });
});
