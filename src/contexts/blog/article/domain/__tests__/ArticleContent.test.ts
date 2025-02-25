import { ArticleContent } from '../ArticleContent';
import { ArticleContentEmpty } from '../ArticleContentEmpty';
import { ArticleContentLengthExceeded } from '../ArticleContentLengthExceeded';

describe('ArticleContent', () => {
  it('should create a valid article content', () => {
    const content = 'Valid article content';
    const articleContent = ArticleContent.create(content);
    expect(articleContent.value).toBe(content);
  });

  it('should throw error when content is empty', () => {
    expect(() => {
      ArticleContent.create('');
    }).toThrow(ArticleContentEmpty);

    expect(() => {
      ArticleContent.create('   ');
    }).toThrow(ArticleContentEmpty);
  });

  it('should throw error when content exceeds maximum length', () => {
    const longContent = 'a'.repeat(10001); // Max length is 10000 characters
    expect(() => {
      ArticleContent.create(longContent);
    }).toThrow(ArticleContentLengthExceeded);
  });

  it('should trim content', () => {
    const content = '  Content with spaces  ';
    const articleContent = ArticleContent.create(content);
    expect(articleContent.value).toBe('Content with spaces');
  });
});
