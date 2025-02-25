import { Article } from '../Article';
import { ArticleId } from '../ArticleId';
import { ArticleTitle } from '../ArticleTitle';
import { ArticleContent } from '../ArticleContent';
import { ArticleBookIds } from '../ArticleBookIds';

describe('Article', () => {
  const validId = ArticleId.create('valid-id');
  const validTitle = ArticleTitle.create('Valid Title');
  const validContent = ArticleContent.create('Valid content for the article');
  const validBookIds = ArticleBookIds.create(['book-1', 'book-2']);

  it('should create a valid article', () => {
    const article = Article.create({
      id: validId,
      title: validTitle,
      content: validContent,
      bookIds: validBookIds,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    expect(article.id).toBe(validId);
    expect(article.title).toBe(validTitle);
    expect(article.content).toBe(validContent);
    expect(article.bookIds).toBe(validBookIds);
    expect(article.createdAt).toBeInstanceOf(Date);
    expect(article.updatedAt).toBeInstanceOf(Date);
  });

  it('should update article properties', () => {
    const article = Article.create({
      id: validId,
      title: validTitle,
      content: validContent,
      bookIds: validBookIds,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const newTitle = ArticleTitle.create('New Title');
    const newContent = ArticleContent.create('New content');
    const newBookIds = ArticleBookIds.create(['book-3']);

    article.update({
      title: newTitle,
      content: newContent,
      bookIds: newBookIds
    });

    expect(article.title).toBe(newTitle);
    expect(article.content).toBe(newContent);
    expect(article.bookIds).toBe(newBookIds);
  });

  it('should convert to primitives', () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const article = Article.create({
      id: validId,
      title: validTitle,
      content: validContent,
      bookIds: validBookIds,
      createdAt,
      updatedAt
    });

    const primitives = article.toPrimitives();

    expect(primitives).toEqual({
      id: validId.value,
      title: validTitle.value,
      content: validContent.value,
      bookIds: validBookIds.value,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString()
    });
  });
});
