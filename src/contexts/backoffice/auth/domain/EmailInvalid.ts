import { DomainError } from '../../../shared/domain/DomainError'

export class EmailInvalid extends DomainError {
  constructor(value: string) {
    super(`The email "${value}" is invalid`)
    this.name = 'EmailInvalid'
  }

  get type(): string {
    return 'EMAIL_INVALID'
  }
}
