import { BookId } from '../domain/BookId'
import { BookImageUrl } from '../domain/BookImageUrl'
import { BookRepository } from '../domain/BookRepository'

export class UploadBookImage {
  constructor(private readonly repository: BookRepository) {}

  async run(id: string, imageUrl: string): Promise<void> {
    const bookId = new BookId(id)
    const book = await this.repository.search(bookId)

    if (!book) {
      throw new Error('Book not found')
    }

    book.updateImageUrl(BookImageUrl.create(imageUrl))
    await this.repository.update(book)
  }
}
