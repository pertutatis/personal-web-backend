import { Identifier } from '../../../shared/domain/Identifier'
import { UuidValidator } from '../../../shared/domain/validation/UuidValidator'

export class ArticleId extends Identifier {
  constructor(value: string) {
    if (!UuidValidator.isValidUuid(value)) {
      throw new Error('Invalid UUID v4 format')
    }
    super(value)
  }

  equals(other: unknown): boolean {
    if (!(other instanceof ArticleId)) {
      return false
    }
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }

  toJSON(): string {
    return this.value
  }
}
