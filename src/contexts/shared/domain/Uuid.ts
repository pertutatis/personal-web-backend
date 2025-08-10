import { InvalidArgumentError } from './InvalidArgumentError'
import { v4 as uuidv4 } from 'uuid'

export class Uuid {
  readonly value: string

  constructor(value: string) {
    this.ensureIsValidUuid(value)
    this.value = value
  }

  static random(): Uuid {
    return new Uuid(uuidv4())
  }

  private ensureIsValidUuid(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      throw new InvalidArgumentError(`<${id}> is not a valid UUID`)
    }
  }

  equals(other: Uuid): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
