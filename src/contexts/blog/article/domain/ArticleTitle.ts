import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { ArticleTitleEmpty } from './ArticleTitleEmpty';
import { ArticleTitleLengthExceeded } from './ArticleTitleLengthExceeded';

export class ArticleTitle extends StringValueObject {
  static readonly MAX_LENGTH = 150;

  constructor(value: string) {
    const trimmedValue = value.trim();
    ArticleTitle.validateEmpty(trimmedValue);
    ArticleTitle.validateLength(trimmedValue);
    super(trimmedValue);
  }

  private static validateEmpty(value: string): void {
    if (value.length === 0) {
      throw new ArticleTitleEmpty();
    }
  }

  private static validateLength(value: string): void {
    if (value.length > ArticleTitle.MAX_LENGTH) {
      throw new ArticleTitleLengthExceeded();
    }
  }
}
