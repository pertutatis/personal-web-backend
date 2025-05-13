import { Identifier } from '../../../shared/domain/Identifier'
import { UserIdInvalid } from './UserIdInvalid'

export class UserId extends Identifier {
  constructor(value: string) {
    super(value)
  }
}
