import { BookIsbn } from '../BookIsbn';
import { InvalidBookIsbn } from '../InvalidBookIsbn';
import { BookIsbnMother } from './mothers/BookIsbnMother';

describe('BookIsbn', () => {
  it('should create a valid ISBN-10', () => {
    const isbn = BookIsbnMother.isbn10();
    expect(isbn.toFormattedString()).toBe('0-7475-3269-9');
  });

  it('should create a valid ISBN-13', () => {
    const isbn = BookIsbnMother.isbn13();
    expect(isbn.toFormattedString()).toBe('978-0-74-753269-9');
  });

  it('should fail with invalid ISBN-10', () => {
    expect(() => BookIsbnMother.invalidIsbn10()).toThrow(InvalidBookIsbn);
  });

  it('should fail with invalid ISBN-13', () => {
    expect(() => BookIsbnMother.invalidIsbn13()).toThrow(InvalidBookIsbn);
  });

  it('should accept ISBN with hyphens', () => {
    const isbn = BookIsbnMother.withHyphens();
    expect(isbn.toFormattedString()).toBe('0-7475-3269-9');
  });

  it('should fail with invalid format', () => {
    expect(() => BookIsbnMother.invalidFormat()).toThrow(InvalidBookIsbn);
  });

  it('should accept ISBN-10 with X checksum', () => {
    const isbn = BookIsbnMother.withXChecksum();
    expect(isbn.toString()).toBe('097522980X');
  });

  it('should fail with letters in wrong position', () => {
    expect(() => BookIsbnMother.withInvalidXPosition()).toThrow(InvalidBookIsbn);
  });

  it('should normalize ISBN format', () => {
    const withHyphens = BookIsbnMother.withHyphens();
    const withSpaces = BookIsbnMother.withSpaces();
    const withoutSeparators = BookIsbnMother.withoutSeparators();

    const expected = '0-7475-3269-9';
    
    expect(withHyphens.toFormattedString()).toBe(expected);
    expect(withSpaces.toFormattedString()).toBe(expected);
    expect(withoutSeparators.toFormattedString()).toBe(expected);
  });
});
