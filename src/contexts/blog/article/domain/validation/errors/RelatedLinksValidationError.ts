import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class RelatedLinksValidationError extends ValidationError {
  constructor(code: string, message: string) {
    super(code, message);
    this.name = 'RelatedLinksValidationError';
  }
}
