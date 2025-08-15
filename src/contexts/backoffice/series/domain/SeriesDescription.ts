import { InvalidArgumentError } from '@/contexts/shared/domain/InvalidArgumentError'

export class SeriesDescription {
  readonly value: string

  constructor(value: string) {
    const trimmedValue = value.trim()
    this.ensureValidDescription(trimmedValue)
    this.value = trimmedValue
  }

  private ensureValidDescription(value: string): void {
    if (value.length === 0) {
      throw new InvalidArgumentError('Series description cannot be empty')
    }

    if (value.length > 1000) {
      throw new InvalidArgumentError(
        'Series description cannot exceed 1000 characters',
      )
    }
  }

  equals(other: SeriesDescription): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
