import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { InvalidBookIsbn } from './InvalidBookIsbn';

export class BookIsbn extends StringValueObject {
  static create(value: string): BookIsbn {
    const cleanedValue = value.replace(/[-\s]/g, '').toUpperCase();
    
    if (!this.isValidISBN(cleanedValue)) {
      throw new InvalidBookIsbn();
    }

    return new BookIsbn(cleanedValue);
  }

  private static isValidISBN(isbn: string): boolean {
    // ISBN-10 validation
    if (isbn.length === 10) {
      return this.isValidISBN10(isbn);
    }

    // ISBN-13 validation
    if (isbn.length === 13) {
      return this.isValidISBN13(isbn);
    }

    return false;
  }

  private static isValidISBN10(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      const digit = parseInt(isbn[i], 10);
      if (isNaN(digit)) return false;
      sum += digit * (10 - i);
    }

    // Check digit can be 'X' or a number
    const lastChar = isbn[9].toUpperCase();
    const checkDigit = lastChar === 'X' ? 10 : parseInt(lastChar, 10);
    if (isNaN(checkDigit) && lastChar !== 'X') return false;

    sum += checkDigit;
    return sum % 11 === 0;
  }

  private static isValidISBN13(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(isbn[i], 10);
      if (isNaN(digit)) return false;
      sum += (i % 2 === 0) ? digit : digit * 3;
    }

    const checkDigit = parseInt(isbn[12], 10);
    if (isNaN(checkDigit)) return false;

    const calculatedCheck = (10 - (sum % 10)) % 10;
    return checkDigit === calculatedCheck;
  }
}
