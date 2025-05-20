import { DomainError } from '../../../shared/domain/DomainError'

export class InvalidToken extends DomainError {
  readonly type = 'ValidationError'

  constructor() {
    super('Invalid JWT token')
    this.name = 'InvalidToken'
  }
}
