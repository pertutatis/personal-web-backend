import { ArticleSlugMother } from './mothers/ArticleSlugMother';
import { ArticleSlugEmpty } from '../ArticleSlugEmpty';
import { ArticleSlugLengthExceeded } from '../ArticleSlugLengthExceeded';
import { ArticleSlugInvalid } from '../ArticleSlugInvalid';

describe('ArticleSlug', () => {
  it('should create a valid slug from title', () => {
    const slug = ArticleSlugMother.create();
    expect(slug.value).toBe('10-clean-code-principles-every-developer-should-follow');
  });

  it('should handle Spanish characters', () => {
    const slug = ArticleSlugMother.fromSpanishTitle();
    expect(slug.value).toBe('como-implementar-patrones-de-diseno-en-javascript');
  });

  it('should handle special characters', () => {
    const slug = ArticleSlugMother.withSpecialCharacters();
    expect(slug.value).toBe('nodejs-typescript-una-guia-practica');
  });

  it('should handle multiple spaces', () => {
    const slug = ArticleSlugMother.withMultipleSpaces();
    expect(slug.value).toBe('clean-code-principios-basicos');
  });

  it('should throw error when resulting slug is empty', () => {
    expect(() => {
      ArticleSlugMother.empty();
    }).toThrow(ArticleSlugEmpty);

    expect(() => {
      ArticleSlugMother.withSpacesOnly();
    }).toThrow(ArticleSlugEmpty);
  });

  it('should throw error when slug exceeds maximum length', () => {
    expect(() => {
      ArticleSlugMother.tooLong();
    }).toThrow(ArticleSlugLengthExceeded);
  });

  it('should accept slug with exactly maximum length', () => {
    const slug = ArticleSlugMother.maxLength();
    expect(slug.value.length).toBe(100);
  });

  it('should throw error for invalid characters only', () => {
    expect(() => {
      ArticleSlugMother.withInvalidCharacters();
    }).toThrow(ArticleSlugInvalid);
  });

  it('should replace consecutive dashes with single dash', () => {
    const slug = ArticleSlugMother.withConsecutiveDashes();
    expect(slug.value).toBe('clean-code-principles');
  });

  it('should convert to lowercase', () => {
    const slug = ArticleSlugMother.create('UPPERCASE TITLE');
    expect(slug.value).toBe('uppercase-title');
  });

  it('should convert to primitives correctly', () => {
    const slug = ArticleSlugMother.create();
    expect(slug.toString()).toBe('10-clean-code-principles-every-developer-should-follow');
    expect(slug.toJSON()).toBe('10-clean-code-principles-every-developer-should-follow');
  });
});
