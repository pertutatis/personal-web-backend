import { v4 as uuidv4, validate as validateUuid } from 'uuid'

export class ArticleSeriesId {
  readonly value: string

  constructor(value: string) {
    if (!ArticleSeriesId.isValid(value)) {
      throw new Error(`Invalid SeriesId: ${value}`)
    }
    this.value = value
  }

  static isValid(value: string): boolean {
    return validateUuid(value)
  }

  static create(): ArticleSeriesId {
    return new ArticleSeriesId(uuidv4())
  }

  equals(other: ArticleSeriesId): boolean {
    return this.value === other.value
  }
}
