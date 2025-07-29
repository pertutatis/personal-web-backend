import { ArticleStatus } from '../../ArticleStatus'

export class ArticleStatusMother {
  static draft(): ArticleStatus {
    return ArticleStatus.createDraft()
  }

  static published(): ArticleStatus {
    return ArticleStatus.createPublished()
  }

  static default(): ArticleStatus {
    return ArticleStatus.createDraft()
  }

  static invalid(): ArticleStatus {
    return new ArticleStatus('INVALID_STATUS')
  }

  static empty(): ArticleStatus {
    return new ArticleStatus('')
  }

  static nullValue(): ArticleStatus {
    return new ArticleStatus(null as any)
  }

  static lowerCase(): ArticleStatus {
    return new ArticleStatus('draft')
  }

  static fromString(value: string): ArticleStatus {
    return ArticleStatus.fromString(value)
  }

  static random(): ArticleStatus {
    const statuses = ['DRAFT', 'PUBLISHED']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    return ArticleStatus.fromString(randomStatus)
  }
} 