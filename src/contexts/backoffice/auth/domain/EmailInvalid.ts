import { DomainError } from '../../../shared/domain/DomainError'

export class EmailInvalid extends DomainError {
  readonly type = 'ValidationError'

  constructor(value: string) {
    super(`The email "${value}" is invalid`)
    this.name = 'EmailInvalid'
  }
}
