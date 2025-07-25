import { ValidationError } from '../../../shared/domain/ValidationError'

export class ArticleRelatedLinksDuplicated extends ValidationError {
  constructor(url?: string) {
    super(
      'ARTICLE_RELATED_LINKS_DUPLICATED',
      url ? `URL ${url} is duplicated` : 'Duplicate URLs are not allowed',
    )
  }
}
