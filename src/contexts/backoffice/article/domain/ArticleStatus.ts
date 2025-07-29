import { StringValueObject } from '@/contexts/shared/domain/StringValueObject'
import { ArticleStatusInvalid } from './ArticleStatusInvalid'

export class ArticleStatus extends StringValueObject {
  static readonly DRAFT = 'DRAFT'
  static readonly PUBLISHED = 'PUBLISHED'
  static readonly VALID_VALUES = [ArticleStatus.DRAFT, ArticleStatus.PUBLISHED] as const

  constructor(value: string) {
    ArticleStatus.validateNotNull(value)
    ArticleStatus.validateNotEmpty(value)
    ArticleStatus.validateValidValue(value)
    super(value)
  }

  private static validateNotNull(value: string): void {
    if (value === null || value === undefined) {
      throw new ArticleStatusInvalid()
    }
  }

  private static validateNotEmpty(value: string): void {
    if (typeof value === 'string' && value.trim().length === 0) {
      throw new ArticleStatusInvalid(value)
    }
  }

  private static validateValidValue(value: string): void {
    if (!ArticleStatus.VALID_VALUES.includes(value as any)) {
      throw new ArticleStatusInvalid(value)
    }
  }

  static createDraft(): ArticleStatus {
    return new ArticleStatus(ArticleStatus.DRAFT)
  }

  static createPublished(): ArticleStatus {
    return new ArticleStatus(ArticleStatus.PUBLISHED)
  }

  static fromString(value: string): ArticleStatus {
    return new ArticleStatus(value)
  }

  isDraft(): boolean {
    return this.value === ArticleStatus.DRAFT
  }

  isPublished(): boolean {
    return this.value === ArticleStatus.PUBLISHED
  }

  publish(): ArticleStatus {
    if (this.isPublished()) {
      return this
    }
    return ArticleStatus.createPublished()
  }

  toDraft(): ArticleStatus {
    if (this.isPublished()) {
      throw new ArticleStatusInvalid('Cannot change status from PUBLISHED to DRAFT')
    }
    return this
  }

  keepDraft(): ArticleStatus {
    if (!this.isDraft()) {
      throw new ArticleStatusInvalid('Status is not DRAFT')
    }
    return ArticleStatus.createDraft()
  }

  keepPublished(): ArticleStatus {
    if (!this.isPublished()) {
      throw new ArticleStatusInvalid('Status is not PUBLISHED')
    }
    return ArticleStatus.createPublished()
  }
} 