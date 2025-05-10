import { DomainError } from '../../../shared/domain/DomainError'

export class InvalidToken extends DomainError {
  constructor() {
    super('Invalid JWT token')
    this.name = 'InvalidToken'
  }

  get type(): string {
    return 'INVALID_TOKEN'
  }
}
