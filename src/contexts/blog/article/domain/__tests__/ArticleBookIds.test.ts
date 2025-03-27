import { ArticleBookIds } from '../ArticleBookIds';

describe('ArticleBookIds', () => {
  it('should create valid article book ids', () => {
    const ids = ArticleBookIds.fromValues(['book-1', 'book-2']);
    expect(ids.length).toBe(2);
  });

  it('should accept empty book ids array', () => {
    const ids = ArticleBookIds.createEmpty();
    expect(ids.isEmpty).toBe(true);
  });

  it('should create with book ids array', () => {
    const bookIds = ['book-1', 'book-2'];
    const ids = ArticleBookIds.fromValues(bookIds);
    expect(ids.length).toBe(2);
    bookIds.forEach(id => {
      expect(ids.includes(id)).toBe(true);
    });
  });

  it('should throw error when exceeding max book ids', () => {
    const bookIds = Array.from({ length: ArticleBookIds.MAX_BOOK_IDS + 1 }, 
      (_, i) => `book-${i + 1}`
    );
    expect(() => ArticleBookIds.fromValues(bookIds))
      .toThrow(`Maximum of ${ArticleBookIds.MAX_BOOK_IDS} book ids allowed`);
  });

  it('should maintain immutability', () => {
    const initialIds = ['book-1', 'book-2'];
    const ids = ArticleBookIds.fromValues(initialIds);
    
    const modifiedIds = ids.getValue();
    modifiedIds.push('book-3');

    expect(ids.length).toBe(2);
    expect(ids.includes('book-3')).toBe(false);
  });

  it('should add book id', () => {
    const ids = ArticleBookIds.fromValues(['book-1']);
    const updatedIds = ids.add('book-2');
    
    expect(updatedIds.length).toBe(2);
    expect(updatedIds.includes('book-2')).toBe(true);
    expect(ids.length).toBe(1);
  });

  it('should implement equals correctly', () => {
    const ids1 = ArticleBookIds.fromValues(['book-1', 'book-2']);
    const ids2 = ArticleBookIds.fromValues(['book-1', 'book-2']);
    const ids3 = ArticleBookIds.fromValues(['book-3', 'book-4']);
    
    expect(ids1.equals(ids2)).toBe(true);
    expect(ids1.equals(ids3)).toBe(false);
    expect(ids1.equals(null as any)).toBe(false);
    expect(ids1.equals({} as any)).toBe(false);
  });

  it('should handle order-independent equality', () => {
    const ids1 = ArticleBookIds.fromValues(['book-1', 'book-2']);
    const ids2 = ArticleBookIds.fromValues(['book-2', 'book-1']);
    
    expect(ids1.equals(ids2)).toBe(true);
  });
});
