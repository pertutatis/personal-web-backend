import { BookTitle } from '../BookTitle';
import { BookTitleEmpty } from '../BookTitleEmpty';
import { BookTitleLengthExceeded } from '../BookTitleLengthExceeded';

describe('BookTitle', () => {
  it('should create a valid book title', () => {
    const title = 'Test Book Title';
    const bookTitle = BookTitle.create(title);
    expect(bookTitle.toString()).toBe(title);
  });

  it('should fail when title is empty', () => {
    expect(() => BookTitle.create('')).toThrow(BookTitleEmpty);
    expect(() => BookTitle.create('   ')).toThrow(BookTitleEmpty);
  });

  it('should fail when title exceeds 255 characters', () => {
    const longTitle = 'a'.repeat(256);
    expect(() => BookTitle.create(longTitle)).toThrow(BookTitleLengthExceeded);
  });

  it('should accept titles with exactly 255 characters', () => {
    const maxTitle = 'a'.repeat(255);
    const bookTitle = BookTitle.create(maxTitle);
    expect(bookTitle.toString()).toBe(maxTitle);
  });

  it('should maintain special characters and spaces', () => {
    const specialTitle = '¡The Amazing Book! (2nd Edition) - Vol. 1';
    const bookTitle = BookTitle.create(specialTitle);
    expect(bookTitle.toString()).toBe(specialTitle);
  });

  it('should trim whitespace', () => {
    const untrimmedTitle = '  Book Title  ';
    const bookTitle = BookTitle.create(untrimmedTitle);
    expect(bookTitle.toString()).toBe('Book Title');
  });
});
