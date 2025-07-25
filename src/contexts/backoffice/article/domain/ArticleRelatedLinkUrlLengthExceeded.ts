import { ValidationError } from '@/contexts/shared/domain/ValidationError'
import { ArticleRelatedLink } from './ArticleRelatedLink'

export class ArticleRelatedLinkUrlLengthExceeded extends ValidationError {
  constructor() {
    super(
      'ArticleRelatedLinkUrlLengthExceeded',
      `Link URL cannot exceed ${ArticleRelatedLink.URL_MAX_LENGTH} characters`,
    )
  }
}
