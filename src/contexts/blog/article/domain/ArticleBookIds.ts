import { ArticleBookIdsEmpty } from './ArticleBookIdsEmpty';

export class ArticleBookIds {
  private constructor(private readonly _value: string[]) {}

  static create(value: string[]): ArticleBookIds {
    const uniqueValues = Array.from(new Set(value));

    if (uniqueValues.length === 0) {
      throw new ArticleBookIdsEmpty();
    }

    return new ArticleBookIds(uniqueValues);
  }

  get value(): string[] {
    return this._value;
  }

  equals(other: ArticleBookIds): boolean {
    if (this._value.length !== other._value.length) {
      return false;
    }
    return this._value.every((id, index) => id === other._value[index]);
  }
}
