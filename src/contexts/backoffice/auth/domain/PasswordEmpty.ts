import { DomainError } from '../../../shared/domain/DomainError'

export class PasswordEmpty extends DomainError {
  readonly type = 'ValidationError'

  constructor() {
    super('Password cannot be empty')
    this.name = 'PasswordEmpty'
  }
}
