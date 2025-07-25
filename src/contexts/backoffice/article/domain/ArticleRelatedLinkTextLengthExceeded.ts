import { ValidationError } from '@/contexts/shared/domain/ValidationError'
import { ArticleRelatedLink } from './ArticleRelatedLink'

export class ArticleRelatedLinkTextLengthExceeded extends ValidationError {
  constructor() {
    super(
      'ArticleRelatedLinkTextLengthExceeded',
      `Link text cannot exceed ${ArticleRelatedLink.TEXT_MAX_LENGTH} characters`,
    )
  }
}
