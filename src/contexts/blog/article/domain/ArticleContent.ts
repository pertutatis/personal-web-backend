import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { ArticleContentEmpty } from './ArticleContentEmpty';
import { ArticleContentLengthExceeded } from './ArticleContentLengthExceeded';

export class ArticleContent extends StringValueObject {
  static create(value: string): ArticleContent {
    const trimmedValue = value.trim();
    
    if (trimmedValue.length === 0) {
      throw new ArticleContentEmpty();
    }

    if (trimmedValue.length > 10000) {
      throw new ArticleContentLengthExceeded();
    }

    return new ArticleContent(trimmedValue);
  }
}
