import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { InvalidBookIsbn } from './InvalidBookIsbn';

export class BookIsbn extends StringValueObject {
  private static readonly ISBN10_REGEX = /^\d{9}[\dX]$/;
  private static readonly ISBN13_REGEX = /^\d{13}$/;
  private originalFormat: string;

  constructor(value: string) {
    const normalized = BookIsbn.normalizeISBN(value);
    if (!BookIsbn.isValidISBN(normalized)) {
      throw new InvalidBookIsbn();
    }
    super(normalized);
    this.originalFormat = value;
  }

  static normalizeISBN(isbn: string): string {
    return isbn.replace(/[-\s]/g, '').toUpperCase();
  }

  private static calculateISBN10Checksum(digits: string): string {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += (10 - i) * parseInt(digits[i]);
    }
    const checksum = (11 - (sum % 11)) % 11;
    return checksum === 10 ? 'X' : checksum.toString();
  }

  private static calculateISBN13Checksum(digits: string): string {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += (i % 2 === 0 ? 1 : 3) * parseInt(digits[i]);
    }
    const checksum = (10 - (sum % 10)) % 10;
    return checksum.toString();
  }

  private static isValidISBN10(isbn: string): boolean {
    if (!this.ISBN10_REGEX.test(isbn)) {
      return false;
    }

    const digits = isbn.slice(0, 9);
    const expectedChecksum = isbn[9];
    const calculatedChecksum = this.calculateISBN10Checksum(digits);

    return expectedChecksum === calculatedChecksum;
  }

  private static isValidISBN13(isbn: string): boolean {
    if (!this.ISBN13_REGEX.test(isbn)) {
      return false;
    }

    const digits = isbn.slice(0, 12);
    const expectedChecksum = isbn[12];
    const calculatedChecksum = this.calculateISBN13Checksum(digits);

    return expectedChecksum === calculatedChecksum;
  }

  static isValidISBN(isbn: string): boolean {
    const normalized = this.normalizeISBN(isbn);
    return this.isValidISBN10(normalized) || this.isValidISBN13(normalized);
  }

  toString(): string {
    return this.value;
  }
  
  toFormattedString(): string {
    const isbn = this.value;
    
    // Mantener ISBN-10 con X sin guiones si ese era su formato original
    if (isbn.length === 10 && isbn.endsWith('X') && !this.originalFormat.includes('-')) {
      return isbn;
    }
    
    if (isbn.length === 10) {
      // Formato ISBN-10: 0-7475-3269-9 (1-4-4-1)
      return isbn.replace(/^(\d)(\d{4})(\d{4})(\d|X)$/, '$1-$2-$3-$4');
    }
    
    // Formato ISBN-13: 978-0-13-235088-4 (3-1-2-6-1)
    return isbn.replace(/^(\d{3})(\d)(\d{2})(\d{6})(\d)$/, '$1-$2-$3-$4-$5');
  }
}
