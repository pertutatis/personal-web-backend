import { BookAuthor } from '../BookAuthor';
import { BookAuthorEmpty } from '../BookAuthorEmpty';
import { BookAuthorLengthExceeded } from '../BookAuthorLengthExceeded';

describe('BookAuthor', () => {
  it('should create a valid book author', () => {
    const author = BookAuthor.create('John Doe');
    expect(author.value).toBe('John Doe');
  });

  it('should throw error when author is empty', () => {
    expect(() => BookAuthor.create('')).toThrow(BookAuthorEmpty);
  });

  it('should throw error when author is only spaces', () => {
    expect(() => BookAuthor.create('   ')).toThrow(BookAuthorEmpty);
  });

  it('should throw error when author exceeds maximum length', () => {
    const longAuthor = 'a'.repeat(101); // Max length is 100
    expect(() => BookAuthor.create(longAuthor)).toThrow(BookAuthorLengthExceeded);
  });

  it('should accept author name with special characters', () => {
    const author = BookAuthor.create('Gabriel García Márquez');
    expect(author.value).toBe('Gabriel García Márquez');
  });

  it('should trim whitespace from author name', () => {
    const author = BookAuthor.create('  John Doe  ');
    expect(author.value).toBe('John Doe');
  });

  it('should create author with exactly maximum length', () => {
    const maxLengthAuthor = 'a'.repeat(100);
    const author = BookAuthor.create(maxLengthAuthor);
    expect(author.value).toBe(maxLengthAuthor);
  });

  it('should be comparable with other BookAuthor instances', () => {
    const author1 = BookAuthor.create('John Doe');
    const author2 = BookAuthor.create('John Doe');
    const author3 = BookAuthor.create('Jane Doe');

    expect(author1.equals(author2)).toBe(true);
    expect(author1.equals(author3)).toBe(false);
  });

  it('should retain original value after creation', () => {
    const authorName = 'John Doe';
    const author = BookAuthor.create(authorName);
    expect(author.value).toBe(authorName);
  });
});
