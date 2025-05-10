import { DomainError } from '../../../shared/domain/DomainError'

export class PasswordInvalid extends DomainError {
  constructor(reason: string) {
    super(`Password is invalid: ${reason}`)
    this.name = 'PasswordInvalid'
  }

  get type(): string {
    return 'PASSWORD_INVALID'
  }
}
