import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { ArticleSlugEmpty } from './ArticleSlugEmpty';
import { ArticleSlugInvalid } from './ArticleSlugInvalid';
import { ArticleSlugLengthExceeded } from './ArticleSlugLengthExceeded';

export class ArticleSlug extends StringValueObject {
  static fromTitle(title: string): ArticleSlug {
    const slug = ArticleSlug.generateSlug(title);
    return new ArticleSlug(slug);
  }

  private static generateSlug(text: string): string {
    if (!text || text.trim().length === 0) {
      throw new ArticleSlugEmpty();
    }

    // Convertir a slug en un solo paso
    const slugified = text
      .toLowerCase() // Convertir a minúsculas
      .normalize('NFD') // Descomponer caracteres en sus componentes
      .replace(/[^a-z0-9\s-]/g, '') // Eliminar todo excepto letras, números, espacios y guiones
      .trim() // Eliminar espacios al inicio y final
      .replace(/\s+/g, '-') // Convertir espacios en guiones
      .replace(/-+/g, '-') // Eliminar guiones consecutivos
      .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final

    if (slugified.length === 0) {
      throw new ArticleSlugInvalid();
    }

    if (slugified.length > 100) {
      throw new ArticleSlugLengthExceeded();
    }

    return slugified;
  }

  protected validateValue(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ArticleSlugEmpty();
    }

    if (value.length > 100) {
      throw new ArticleSlugLengthExceeded();
    }

    // Verificar que solo contiene letras minúsculas, números y guiones
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      throw new ArticleSlugInvalid();
    }
  }

  constructor(value: string) {
    super(value);
    this.validateValue(value);
  }
}
