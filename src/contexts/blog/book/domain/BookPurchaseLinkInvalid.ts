import { DomainError } from '@/contexts/shared/domain/DomainError';

export class BookPurchaseLinkInvalid extends DomainError {
  constructor(value: string) {
    super(`Book purchase link is not a valid URL: ${value}`);
    this.name = 'BookPurchaseLinkInvalid';
  }

  readonly type = 'BookPurchaseLinkInvalid';
}
