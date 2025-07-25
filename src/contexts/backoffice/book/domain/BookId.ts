import { v4 as uuidv4, validate, version } from 'uuid'
import { BookIdInvalid } from './BookIdInvalid'

export class BookId {
  public readonly value: string

  constructor(id: string) {
    this.ensureValidUuidV4(id)
    this.value = id
  }

  static random(): BookId {
    return new BookId(uuidv4())
  }

  private ensureValidUuidV4(id: string): void {
    if (!validate(id)) {
      throw new BookIdInvalid()
    }

    // Additional check to ensure it's specifically a v4 UUID
    if (version(id) !== 4) {
      throw new BookIdInvalid()
    }
  }

  toString(): string {
    return this.value
  }

  equals(other: BookId): boolean {
    return this.value === other.value
  }
}
