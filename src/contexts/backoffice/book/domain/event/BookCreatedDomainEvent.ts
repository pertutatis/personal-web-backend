import { DomainEvent } from '@/contexts/shared/domain/event/DomainEvent'

export type BookCreatedDomainEventProps = {
  aggregateId: string
  title: string
  author: string
  isbn: string
  description: string
  purchaseLink: string | null
  createdAt: Date
  updatedAt: Date
}

export class BookCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'book.created'

  readonly title: string
  readonly author: string
  readonly isbn: string
  readonly description: string
  readonly purchaseLink: string | null
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(props: BookCreatedDomainEventProps) {
    super(BookCreatedDomainEvent.EVENT_NAME, props.aggregateId)

    this.title = props.title
    this.author = props.author
    this.isbn = props.isbn
    this.description = props.description
    this.purchaseLink = props.purchaseLink
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  toPrimitives(): BookCreatedDomainEventProps {
    return {
      aggregateId: this.aggregateId,
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      description: this.description,
      purchaseLink: this.purchaseLink,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
