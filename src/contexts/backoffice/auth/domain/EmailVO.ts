import { ValueObject } from '../../../shared/domain/ValueObject'
import { EmailEmpty } from './EmailEmpty'
import { EmailInvalid } from './EmailInvalid'

export class EmailVO extends ValueObject<string> {
  constructor(value: string) {
    const normalizedEmail = value.trim().toLowerCase()
    EmailVO.ensureValidEmail(normalizedEmail)
    super(normalizedEmail)
  }

  private static ensureValidEmail(value: string): void {
    if (value.length === 0) {
      throw new EmailEmpty()
    }

    if (value.length > 255) {
      throw new EmailInvalid(value)
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(value)) {
      throw new EmailInvalid(value)
    }
  }

  toString(): string {
    return this.value
  }
}
