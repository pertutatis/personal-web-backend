import { ArticleBookIds } from '../ArticleBookIds';
import { ArticleBookIdsEmpty } from '../ArticleBookIdsEmpty';

describe('ArticleBookIds', () => {
  it('should create valid article book ids', () => {
    const bookIds = ['book-1', 'book-2'];
    const articleBookIds = ArticleBookIds.create(bookIds);
    expect(articleBookIds.value).toEqual(bookIds);
  });

  it('should throw error when book ids array is empty', () => {
    expect(() => {
      ArticleBookIds.create([]);
    }).toThrow(ArticleBookIdsEmpty);
  });

  it('should remove duplicate book ids', () => {
    const bookIds = ['book-1', 'book-2', 'book-1', 'book-2'];
    const articleBookIds = ArticleBookIds.create(bookIds);
    expect(articleBookIds.value).toEqual(['book-1', 'book-2']);
  });

  it('should maintain order after removing duplicates', () => {
    const bookIds = ['book-2', 'book-1', 'book-2', 'book-3'];
    const articleBookIds = ArticleBookIds.create(bookIds);
    expect(articleBookIds.value).toEqual(['book-2', 'book-1', 'book-3']);
  });
});
