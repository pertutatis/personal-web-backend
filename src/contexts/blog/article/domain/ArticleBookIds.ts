export class ArticleBookIds {
  private readonly value: string[];

  constructor(bookIds: string[]) {
    const uniqueValues = Array.from(new Set(bookIds));
    
    if (uniqueValues.length === 0) {
      throw new ArticleBookIdsEmpty();
    }
    
    this.value = uniqueValues;
  }

  getValue(): string[] {
    return [...this.value];
  }

  static create(value: string[]): ArticleBookIds {
    return new ArticleBookIds(value);
  }

  toString(): string {
    return this.value.join(',');
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
