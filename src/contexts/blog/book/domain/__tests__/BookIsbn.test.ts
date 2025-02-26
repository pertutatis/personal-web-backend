import { BookIsbn } from '../BookIsbn';
import { InvalidBookIsbn } from '../InvalidBookIsbn';

describe('BookIsbn', () => {
  it('should create a valid ISBN-10', () => {
    const isbn = '0747532699';  // Harry Potter ISBN-10
    const bookIsbn = BookIsbn.create(isbn);
    expect(bookIsbn.toString()).toBe(isbn);
  });

  it('should create a valid ISBN-13', () => {
    const isbn = '9780747532699';  // Harry Potter ISBN-13
    const bookIsbn = BookIsbn.create(isbn);
    expect(bookIsbn.toString()).toBe(isbn);
  });

  it('should fail with invalid ISBN-10', () => {
    const invalidIsbn = '0747532690'; // Wrong checksum
    expect(() => BookIsbn.create(invalidIsbn)).toThrow(InvalidBookIsbn);
  });

  it('should fail with invalid ISBN-13', () => {
    const invalidIsbn = '9780747532690'; // Wrong checksum
    expect(() => BookIsbn.create(invalidIsbn)).toThrow(InvalidBookIsbn);
  });

  it('should accept ISBN with hyphens', () => {
    const isbn = '0-7475-3269-9';
    const bookIsbn = BookIsbn.create(isbn);
    expect(bookIsbn.toString()).toBe('0747532699');
  });

  it('should fail with invalid format', () => {
    const invalidIsbn = '123456789';
    expect(() => BookIsbn.create(invalidIsbn)).toThrow(InvalidBookIsbn);
  });

  it('should accept ISBN-10 with X checksum', () => {
    const isbn = '097522980X';
    const bookIsbn = BookIsbn.create(isbn);
    expect(bookIsbn.toString()).toBe(isbn);
  });

  it('should fail with letters in wrong position', () => {
    const invalidIsbn = '0X4753269X';
    expect(() => BookIsbn.create(invalidIsbn)).toThrow(InvalidBookIsbn);
  });

  it('should normalize ISBN format', () => {
    const variants = [
      '0-7475-3269-9',
      '0 7475 3269 9',
      '0747532699'
    ];
    const expected = '0747532699';
    variants.forEach(isbn => {
      expect(BookIsbn.create(isbn).toString()).toBe(expected);
    });
  });
});
