import { ArticleTitle } from '../ArticleTitle';
import { ArticleTitleMother } from './mothers/ArticleTitleMother';
import { ArticleTitleEmpty } from '../ArticleTitleEmpty';
import { ArticleTitleLengthExceeded } from '../ArticleTitleLengthExceeded';

describe('ArticleTitle', () => {
  it('should create a valid title', () => {
    const title = ArticleTitleMother.create();
    expect(title.value).toBe('Clean Code Principles');
  });

  it('should trim whitespace', () => {
    const title = ArticleTitleMother.withWhitespace();
    expect(title.value).toBe('Title With Spaces');
  });

  it('should throw error when empty', () => {
    expect(() => ArticleTitleMother.empty()).toThrow(ArticleTitleEmpty);
  });

  it('should throw error when only spaces', () => {
    expect(() => ArticleTitleMother.withSpacesOnly()).toThrow(ArticleTitleEmpty);
  });

  it('should throw error when exceeds max length', () => {
    expect(() => ArticleTitleMother.tooLong()).toThrow(ArticleTitleLengthExceeded);
  });

  it('should accept title with exactly max length', () => {
    const title = ArticleTitleMother.maxLength();
    expect(title.value).toHaveLength(ArticleTitle.MAX_LENGTH);
  });

  describe('string conversions', () => {
    it('should convert to primitive string correctly', () => {
      const title = ArticleTitleMother.create();
      expect(title.toString()).toBe('Clean Code Principles');
    });

    it('should convert to JSON correctly', () => {
      const title = ArticleTitleMother.create();
      expect(title.toJSON()).toBe('Clean Code Principles');
    });
  });

  describe('equality', () => {
    it('should be equal to another title with same value', () => {
      const title1 = ArticleTitleMother.create();
      const title2 = ArticleTitleMother.create();
      expect(title1.equals(title2)).toBe(true);
    });

    it('should not be equal to another title with different value', () => {
      const title1 = ArticleTitleMother.create();
      const title2 = ArticleTitleMother.create('Different Title');
      expect(title1.equals(title2)).toBe(false);
    });

    it('should not be equal to null', () => {
      const title = ArticleTitleMother.create();
      expect(title.equals(null as any)).toBe(false);
    });

    it('should not be equal to a different type', () => {
      const title = ArticleTitleMother.create();
      expect(title.equals('Clean Code Principles' as any)).toBe(false);
    });
  });
});
