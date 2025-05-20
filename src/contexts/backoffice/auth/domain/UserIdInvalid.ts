import { DomainError } from '../../../shared/domain/DomainError'

export class UserIdInvalid extends DomainError {
  readonly type = 'ValidationError'

  constructor(value: string) {
    super(`The user id "${value}" is not valid`)
    this.name = 'UserIdInvalid'
  }
}
