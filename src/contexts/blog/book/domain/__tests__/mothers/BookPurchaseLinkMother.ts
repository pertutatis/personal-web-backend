import { BookPurchaseLink } from '../../BookPurchaseLink';

export class BookPurchaseLinkMother {
  static create(value: string = 'https://example.com/book'): BookPurchaseLink {
    return BookPurchaseLink.create(value);
  }

  static random(): BookPurchaseLink {
    const randomPath = Math.random().toString(36).substring(7);
    return BookPurchaseLink.create(`https://example.com/book/${randomPath}`);
  }

  static tooLong(): string {
    return `https://example.com/${'a'.repeat(2000)}`;
  }

  static invalid(): string {
    return 'not-a-valid-url';
  }

  static empty(): null {
    return null;
  }

  static withQueryParams(): BookPurchaseLink {
    return BookPurchaseLink.create('https://example.com/book?id=123&ref=test');
  }

  static withFragment(): BookPurchaseLink {
    return BookPurchaseLink.create('https://example.com/book#section1');
  }

  static atMaxLength(): BookPurchaseLink {
    const path = 'a'.repeat(1987); // 2000 - 'https://example.com/'.length
    return BookPurchaseLink.create(`https://example.com/${path}`);
  }

  static http(): BookPurchaseLink {
    return BookPurchaseLink.create('http://example.com/book');
  }

  static https(): BookPurchaseLink {
    return BookPurchaseLink.create('https://example.com/book');
  }
}
