import { ArticleId } from '../../ArticleId'
import { v4 as uuidv4 } from 'uuid'

export class ArticleIdMother {
  static create(
    value: string = 'cc8d8194-e099-4e3a-a431-6b4412dc5f6a',
  ): ArticleId {
    return new ArticleId(value)
  }

  static random(): ArticleId {
    return new ArticleId(uuidv4())
  }

  // Helper para tests de colecciones
  static multiple(count: number): ArticleId[] {
    return Array.from({ length: count }, () => this.random())
  }

  // Helper para tests de bases de datos
  static existing(): ArticleId {
    return new ArticleId('cc8d8194-e099-4e3a-a431-6b4412dc5f6a')
  }

  static nonExisting(): ArticleId {
    return new ArticleId('dd7d8194-e099-4e3a-a431-6b4412dc5f6b')
  }

  static invalidFormat(): string {
    return 'not-a-uuid'
  }

  static invalidVersion(): string {
    return 'cc8d8194-e099-5e3a-a431-6b4412dc5f6a' // UUID v5
  }
}
