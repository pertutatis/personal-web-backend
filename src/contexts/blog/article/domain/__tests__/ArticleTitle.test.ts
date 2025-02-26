import { ArticleTitleEmpty } from '../ArticleTitleEmpty';
import { ArticleTitleLengthExceeded } from '../ArticleTitleLengthExceeded';
import { ArticleTitleMother } from './mothers/ArticleTitleMother';

describe('ArticleTitle', () => {
  it('should create a valid article title', () => {
    const title = ArticleTitleMother.create();
    expect(title.value).toBe('10 Clean Code Principles Every Developer Should Follow');
  });

  it('should throw error when title is empty', () => {
    expect(() => {
      ArticleTitleMother.empty();
    }).toThrow(ArticleTitleEmpty);

    expect(() => {
      ArticleTitleMother.withSpacesOnly();
    }).toThrow(ArticleTitleEmpty);
  });

  it('should throw error when title exceeds maximum length', () => {
    expect(() => {
      ArticleTitleMother.tooLong();
    }).toThrow(ArticleTitleLengthExceeded);
  });

  it('should accept title with exactly maximum length', () => {
    const title = ArticleTitleMother.maxLength();
    expect(title.value.length).toBe(150);
  });

  it('should trim title', () => {
    const title = ArticleTitleMother.withWhitespace();
    expect(title.value).toBe('Title with spaces');
  });
});
