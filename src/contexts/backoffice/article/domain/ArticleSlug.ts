import { StringValueObject } from '@/contexts/shared/domain/StringValueObject'
import { ArticleSlugEmpty } from './ArticleSlugEmpty'
import { ArticleSlugInvalid } from './ArticleSlugInvalid'
import { ArticleSlugLengthExceeded } from './ArticleSlugLengthExceeded'

export class ArticleSlug extends StringValueObject {
  static readonly MAX_LENGTH = 100
  static readonly SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  constructor(value: string) {
    const trimmedValue = value.trim()
    ArticleSlug.validateEmpty(trimmedValue)
    ArticleSlug.validateLength(trimmedValue)
    ArticleSlug.validateFormat(trimmedValue)
    super(trimmedValue)
  }

  static fromTitle(title: string): ArticleSlug {
    const slug = ArticleSlug.generateSlug(title)
    return new ArticleSlug(slug)
  }

  private static generateSlug(text: string): string {
    if (!text || text.trim().length === 0) {
      throw new ArticleSlugEmpty()
    }

    // Convertir a slug en un solo paso
    const slugified = text
      .toLowerCase() // Convertir a minúsculas
      .normalize('NFD') // Descomponer caracteres en sus componentes
      .replace(/[^a-z0-9\s-]/g, '') // Eliminar todo excepto letras, números, espacios y guiones
      .trim() // Eliminar espacios al inicio y final
      .replace(/\s+/g, '-') // Convertir espacios en guiones
      .replace(/-+/g, '-') // Eliminar guiones consecutivos
      .replace(/^-+|-+$/g, '') // Eliminar guiones al inicio y final

    if (slugified.length === 0) {
      throw new ArticleSlugInvalid()
    }

    if (slugified.length > ArticleSlug.MAX_LENGTH) {
      throw new ArticleSlugLengthExceeded()
    }

    return slugified
  }

  private static validateEmpty(value: string): void {
    if (!value || value.length === 0) {
      throw new ArticleSlugEmpty()
    }
  }

  private static validateLength(value: string): void {
    if (value.length > ArticleSlug.MAX_LENGTH) {
      throw new ArticleSlugLengthExceeded()
    }
  }

  private static validateFormat(value: string): void {
    if (!ArticleSlug.SLUG_PATTERN.test(value)) {
      throw new ArticleSlugInvalid()
    }
  }
}
