import { Book } from '../domain/Book'
import { BookRepository } from '../domain/BookRepository'
import { Collection } from '@/contexts/shared/domain/Collection'
import { InvalidPaginationParams } from './InvalidPaginationParams'

type PaginationParams = {
  page: number
  limit: number
}

export class ListBooks {
  constructor(private readonly repository: BookRepository) {}

  async run({ page, limit }: PaginationParams): Promise<Collection<Book>> {
    if (page <= 0 || limit <= 0) {
      throw new InvalidPaginationParams()
    }

    return this.repository.searchByPage(page, limit)
  }
}
