import { ArticleRelatedLink } from './ArticleRelatedLink';
import { ArticleRelatedLinksDuplicated } from './ArticleRelatedLinksDuplicated';
import { ArticleRelatedLinksMaxExceeded } from './ArticleRelatedLinksMaxExceeded';

export class ArticleRelatedLinks {
  private constructor(private readonly _items: ArticleRelatedLink[]) {
    this.ensureMaxLinksNotExceeded(_items);
    this.ensureNoDuplicateUrls(_items);
  }

  static create(items: ArticleRelatedLink[]): ArticleRelatedLinks {
    return new ArticleRelatedLinks(items);
  }

  private ensureMaxLinksNotExceeded(items: ArticleRelatedLink[]): void {
    if (items.length > 10) {
      throw new ArticleRelatedLinksMaxExceeded();
    }
  }

  private ensureNoDuplicateUrls(items: ArticleRelatedLink[]): void {
    const urls = items.map(item => item.url);
    const uniqueUrls = new Set(urls);

    if (uniqueUrls.size !== urls.length) {
      const duplicateUrl = urls.find((url, index) => urls.indexOf(url) !== index);
      if (duplicateUrl) {
        throw new ArticleRelatedLinksDuplicated(duplicateUrl);
      }
    }
  }

  add(link: ArticleRelatedLink): ArticleRelatedLinks {
    const newItems = [...this._items, link];
    return ArticleRelatedLinks.create(newItems);
  }

  remove(url: string): ArticleRelatedLinks {
    const newItems = this._items.filter(item => item.url !== url);
    return ArticleRelatedLinks.create(newItems);
  }

  get length(): number {
    return this._items.length;
  }

  get isEmpty(): boolean {
    return this._items.length === 0;
  }

  getItems(): ArticleRelatedLink[] {
    return [...this._items];
  }

  toPrimitives(): Array<{
    text: string;
    url: string;
  }> {
    return this._items.map(item => item.toPrimitives());
  }

  equals(other: ArticleRelatedLinks): boolean {
    if (other.length !== this.length) return false;

    return this._items.every((item, index) => 
      item.equals(other.getItems()[index])
    );
  }

  toString(): string {
    return this._items.map(item => item.toString()).join(', ');
  }
}
