import { BookAuthor } from '../BookAuthor';
import { BookAuthorEmpty } from '../BookAuthorEmpty';
import { BookAuthorLengthExceeded } from '../BookAuthorLengthExceeded';
import { BookAuthorMother } from './mothers/BookAuthorMother';

describe('BookAuthor', () => {
  it('should create a valid book author', () => {
    const author = BookAuthorMother.create();
    expect(author.value).toBe('Robert C. Martin');
  });

  it('should throw error when author is empty', () => {
    expect(() => BookAuthorMother.empty()).toThrow(BookAuthorEmpty);
  });

  it('should throw error when author is only spaces', () => {
    expect(() => BookAuthorMother.withSpacesOnly()).toThrow(BookAuthorEmpty);
  });

  it('should throw error when author exceeds maximum length', () => {
    expect(() => BookAuthorMother.tooLong()).toThrow(BookAuthorLengthExceeded);
  });

  it('should accept author name with special characters', () => {
    const author = BookAuthorMother.withSpecialCharacters();
    expect(author.value).toBe('Gabriel García Márquez');
  });

  it('should trim whitespace from author name', () => {
    const author = BookAuthorMother.withWhitespace();
    expect(author.value).toBe('John Doe');
  });

  it('should create author with exactly maximum length', () => {
    const author = BookAuthorMother.maxLength();
    expect(author.value.length).toBe(BookAuthor.MAX_LENGTH);
  });

  it('should be comparable with other BookAuthor instances', () => {
    const author1 = BookAuthorMother.create('John Doe');
    const author2 = BookAuthorMother.sameAs('John Doe');
    const author3 = BookAuthorMother.create('Jane Doe');

    expect(author1.equals(author2)).toBe(true);
    expect(author1.equals(author3)).toBe(false);
  });

  it('should retain original value after creation', () => {
    const authorName = 'John Doe';
    const author = BookAuthorMother.create(authorName);
    expect(author.value).toBe(authorName);
  });
});
