import { BookId } from '../../BookId'
import { v4 as uuidv4 } from 'uuid'

const validTestUuid = '123e4567-e89b-4456-a456-426614174000'
const sequenceTemplate = '00000000-0000-4000-a000-000000000000'

export class BookIdMother {
  static create(value: string = validTestUuid): BookId {
    return new BookId(value)
  }

  static random(): BookId {
    return new BookId(uuidv4())
  }

  static sequence(index: number): BookId {
    // Generate a deterministic UUID v4 based on index
    // Replace first digits with index while maintaining v4 format
    const indexStr = index.toString().padStart(8, '0')
    const uuid = sequenceTemplate.replace('00000000', indexStr)
    return new BookId(uuid)
  }

  // These methods are useful for testing validation failures
  static invalid(): string {
    return 'invalid-id'
  }

  static empty(): string {
    return ''
  }

  static notV4(): string {
    return '123e4567-e89b-12d3-a456-426614174000' // v1 format
  }
}
