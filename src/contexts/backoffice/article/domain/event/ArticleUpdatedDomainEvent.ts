import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent'

export type ArticleUpdatedDomainEventProps = {
  aggregateId: string
  title: string
  content: string
  excerpt: string
  bookIds: string[]
  relatedLinks: Array<{ text: string; url: string }>
  slug: string
  status: string
  updatedAt: Date
  occurredOn: Date
}

export class ArticleUpdatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'article.updated'

  readonly title: string
  readonly content: string
  readonly excerpt: string
  readonly bookIds: string[]
  readonly relatedLinks: Array<{ text: string; url: string }>
  readonly slug: string
  readonly status: string
  readonly updatedAt: Date

  constructor(props: ArticleUpdatedDomainEventProps) {
    super(
      ArticleUpdatedDomainEvent.EVENT_NAME,
      props.aggregateId,
      props.occurredOn,
    )

    this.title = props.title
    this.content = props.content
    this.excerpt = props.excerpt
    this.bookIds = props.bookIds
    this.relatedLinks = props.relatedLinks
    this.slug = props.slug
    this.status = props.status
    this.updatedAt = props.updatedAt
  }

  toPrimitives() {
    return {
      title: this.title,
      content: this.content,
      excerpt: this.excerpt,
      bookIds: this.bookIds,
      relatedLinks: this.relatedLinks,
      slug: this.slug,
      status: this.status,
      updatedAt: this.updatedAt,
    }
  }
}
