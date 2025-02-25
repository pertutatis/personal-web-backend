import { ArticleTitle } from '../ArticleTitle';
import { ArticleTitleEmpty } from '../ArticleTitleEmpty';
import { ArticleTitleLengthExceeded } from '../ArticleTitleLengthExceeded';

describe('ArticleTitle', () => {
  it('should create a valid article title', () => {
    const title = 'Valid Article Title';
    const articleTitle = ArticleTitle.create(title);
    expect(articleTitle.value).toBe(title);
  });

  it('should throw error when title is empty', () => {
    expect(() => {
      ArticleTitle.create('');
    }).toThrow(ArticleTitleEmpty);

    expect(() => {
      ArticleTitle.create('   ');
    }).toThrow(ArticleTitleEmpty);
  });

  it('should throw error when title exceeds maximum length', () => {
    const longTitle = 'a'.repeat(151); // Max length is 150 characters
    expect(() => {
      ArticleTitle.create(longTitle);
    }).toThrow(ArticleTitleLengthExceeded);
  });

  it('should trim title', () => {
    const title = '  Title with spaces  ';
    const articleTitle = ArticleTitle.create(title);
    expect(articleTitle.value).toBe('Title with spaces');
  });
});
