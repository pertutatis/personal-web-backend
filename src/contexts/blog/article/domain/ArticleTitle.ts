import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { ArticleTitleEmpty } from './ArticleTitleEmpty';
import { ArticleTitleLengthExceeded } from './ArticleTitleLengthExceeded';

export class ArticleTitle extends StringValueObject {
  static create(value: string): ArticleTitle {
    const trimmedValue = value.trim();
    
    if (trimmedValue.length === 0) {
      throw new ArticleTitleEmpty();
    }

    if (trimmedValue.length > 150) {
      throw new ArticleTitleLengthExceeded();
    }

    return new ArticleTitle(trimmedValue);
  }
}
