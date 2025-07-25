import { ArticleRelatedLinkTextEmpty } from './ArticleRelatedLinkTextEmpty'
import { ArticleRelatedLinkTextLengthExceeded } from './ArticleRelatedLinkTextLengthExceeded'
import { ArticleRelatedLinkUrlEmpty } from './ArticleRelatedLinkUrlEmpty'
import { ArticleRelatedLinkUrlInvalid } from './ArticleRelatedLinkUrlInvalid'
import { ArticleRelatedLinkUrlLengthExceeded } from './ArticleRelatedLinkUrlLengthExceeded'

export class ArticleRelatedLink {
  static readonly TEXT_MAX_LENGTH = 100
  static readonly URL_MAX_LENGTH = 255

  readonly parsedUrl: URL
  readonly protocol: string
  readonly host: string

  private constructor(
    private readonly _text: string,
    private readonly _url: string,
  ) {
    this.validateText(_text)
    this.validateUrl(_url)

    try {
      this.parsedUrl = new URL(_url)
      this.protocol = this.parsedUrl.protocol
      this.host = this.parsedUrl.host
    } catch (error) {
      throw new ArticleRelatedLinkUrlInvalid(_url)
    }

    Object.freeze(this)
  }

  static create(text: string, url: string): ArticleRelatedLink {
    return new ArticleRelatedLink(text.trim(), url.trim())
  }

  private validateText(text: string): void {
    const trimmedText = text.trim()
    if (!trimmedText) {
      throw new ArticleRelatedLinkTextEmpty()
    }
    if (trimmedText.length > ArticleRelatedLink.TEXT_MAX_LENGTH) {
      throw new ArticleRelatedLinkTextLengthExceeded()
    }
  }

  private validateUrl(url: string): void {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      throw new ArticleRelatedLinkUrlEmpty()
    }
    if (trimmedUrl.length > ArticleRelatedLink.URL_MAX_LENGTH) {
      throw new ArticleRelatedLinkUrlLengthExceeded()
    }
  }

  getText(): string {
    return this._text
  }

  getUrl(): string {
    return this._url
  }

  equals(other: ArticleRelatedLink | null): boolean {
    if (!other) {
      return false
    }
    return this._text === other._text && this._url === other._url
  }

  toString(): string {
    return `${this._text} (${this._url})`
  }

  toPrimitives(): { text: string; url: string } {
    return {
      text: this._text,
      url: this._url,
    }
  }

  toJSON(): { text: string; url: string } {
    return this.toPrimitives()
  }
}
