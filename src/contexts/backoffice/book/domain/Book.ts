import { AggregateRoot } from '@/contexts/shared/domain/AggregateRoot'
import { BookId } from './BookId'
import { BookTitle } from './BookTitle'
import { BookAuthor } from './BookAuthor'
import { BookIsbn } from './BookIsbn'
import { BookDescription } from './BookDescription'
import { BookPurchaseLink } from './BookPurchaseLink'
import { BookImageUrl } from './BookImageUrl'
import { BookCreatedDomainEvent } from './event/BookCreatedDomainEvent'
import { BookUpdatedDomainEvent } from './event/BookUpdatedDomainEvent'

type BookPrimitives = {
  id: string
  title: string
  author: string
  isbn: string
  description: string
  purchaseLink: string | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

type CreateBookParams = {
  id: BookId
  title: BookTitle
  author: BookAuthor
  isbn: BookIsbn
  description: BookDescription
  purchaseLink: BookPurchaseLink
  imageUrl: BookImageUrl
  createdAt: Date
  updatedAt: Date
}

type UpdateBookParams = {
  title: BookTitle
  author: BookAuthor
  isbn: BookIsbn
  description: BookDescription
  purchaseLink: BookPurchaseLink
}

export class Book extends AggregateRoot {
  readonly id: BookId
  title: BookTitle
  author: BookAuthor
  isbn: BookIsbn
  description: BookDescription
  purchaseLink: BookPurchaseLink
  imageUrl: BookImageUrl
  readonly createdAt: Date
  updatedAt: Date

  constructor(params: CreateBookParams) {
    super()
    this.id = params.id
    this.title = params.title
    this.author = params.author
    this.isbn = params.isbn
    this.description = params.description
    this.purchaseLink = params.purchaseLink
    this.imageUrl = params.imageUrl
    this.createdAt = params.createdAt
    this.updatedAt = params.updatedAt
  }

  static create(params: CreateBookParams): Book {
    const book = new Book(params)
    book.record(
      new BookCreatedDomainEvent({
        aggregateId: params.id.value,
        title: params.title.value,
        author: params.author.value,
        isbn: params.isbn.value,
        description: params.description.value,
        purchaseLink: params.purchaseLink.value,
        imageUrl: params.imageUrl.value,
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
      }),
    )
    return book
  }

  update(params: UpdateBookParams): void {
    const now = new Date()

    Object.assign(this, {
      title: params.title,
      author: params.author,
      isbn: params.isbn,
      description: params.description,
      purchaseLink: params.purchaseLink,
      updatedAt: now,
    })

    this.record(
      new BookUpdatedDomainEvent({
        aggregateId: this.id.value,
        title: params.title.value,
        author: params.author.value,
        isbn: params.isbn.value,
        description: params.description.value,
        purchaseLink: params.purchaseLink.value,
        updatedAt: now,
      }),
    )
  }

  updateImageUrl(imageUrl: BookImageUrl): void {
    this.imageUrl = imageUrl
    this.updatedAt = new Date()
  }

  toFormattedPrimitives(): BookPrimitives {
    return {
      id: this.id.value,
      title: this.title.value,
      author: this.author.value,
      isbn: this.isbn.toFormattedString(),
      description: this.description.value,
      purchaseLink: this.purchaseLink.value,
      imageUrl: this.imageUrl.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  toPrimitives(): BookPrimitives {
    return {
      id: this.id.value,
      title: this.title.value,
      author: this.author.value,
      isbn: this.isbn.value,
      description: this.description.value,
      purchaseLink: this.purchaseLink.value,
      imageUrl: this.imageUrl.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
