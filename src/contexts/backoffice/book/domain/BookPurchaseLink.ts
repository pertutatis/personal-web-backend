import { BookPurchaseLinkInvalid } from './BookPurchaseLinkInvalid';
import { BookPurchaseLinkLengthExceeded } from './BookPurchaseLinkLengthExceeded';

export class BookPurchaseLink {
  static readonly MAX_LENGTH = 2000;

  private constructor(private readonly _value: string | null) {
    Object.freeze(this);
  }

  static create(value: string | null): BookPurchaseLink {
    if (value === null) {
      return this.createEmpty();
    }
    const trimmedValue = value.trim();
    this.validate(trimmedValue);
    return new BookPurchaseLink(trimmedValue || null);
  }

  static createEmpty(): BookPurchaseLink {
    return new BookPurchaseLink(null);
  }

  private static validate(value: string): void {
    if (value && value.length > BookPurchaseLink.MAX_LENGTH) {
      throw new BookPurchaseLinkLengthExceeded(value);
    }

    if (value && !this.isValidUrl(value)) {
      throw new BookPurchaseLinkInvalid(value);
    }
  }

  private static isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  isEmpty(): boolean {
    return this._value === null || this._value === '';
  }

  get value(): string | null {
    return this._value;
  }

  getValue(): string | null {
    return this._value;
  }

  equals(other: BookPurchaseLink | null): boolean {
    if (!other) {
      return this.isEmpty();
    }
    return this._value === other._value;
  }

  toString(): string {
    return this._value || '';
  }

  toJSON(): string | null {
    return this._value;
  }
}
