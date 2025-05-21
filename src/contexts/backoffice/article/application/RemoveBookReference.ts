import { ArticleRepository } from '../domain/ArticleRepository';

export class RemoveBookReference {
  constructor(private readonly repository: ArticleRepository) {}

  async run(bookId: string): Promise<void> {
    await this.repository.removeBookReference(bookId);
  }
}
