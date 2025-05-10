import { ValueObject } from './ValueObject'
import { UuidValidator } from './validation/UuidValidator'

export class Identifier extends ValueObject<string> {
  constructor(value: string) {
    super(value)
  }

  protected isValid(value: string): boolean {
    return UuidValidator.validate(value)
  }
}
