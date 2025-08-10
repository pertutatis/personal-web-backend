import { InvalidArgumentError } from '@/contexts/shared/domain/InvalidArgumentError'

export class SeriesTitle {
  readonly value: string

  constructor(value: string) {
    const trimmedValue = value.trim()
    this.ensureValidTitle(trimmedValue)
    this.value = trimmedValue
  }

  private ensureValidTitle(value: string): void {
    if (value.length === 0) {
      throw new InvalidArgumentError('Series title cannot be empty')
    }

    if (value.length > 100) {
      throw new InvalidArgumentError(
        'Series title cannot exceed 100 characters',
      )
    }
  }

  equals(other: SeriesTitle): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
