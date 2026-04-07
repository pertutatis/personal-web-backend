export class BookImageUrl {
  private constructor(private readonly _value: string | null) {
    Object.freeze(this)
  }

  static create(value: string | null): BookImageUrl {
    if (value === null || value.trim() === '') {
      return this.createEmpty()
    }
    return new BookImageUrl(value.trim())
  }

  static createEmpty(): BookImageUrl {
    return new BookImageUrl(null)
  }

  get value(): string | null {
    return this._value
  }

  isEmpty(): boolean {
    return this._value === null
  }

  equals(other: BookImageUrl | null): boolean {
    if (!other) {
      return this.isEmpty()
    }
    return this._value === other._value
  }

  toString(): string {
    return this._value || ''
  }
}
