import { Identifier } from '../../../shared/domain/Identifier'
import { UuidValidator } from '../../../shared/domain/validation/UuidValidator'

export class ArticleId extends Identifier {
  constructor(value: string) {
    super(value)
    if (!UuidValidator.isValidUuid(value)) {
      throw new Error('Invalid UUID format')
    }
  }

  equals(other: unknown): boolean {
    if (!(other instanceof ArticleId)) {
      return false
    }
    return this.value === other.value
  }
}
