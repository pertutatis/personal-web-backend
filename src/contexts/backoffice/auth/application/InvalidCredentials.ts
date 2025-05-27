import { DomainError } from '../../../shared/domain/DomainError'

export class InvalidCredentials extends DomainError {
  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentials'
  }

  get type(): string {
    return 'InvalidCredentials'
  }

  get message(): string {
    return 'Invalid credentials'
  }
}
