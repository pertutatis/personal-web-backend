import { ArticleBookIds } from '../ArticleBookIds';
import { ArticleBookIdsEmpty } from '../ArticleBookIdsEmpty';
import { ArticleBookIdsMother } from './mothers/ArticleBookIdsMother';

describe('ArticleBookIds', () => {
  it('should create valid article book ids', () => {
    const bookIds = ['book-1', 'book-2'];
    const articleBookIds = ArticleBookIdsMother.fromValues(bookIds);
    expect(articleBookIds.getValue()).toEqual(bookIds);
  });

  it('should accept empty book ids array', () => {
    const bookIds = ArticleBookIdsMother.empty();
    expect(bookIds.getValue()).toEqual([]);
  });

  it('should remove duplicate book ids', () => {
    const bookIds = ['book-1', 'book-2', 'book-1', 'book-2'];
    const articleBookIds = ArticleBookIdsMother.fromValues(bookIds);
    expect(articleBookIds.getValue()).toEqual(['book-1', 'book-2']);
  });

  it('should maintain order after removing duplicates', () => {
    const bookIds = ['book-2', 'book-1', 'book-2', 'book-3'];
    const articleBookIds = ArticleBookIdsMother.fromValues(bookIds);
    expect(articleBookIds.getValue()).toEqual(['book-2', 'book-1', 'book-3']);
  });
});
