import { ArticleRelatedLinkMother } from './mothers/ArticleRelatedLinkMother';
import { ArticleRelatedLinkTextEmpty } from '../ArticleRelatedLinkTextEmpty';
import { ArticleRelatedLinkTextLengthExceeded } from '../ArticleRelatedLinkTextLengthExceeded';
import { ArticleRelatedLinkUrlEmpty } from '../ArticleRelatedLinkUrlEmpty';
import { ArticleRelatedLinkUrlInvalid } from '../ArticleRelatedLinkUrlInvalid';
import { ArticleRelatedLinkUrlLengthExceeded } from '../ArticleRelatedLinkUrlLengthExceeded';

describe('ArticleRelatedLink', () => {
  it('should create a valid related link', () => {
    const link = ArticleRelatedLinkMother.create();
    expect(link.text).toBe('Aprende más sobre Clean Code');
    expect(link.url).toBe('https://example.com/clean-code');
  });

  it('should throw error when text is empty', () => {
    expect(() => {
      ArticleRelatedLinkMother.withEmptyText();
    }).toThrow(ArticleRelatedLinkTextEmpty);

    expect(() => {
      ArticleRelatedLinkMother.create('   ', 'https://example.com');
    }).toThrow(ArticleRelatedLinkTextEmpty);
  });

  it('should throw error when text exceeds maximum length', () => {
    expect(() => {
      ArticleRelatedLinkMother.withTextTooLong();
    }).toThrow(ArticleRelatedLinkTextLengthExceeded);
  });

  it('should throw error when URL is empty', () => {
    expect(() => {
      ArticleRelatedLinkMother.withEmptyUrl();
    }).toThrow(ArticleRelatedLinkUrlEmpty);

    expect(() => {
      ArticleRelatedLinkMother.create('Text', '   ');
    }).toThrow(ArticleRelatedLinkUrlEmpty);
  });

  it('should throw error when URL is invalid', () => {
    expect(() => {
      ArticleRelatedLinkMother.withInvalidUrl();
    }).toThrow(ArticleRelatedLinkUrlInvalid);
  });

  it('should throw error when URL exceeds maximum length', () => {
    expect(() => {
      ArticleRelatedLinkMother.withUrlTooLong();
    }).toThrow(ArticleRelatedLinkUrlLengthExceeded);
  });

  it('should accept text and URL with exactly maximum length', () => {
    const link = ArticleRelatedLinkMother.maxLengths();
    expect(link.text.length).toBe(100);
    expect(link.url.length).toBeLessThanOrEqual(2000);
  });

  it('should trim text and URL', () => {
    const link = ArticleRelatedLinkMother.withWhitespace();
    expect(link.text).toBe('Text with spaces');
    expect(link.url).toBe('https://example.com/path');
  });

  it('should convert to primitives correctly', () => {
    const link = ArticleRelatedLinkMother.create();
    expect(link.toPrimitives()).toEqual({
      text: 'Aprende más sobre Clean Code',
      url: 'https://example.com/clean-code'
    });
  });

  it('should allow different URL protocols', () => {
    const httpsLink = ArticleRelatedLinkMother.create(
      'HTTPS Link',
      'https://example.com'
    );
    expect(httpsLink.url).toBe('https://example.com');

    const httpLink = ArticleRelatedLinkMother.create(
      'HTTP Link',
      'http://example.com'
    );
    expect(httpLink.url).toBe('http://example.com');
  });
});
