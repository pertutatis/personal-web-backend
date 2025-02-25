import { BookTitle } from '../BookTitle';
import { BookTitleEmpty } from '../BookTitleEmpty';
import { BookTitleLengthExceeded } from '../BookTitleLengthExceeded';

describe('BookTitle', () => {
  it('should create a valid book title', () => {
    const title = 'Clean Architecture';
    const bookTitle = new BookTitle(title);
    expect(bookTitle.value).toBe(title);
  });

  it('should fail when title is empty', () => {
    expect(() => new BookTitle('')).toThrow(BookTitleEmpty);
  });

  it('should fail when title exceeds 255 characters', () => {
    const longTitle = 'a'.repeat(256);
    expect(() => new BookTitle(longTitle)).toThrow(BookTitleLengthExceeded);
  });

  it('should accept titles with exactly 255 characters', () => {
    const title = 'a'.repeat(255);
    const bookTitle = new BookTitle(title);
    expect(bookTitle.value).toBe(title);
  });

  it('should maintain special characters and spaces', () => {
    const title = 'Design Patterns: Elements of Reusable Object-Oriented Software';
    const bookTitle = new BookTitle(title);
    expect(bookTitle.value).toBe(title);
  });
});
