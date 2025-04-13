import { Identifier } from '@/contexts/shared/domain/Identifier';
import { UuidValidator } from '@/contexts/shared/domain/validation/UuidValidator';

export class ArticleId extends Identifier {
  constructor(value: string) {
    super(value);
    UuidValidator.ensureValidUuid(value);
  }

  equals(other: unknown): boolean {
    if (!(other instanceof ArticleId)) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }
}
