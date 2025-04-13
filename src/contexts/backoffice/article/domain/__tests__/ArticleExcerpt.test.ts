import { ArticleExcerpt } from '../ArticleExcerpt';
import { ArticleExcerptEmpty } from '../ArticleExcerptEmpty';
import { ArticleExcerptLengthExceeded } from '../ArticleExcerptLengthExceeded';
import { ArticleExcerptContainsHtml } from '../ArticleExcerptContainsHtml';

describe('ArticleExcerpt', () => {
  it('should create a valid excerpt', () => {
    const value = 'This is a valid excerpt';
    const excerpt = new ArticleExcerpt(value);

    expect(excerpt.value).toBe(value);
  });

  it('should throw ArticleExcerptEmpty if value is empty', () => {
    expect(() => new ArticleExcerpt('')).toThrow(ArticleExcerptEmpty);
    expect(() => new ArticleExcerpt('   ')).toThrow(ArticleExcerptEmpty);
  });

  it('should throw ArticleExcerptLengthExceeded if value is too long', () => {
    const longValue = 'a'.repeat(301);
    expect(() => new ArticleExcerpt(longValue)).toThrow(ArticleExcerptLengthExceeded);
  });

  it('should accept value at maximum length', () => {
    const maxValue = 'a'.repeat(300);
    const excerpt = new ArticleExcerpt(maxValue);
    expect(excerpt.value).toBe(maxValue);
  });

  it('should trim whitespace', () => {
    const excerpt = new ArticleExcerpt('  excerpt with spaces  ');
    expect(excerpt.value).toBe('excerpt with spaces');
  });

  describe('HTML validation', () => {
    it('should throw ArticleExcerptContainsHtml if contains basic HTML tags', () => {
      const invalidValues = [
        '<p>text</p>',
        '<div>content</div>',
        '<span>inline</span>',
        '<br>',
        '<hr/>',
      ];

      invalidValues.forEach(value => {
        expect(() => new ArticleExcerpt(value)).toThrow(ArticleExcerptContainsHtml);
      });
    });

    it('should throw ArticleExcerptContainsHtml if contains HTML with attributes', () => {
      const invalidValues = [
        '<p class="text">content</p>',
        '<div id="main">content</div>',
        '<a href="http://example.com">link</a>',
      ];

      invalidValues.forEach(value => {
        expect(() => new ArticleExcerpt(value)).toThrow(ArticleExcerptContainsHtml);
      });
    });

    it('should throw ArticleExcerptContainsHtml if contains malformed HTML', () => {
      const invalidValues = [
        '<p>unclosed tag',
        'unclosed> tag',
        '<>empty tag</>',
        '<',
        '>',
        '< >',
      ];

      invalidValues.forEach(value => {
        expect(() => new ArticleExcerpt(value)).toThrow(ArticleExcerptContainsHtml);
      });
    });

    it('should throw ArticleExcerptContainsHtml if contains script tags', () => {
      const invalidValues = [
        '<script>alert("test")</script>',
        '<script src="file.js"></script>',
        '<script type="text/javascript">code</script>',
      ];

      invalidValues.forEach(value => {
        expect(() => new ArticleExcerpt(value)).toThrow(ArticleExcerptContainsHtml);
      });
    });

    it('should throw ArticleExcerptContainsHtml if contains style tags or inline CSS', () => {
      const invalidValues = [
        '<style>body { color: red; }</style>',
        '<div style="color: red;">styled text</div>',
        '<p style=\'background: blue\'>text</p>',
      ];

      invalidValues.forEach(value => {
        expect(() => new ArticleExcerpt(value)).toThrow(ArticleExcerptContainsHtml);
      });
    });

    it('should throw ArticleExcerptContainsHtml if contains HTML entities', () => {
      const invalidValues = [
        'Text with &nbsp;',
        'Text with &amp; entity',
        'Text with &lt; and &gt;',
      ];

      invalidValues.forEach(value => {
        expect(() => new ArticleExcerpt(value)).toThrow(ArticleExcerptContainsHtml);
      });
    });
  });

  it('should allow valid special characters', () => {
    const validValues = [
      'Text with emojis 👍 🎉',
      'Text with special chars: áéíóú ñ',
      'Text with punctuation: .,;:?¿!¡()',
      'Text with numbers: 12345',
      'Text with quotes: "quoted" and \'quoted\'',
    ];

    validValues.forEach(value => {
      expect(() => new ArticleExcerpt(value)).not.toThrow();
    });
  });
});
