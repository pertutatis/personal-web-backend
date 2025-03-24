import { BookPurchaseLink } from '../BookPurchaseLink';
import { BookPurchaseLinkInvalid } from '../BookPurchaseLinkInvalid';
import { BookPurchaseLinkLengthExceeded } from '../BookPurchaseLinkLengthExceeded';

describe('BookPurchaseLink', () => {
  it('should create a valid book purchase link', () => {
    const url = 'https://example.com/book';
    const purchaseLink = BookPurchaseLink.create(url);

    expect(purchaseLink.value).toBe(url);
  });

  it('should allow null value', () => {
    const purchaseLink = BookPurchaseLink.create(null);

    expect(purchaseLink.value).toBeNull();
  });

  it('should allow undefined value', () => {
    const purchaseLink = BookPurchaseLink.create(undefined);

    expect(purchaseLink.value).toBeNull();
  });

  it('should fail with invalid URL format', () => {
    const invalidUrls = [
      'not-a-url',
      'ftp://example.com',
      'example.com',
      'http:/example.com',
      'https:example.com'
    ];

    invalidUrls.forEach(url => {
      expect(() => {
        BookPurchaseLink.create(url);
      }).toThrow(BookPurchaseLinkInvalid);
    });
  });

  it('should accept valid http URLs', () => {
    const url = 'http://example.com/book';
    const purchaseLink = BookPurchaseLink.create(url);

    expect(purchaseLink.value).toBe(url);
  });

  it('should accept valid https URLs', () => {
    const url = 'https://example.com/book';
    const purchaseLink = BookPurchaseLink.create(url);

    expect(purchaseLink.value).toBe(url);
  });

  it('should fail when URL length exceeds maximum', () => {
    const url = `https://example.com/${'a'.repeat(2000)}`;

    expect(() => {
      BookPurchaseLink.create(url);
    }).toThrow(BookPurchaseLinkLengthExceeded);
  });

  it('should create with maximum length URL', () => {
    // Base URL is 'https://example.com/'
    const baseUrl = 'https://example.com/';
    const path = 'a'.repeat(BookPurchaseLink.MAX_LENGTH - baseUrl.length);
    const url = baseUrl + path;
    expect(url.length).toBe(BookPurchaseLink.MAX_LENGTH);

    const purchaseLink = BookPurchaseLink.create(url);
    expect(purchaseLink.value).toBe(url);
  });

  it('should handle URLs with query parameters', () => {
    const url = 'https://example.com/book?id=123&ref=xyz';
    const purchaseLink = BookPurchaseLink.create(url);

    expect(purchaseLink.value).toBe(url);
  });

  it('should handle URLs with fragments', () => {
    const url = 'https://example.com/book#section1';
    const purchaseLink = BookPurchaseLink.create(url);

    expect(purchaseLink.value).toBe(url);
  });
});
