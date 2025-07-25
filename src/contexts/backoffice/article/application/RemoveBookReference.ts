import { ArticleRepository } from '../domain/ArticleRepository'
import { BookId } from '../../book/domain/BookId'

export class RemoveBookReference {
  constructor(private readonly repository: ArticleRepository) {}

  async run(bookId: string): Promise<void> {
    const validBookId = new BookId(bookId)
    await this.repository.removeBookReference(validBookId)
  }
}
