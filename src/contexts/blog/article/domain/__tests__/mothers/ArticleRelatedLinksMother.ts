import { ArticleRelatedLinks } from '../../ArticleRelatedLinks';
import { ArticleRelatedLinkMother } from './ArticleRelatedLinkMother';

export class ArticleRelatedLinksMother {
  static create(count: number = 2): ArticleRelatedLinks {
    const links = Array.from({ length: count }, (_, i) => ({
      text: `Link ${i + 1}`,
      url: `https://example.com/link-${i + 1}`
    }));

    return ArticleRelatedLinks.create(links);
  }

  static createEmpty(): ArticleRelatedLinks {
    return ArticleRelatedLinks.createEmpty();
  }

  static createMax(): ArticleRelatedLinks {
    const maxLinks = Array.from({ length: ArticleRelatedLinks.MAX_LINKS }, (_, i) => ({
      text: `Link ${i + 1}`,
      url: `https://example.com/link-${i + 1}`
    }));

    return ArticleRelatedLinks.create(maxLinks);
  }

  static createExceeded(): ArticleRelatedLinks {
    const exceededLinks = Array.from(
      { length: ArticleRelatedLinks.MAX_LINKS + 1 },
      (_, i) => ({
        text: `Link ${i + 1}`,
        url: `https://example.com/link-${i + 1}`
      })
    );

    return ArticleRelatedLinks.create(exceededLinks);
  }

  static single(): ArticleRelatedLinks {
    return this.create(1);
  }

  static withDuplicates(): ArticleRelatedLinks {
    return ArticleRelatedLinks.create([
      { text: 'Link 1', url: 'https://example.com/link-1' },
      { text: 'Link 2', url: 'https://example.com/link-1' }
    ]);
  }

  static random(): ArticleRelatedLinks {
    const count = Math.floor(Math.random() * (ArticleRelatedLinks.MAX_LINKS - 1)) + 1;
    const links = Array.from({ length: count }, () => {
      const link = ArticleRelatedLinkMother.random();
      return {
        text: link.getText(),
        url: link.getUrl()
      };
    });

    return ArticleRelatedLinks.create(links);
  }

  // Alias methods for backward compatibility
  static empty = this.createEmpty;
  static withMaxLinks = this.createMax;
  static exceedingMaxLinks = this.createExceeded;
  static withDuplicateUrls = this.withDuplicates;
}
