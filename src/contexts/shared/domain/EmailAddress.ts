import { StringValueObject } from './StringValueObject'
import { EmailAddressInvalid } from './EmailAddressInvalid'

export class EmailAddress extends StringValueObject {
  private static readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  constructor(value: string) {
    const trimmedValue = value.trim()
    EmailAddress.validateFormat(trimmedValue)
    super(trimmedValue)
  }

  private static validateFormat(email: string): void {
    if (!EmailAddress.EMAIL_PATTERN.test(email)) {
      throw new EmailAddressInvalid(email)
    }
  }

  get localPart(): string {
    return this.value.split('@')[0]
  }

  get domain(): string {
    return this.value.split('@')[1]
  }

  equals(other: unknown): boolean {
    if (!other) {
      return false
    }

    if (!(other instanceof EmailAddress)) {
      return false
    }

    return other.value.toLowerCase() === this.value.toLowerCase()
  }

  toString(): string {
    return this.value
  }

  toJSON(): string {
    return this.value
  }
}
