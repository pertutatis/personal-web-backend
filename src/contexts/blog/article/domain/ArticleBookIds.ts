import { ValidationError } from '@/contexts/shared/domain/ValidationError';

export class ArticleBookIds {
  private readonly value: string[];

  constructor(bookIds: string[]) {
    if (!Array.isArray(bookIds)) {
      throw new ValidationError('bookIds must be an array');
    }

    if (bookIds.some(id => typeof id !== 'string' || !id)) {
      throw new ValidationError('All book IDs must be non-empty strings');
    }

    const uniqueValues = Array.from(new Set(bookIds));
    this.value = uniqueValues;
  }

  getValue(): string[] {
    return [...this.value];
  }

  static create(value: string[]): ArticleBookIds {
    if (!value) {
      return new ArticleBookIds([]);
    }
    return new ArticleBookIds(value);
  }

  toString(): string {
    return this.value.join(',');
  }

  toJSON(): string[] {
    return [...this.value];
  }

  equals(other: ArticleBookIds): boolean {
    if (this.value.length !== other.value.length) {
      return false;
    }

    const thisSet = new Set(this.value);
    return other.value.every(id => thisSet.has(id));
  }
}

import { ArticleBookIdsEmpty } from './ArticleBookIdsEmpty';
