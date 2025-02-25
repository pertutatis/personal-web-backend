import { BookIsbn } from '../BookIsbn';
import { InvalidBookIsbn } from '../InvalidBookIsbn';

describe('BookIsbn', () => {
  it('should create a valid ISBN-10', () => {
    const isbn = '0-7475-3269-9';  // Harry Potter ISBN-10
    const bookIsbn = new BookIsbn(isbn);
    expect(bookIsbn.value).toBe('0747532699');
  });

  it('should create a valid ISBN-13', () => {
    const isbn = '978-0-7475-3269-9';  // Harry Potter ISBN-13
    const bookIsbn = new BookIsbn(isbn);
    expect(bookIsbn.value).toBe('9780747532699');
  });

  it('should fail with invalid ISBN-10', () => {
    const invalidIsbn = '0-7475-3269-0'; // Wrong checksum
    expect(() => new BookIsbn(invalidIsbn)).toThrow(InvalidBookIsbn);
  });

  it('should fail with invalid ISBN-13', () => {
    const invalidIsbn = '978-0-7475-3269-0'; // Wrong checksum
    expect(() => new BookIsbn(invalidIsbn)).toThrow(InvalidBookIsbn);
  });

  it('should accept ISBN with spaces', () => {
    const isbn = '0 7475 3269 9';
    const bookIsbn = new BookIsbn(isbn);
    expect(bookIsbn.value).toBe('0747532699');
  });

  it('should fail with invalid format', () => {
    const invalidIsbn = '123456789';
    expect(() => new BookIsbn(invalidIsbn)).toThrow(InvalidBookIsbn);
  });

  it('should accept ISBN-10 with X checksum', () => {
    const isbn = '0-9752298-0-X';
    const bookIsbn = new BookIsbn(isbn);
    expect(bookIsbn.value).toBe('097522980X');
  });

  it('should fail with letters in wrong position', () => {
    const invalidIsbn = '0-X475-3269-9';
    expect(() => new BookIsbn(invalidIsbn)).toThrow(InvalidBookIsbn);
  });

  it('should store ISBN in canonical form', () => {
    const variants = [
      '0-7475-3269-9',
      '0 7475 3269 9',
      '0747532699'
    ];

    const expected = '0747532699';
    variants.forEach(isbn => {
      expect(new BookIsbn(isbn).value).toBe(expected);
    });
  });
});
