import { StringValueObject } from '@/contexts/shared/domain/StringValueObject'
import { ArticleContentEmpty } from './ArticleContentEmpty'
import { ArticleContentLengthExceeded } from './ArticleContentLengthExceeded'

export class ArticleContent extends StringValueObject {
  static readonly MAX_LENGTH = 20000

  constructor(value: string) {
    const trimmedValue = value.trim()
    ArticleContent.validateEmpty(trimmedValue)
    ArticleContent.validateLength(trimmedValue)
    super(trimmedValue)
  }

  private static validateEmpty(value: string): void {
    if (value.length === 0) {
      throw new ArticleContentEmpty()
    }
  }

  private static validateLength(value: string): void {
    if (value.length > ArticleContent.MAX_LENGTH) {
      throw new ArticleContentLengthExceeded()
    }
  }
}
