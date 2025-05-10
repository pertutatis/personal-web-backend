import { ValueObject } from '../../../shared/domain/ValueObject'
import { PasswordEmpty } from './PasswordEmpty'
import { PasswordInvalid } from './PasswordInvalid'

export class PasswordVO extends ValueObject<string> {
  constructor(value: string) {
    PasswordVO.ensureValidPassword(value)
    super(value)
  }

  private static ensureValidPassword(value: string): void {
    if (value.length === 0) {
      throw new PasswordEmpty()
    }

    if (value.length < 8) {
      throw new PasswordInvalid('Password must be at least 8 characters long')
    }

    if (value.length > 64) {
      throw new PasswordInvalid('Password cannot be longer than 64 characters')
    }

    if (!/[A-Z]/.test(value)) {
      throw new PasswordInvalid('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(value)) {
      throw new PasswordInvalid('Password must contain at least one lowercase letter')
    }

    if (!/[0-9]/.test(value)) {
      throw new PasswordInvalid('Password must contain at least one number')
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(value)) {
      throw new PasswordInvalid('Password must contain at least one special character')
    }

    if (/\s/.test(value)) {
      throw new PasswordInvalid('Password cannot contain spaces')
    }
  }

  toString(): string {
    return '[PROTECTED]'
  }
}
