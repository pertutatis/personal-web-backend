import { ArticleRelatedLink } from './ArticleRelatedLink';
import { ArticleRelatedLinksDuplicated } from './ArticleRelatedLinksDuplicated';
import { ArticleRelatedLinksMaxExceeded } from './ArticleRelatedLinksMaxExceeded';

export type ArticleLinkPrimitive = {
  text: string;
  url: string;
};

export class ArticleRelatedLinks {
  static readonly MAX_LINKS = 10;

  private constructor(private readonly items: ArticleRelatedLink[]) {
    Object.freeze(items);
  }

  static create(items: ArticleLinkPrimitive[] = []): ArticleRelatedLinks {
    if (items.length > this.MAX_LINKS) {
      throw new ArticleRelatedLinksMaxExceeded();
    }

    const links = items.map(item => 
      ArticleRelatedLink.create(item.text, item.url)
    );

    this.validateNoDuplicates(links);

    return new ArticleRelatedLinks(links);
  }

  private static validateNoDuplicates(items: ArticleRelatedLink[]): void {
    const urls = items.map(link => link.getUrl());
    const uniqueUrls = new Set(urls);

    if (uniqueUrls.size !== urls.length) {
      const duplicatedUrl = urls.find((url, index) => urls.indexOf(url) !== index);
      throw new ArticleRelatedLinksDuplicated(duplicatedUrl || '');
    }
  }

  static createEmpty(): ArticleRelatedLinks {
    return new ArticleRelatedLinks([]);
  }

  getItems(): ArticleRelatedLink[] {
    return [...this.items];
  }

  get length(): number {
    return this.items.length;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  equals(other: ArticleRelatedLinks | null): boolean {
    if (!other) {
      return false;
    }

    if (this.length !== other.length) {
      return false;
    }

    return this.items.every((link, index) => link.equals(other.items[index]));
  }

  hasUrl(url: string): boolean {
    return this.items.some(link => link.getUrl() === url);
  }

  add(primitive: ArticleLinkPrimitive): ArticleRelatedLinks {
    const link = ArticleRelatedLink.create(primitive.text, primitive.url);

    if (this.length >= ArticleRelatedLinks.MAX_LINKS) {
      throw new ArticleRelatedLinksMaxExceeded();
    }

    if (this.hasUrl(link.getUrl())) {
      throw new ArticleRelatedLinksDuplicated(link.getUrl());
    }

    return new ArticleRelatedLinks([...this.items, link]);
  }

  remove(url: string): ArticleRelatedLinks {
    const filteredLinks = this.items.filter(link => link.getUrl() !== url);
    return new ArticleRelatedLinks(filteredLinks);
  }

  toPrimitives(): ArticleLinkPrimitive[] {
    return this.items.map(link => ({
      text: link.getText(),
      url: link.getUrl()
    }));
  }

  toJSON(): ArticleLinkPrimitive[] {
    return this.toPrimitives();
  }

  toString(): string {
    return this.items.map(link => link.toString()).join(', ');
  }
}
