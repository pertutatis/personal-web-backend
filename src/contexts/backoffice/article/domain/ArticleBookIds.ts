import { ArticleBookIdsEmpty } from './ArticleBookIdsEmpty'

export class ArticleBookIds {
  static readonly MAX_BOOK_IDS = 10

  private constructor(private readonly value: readonly string[]) {
    Object.freeze(this.value)
  }

  static create(value: string[]): ArticleBookIds {
    this.validateValue(value)
    if (value.length > this.MAX_BOOK_IDS) {
      throw new Error(`Maximum of ${this.MAX_BOOK_IDS} book ids allowed`)
    }
    return new ArticleBookIds(Array.from(new Set(value)))
  }

  private static validateValue(value: string[]): void {
    if (!Array.isArray(value)) {
      throw new ArticleBookIdsEmpty()
    }
  }

  getValue(): string[] {
    return [...this.value]
  }

  get isEmpty(): boolean {
    return this.value.length === 0
  }

  get length(): number {
    return this.value.length
  }

  static createEmpty(): ArticleBookIds {
    return new ArticleBookIds([])
  }

  equals(other: ArticleBookIds | null): boolean {
    if (!other) {
      return false
    }

    if (this.length !== other.length) {
      return false
    }

    const sortedThis = [...this.value].sort()
    const sortedOther = [...other.value].sort()

    return sortedThis.every((value, index) => value === sortedOther[index])
  }

  includes(bookId: string): boolean {
    return this.value.includes(bookId)
  }

  add(bookId: string): ArticleBookIds {
    if (this.includes(bookId)) {
      return this
    }

    if (this.length >= ArticleBookIds.MAX_BOOK_IDS) {
      throw new Error(
        `Maximum of ${ArticleBookIds.MAX_BOOK_IDS} book ids allowed`,
      )
    }

    return new ArticleBookIds([...this.value, bookId])
  }

  remove(bookId: string): ArticleBookIds {
    if (!this.includes(bookId)) {
      return this
    }

    return new ArticleBookIds(this.value.filter((id) => id !== bookId))
  }

  toString(): string {
    return this.value.join(', ')
  }

  toJSON(): string[] {
    return this.getValue()
  }
}
