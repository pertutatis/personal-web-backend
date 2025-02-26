import { BookTitle } from '../BookTitle';
import { BookTitleEmpty } from '../BookTitleEmpty';
import { BookTitleLengthExceeded } from '../BookTitleLengthExceeded';
import { BookTitleMother } from './mothers/BookTitleMother';

describe('BookTitle', () => {
  it('should create a valid book title', () => {
    const title = BookTitleMother.create();
    expect(title.toString()).toBe('Clean Code');
  });

  it('should fail when title is empty', () => {
    expect(() => BookTitleMother.empty()).toThrow(BookTitleEmpty);
    expect(() => BookTitleMother.withSpacesOnly()).toThrow(BookTitleEmpty);
  });

  it('should fail when title exceeds 255 characters', () => {
    expect(() => BookTitleMother.tooLong()).toThrow(BookTitleLengthExceeded);
  });

  it('should accept titles with exactly 255 characters', () => {
    const title = BookTitleMother.maxLength();
    expect(title.toString()).toBe('a'.repeat(255));
  });

  it('should maintain special characters and spaces', () => {
    const title = BookTitleMother.withSpecialCharacters();
    expect(title.toString()).toBe('¡The Amazing Book! (2nd Edition) - Vol. 1');
  });

  it('should trim whitespace', () => {
    const title = BookTitleMother.withWhitespace();
    expect(title.toString()).toBe('Book Title');
  });
});
