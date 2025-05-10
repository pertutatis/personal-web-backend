import { DomainError } from '../../../shared/domain/DomainError'

export class PasswordEmpty extends DomainError {
  constructor() {
    super('Password cannot be empty')
    this.name = 'PasswordEmpty'
  }

  get type(): string {
    return 'PASSWORD_EMPTY'
  }
}
