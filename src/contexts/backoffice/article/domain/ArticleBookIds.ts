import { ArticleBookIdsEmpty } from './ArticleBookIdsEmpty';
import { InvalidBookReferenceError } from './InvalidBookReferenceError';
import { BookRepository } from './BookRepository';

export class ArticleBookIds {
  static readonly MAX_BOOK_IDS = 10;
  private static bookRepository: BookRepository;

  private constructor(private readonly value: readonly string[]) {
    Object.freeze(this.value);
  }

  static setBookRepository(repository: BookRepository): void {
    this.bookRepository = repository;
  }

  private static async validateBookIds(value: string[]): Promise<void> {
    if (!this.bookRepository) {
      throw new Error('BookRepository not set');
    }

    if (value.length === 0) {
      return;
    }

    const uniqueIds = Array.from(new Set(value));
    const existPromises = uniqueIds.map(id => this.bookRepository.exists(id));
    const existResults = await Promise.all(existPromises);
    
    const nonExistentBookId = uniqueIds.find((_, index) => !existResults[index]);
    if (nonExistentBookId) {
      throw new InvalidBookReferenceError(nonExistentBookId);
    }
  }

  static async create(value: string[]): Promise<ArticleBookIds> {
    this.validateValue(value);
    await this.validateBookIds(value);
    return new ArticleBookIds(Array.from(new Set(value)));
  }

  static async fromValues(value: string[]): Promise<ArticleBookIds> {
    if (value.length > this.MAX_BOOK_IDS) {
      throw new Error(`Maximum of ${this.MAX_BOOK_IDS} book ids allowed`);
    }
    return this.create(value);
  }

  private static validateValue(value: string[]): void {
    if (!Array.isArray(value)) {
      throw new ArticleBookIdsEmpty();
    }
  }

  getValue(): string[] {
    return [...this.value];
  }

  get isEmpty(): boolean {
    return this.value.length === 0;
  }

  get length(): number {
    return this.value.length;
  }

  static async createEmpty(): Promise<ArticleBookIds> {
    return this.create([]);
  }

  equals(other: ArticleBookIds | null): boolean {
    if (!other) {
      return false;
    }

    if (this.length !== other.length) {
      return false;
    }

    const sortedThis = [...this.value].sort();
    const sortedOther = [...other.value].sort();

    return sortedThis.every((value, index) => value === sortedOther[index]);
  }

  includes(bookId: string): boolean {
    return this.value.includes(bookId);
  }

  async add(bookId: string): Promise<ArticleBookIds> {
    if (this.includes(bookId)) {
      return this;
    }

    if (this.length >= ArticleBookIds.MAX_BOOK_IDS) {
      throw new Error(`Maximum of ${ArticleBookIds.MAX_BOOK_IDS} book ids allowed`);
    }

    await ArticleBookIds.validateBookIds([bookId]);
    return new ArticleBookIds([...this.value, bookId]);
  }

  remove(bookId: string): ArticleBookIds {
    if (!this.includes(bookId)) {
      return this;
    }

    return new ArticleBookIds(this.value.filter(id => id !== bookId));
  }

  toString(): string {
    return this.value.join(', ');
  }

  toJSON(): string[] {
    return this.getValue();
  }
}
