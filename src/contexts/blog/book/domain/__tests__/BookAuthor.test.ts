import { BookAuthor } from '../BookAuthor';
import { BookAuthorEmpty } from '../BookAuthorEmpty';
import { BookAuthorLengthExceeded } from '../BookAuthorLengthExceeded';

describe('BookAuthor', () => {
  it('should create a valid book author', () => {
    const author = 'Robert C. Martin';
    const bookAuthor = new BookAuthor(author);
    expect(bookAuthor.value).toBe(author);
  });

  it('should fail when author is empty', () => {
    expect(() => new BookAuthor('')).toThrow(BookAuthorEmpty);
  });

  it('should fail when author exceeds 255 characters', () => {
    const longAuthor = 'a'.repeat(256);
    expect(() => new BookAuthor(longAuthor)).toThrow(BookAuthorLengthExceeded);
  });

  it('should accept authors with exactly 255 characters', () => {
    const author = 'a'.repeat(255);
    const bookAuthor = new BookAuthor(author);
    expect(bookAuthor.value).toBe(author);
  });

  it('should maintain special characters and spaces', () => {
    const author = 'Erich Gamma, Richard Helm, Ralph Johnson & John Vlissides';
    const bookAuthor = new BookAuthor(author);
    expect(bookAuthor.value).toBe(author);
  });
});
