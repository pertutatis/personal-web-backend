import { UuidGenerator } from '../domain/UuidGenerator'
import { v4 as uuidv4 } from 'uuid'

export class OfficialUuidGenerator implements UuidGenerator {
  generate(): string {
    return uuidv4()
  }
}
