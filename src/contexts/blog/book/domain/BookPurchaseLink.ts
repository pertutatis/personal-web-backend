import { BookPurchaseLinkInvalid } from './BookPurchaseLinkInvalid';
import { BookPurchaseLinkLengthExceeded } from './BookPurchaseLinkLengthExceeded';

export class BookPurchaseLink {
  static readonly MAX_LENGTH = 2000;

  private constructor(public readonly value: string | null) {}

  private static validateUrl(url: string): void {
    if (url.length > BookPurchaseLink.MAX_LENGTH) {
      throw new BookPurchaseLinkLengthExceeded(url.length);
    }

    try {
      const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
      if (!urlPattern.test(url)) {
        throw new Error('Invalid URL format');
      }

      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      throw new BookPurchaseLinkInvalid(url);
    }
  }

  static create(value: string | null | undefined): BookPurchaseLink {
    if (value === null || value === undefined) {
      return new BookPurchaseLink(null);
    }

    const trimmedValue = value.trim();
    this.validateUrl(trimmedValue);
    return new BookPurchaseLink(trimmedValue);
  }
}
