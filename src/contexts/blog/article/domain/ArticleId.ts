import { Identifier } from '@/contexts/shared/domain/Identifier';

export class ArticleId extends Identifier {
  constructor(value: string = '') {
    super(value);
  }

  static generate(): ArticleId {
    return new ArticleId(crypto.randomUUID());
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
