import { ArticleRelatedLinkTextEmpty } from './ArticleRelatedLinkTextEmpty';
import { ArticleRelatedLinkTextLengthExceeded } from './ArticleRelatedLinkTextLengthExceeded';
import { ArticleRelatedLinkUrlEmpty } from './ArticleRelatedLinkUrlEmpty';
import { ArticleRelatedLinkUrlInvalid } from './ArticleRelatedLinkUrlInvalid';
import { ArticleRelatedLinkUrlLengthExceeded } from './ArticleRelatedLinkUrlLengthExceeded';

export class ArticleRelatedLink {
  constructor(
    private readonly _text: string,
    private readonly _url: string
  ) {}

  static create(text: string, url: string): ArticleRelatedLink {
    const trimmedText = text.trim();
    const trimmedUrl = url.trim();

    if (trimmedText.length === 0) {
      throw new ArticleRelatedLinkTextEmpty();
    }

    if (trimmedText.length > 100) {
      throw new ArticleRelatedLinkTextLengthExceeded();
    }

    if (trimmedUrl.length === 0) {
      throw new ArticleRelatedLinkUrlEmpty();
    }

    if (trimmedUrl.length > 2000) {
      throw new ArticleRelatedLinkUrlLengthExceeded();
    }

    try {
      new URL(trimmedUrl);
    } catch {
      throw new ArticleRelatedLinkUrlInvalid();
    }

    return new ArticleRelatedLink(trimmedText, trimmedUrl);
  }

  get text(): string {
    return this._text;
  }

  get url(): string {
    return this._url;
  }

  toPrimitives(): { text: string; url: string } {
    return {
      text: this._text,
      url: this._url
    };
  }

  toString(): string {
    return `${this._text} (${this._url})`;
  }

  equals(other: ArticleRelatedLink): boolean {
    return other.constructor.name === this.constructor.name && 
           other.text === this.text &&
           other.url === this.url;
  }
}
