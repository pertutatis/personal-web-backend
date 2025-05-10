import { Identifier } from '../../../shared/domain/Identifier'
import { UserIdInvalid } from './UserIdInvalid'

export class UserId extends Identifier {
  constructor(value: string) {
    super(value)
    this.ensureValidUserId(value)
  }

  private ensureValidUserId(id: string): void {
    if (!this.isValid(id)) {
      throw new UserIdInvalid(id)
    }
  }
}
