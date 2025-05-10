import { DomainError } from '../../../shared/domain/DomainError'

export class UserIdInvalid extends DomainError {
  constructor(value: string) {
    super(`The user id "${value}" is not valid`)
    this.name = 'UserIdInvalid'
  }

  get type(): string {
    return 'USER_ID_INVALID'
  }
}
