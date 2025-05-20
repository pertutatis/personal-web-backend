import { DomainError } from '../../../shared/domain/DomainError'

export class PasswordInvalid extends DomainError {
  readonly type = 'ValidationError'

  constructor(reason: string) {
    super(`Password is invalid: ${reason}`)
    this.name = 'PasswordInvalid'
  }
}
