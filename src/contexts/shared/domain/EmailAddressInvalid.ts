import { DomainError } from './DomainError';

export class EmailAddressInvalid extends DomainError {
  constructor(email: string) {
    super(`The email '${email}' is not valid`);
  }

  get type(): string {
    return 'EMAIL_ADDRESS_INVALID';
  }
}
