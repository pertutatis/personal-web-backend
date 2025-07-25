import { ValidationError } from '@/contexts/shared/domain/ValidationError'

export class BookPurchaseLinkLengthExceeded extends ValidationError {
  constructor(value: string = '') {
    super(
      'BookPurchaseLinkLengthExceeded',
      `Book purchase link length cannot exceed 500 characters. Got: ${value}`,
    )
  }
}
