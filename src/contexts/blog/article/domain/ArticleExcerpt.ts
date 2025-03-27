import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { ArticleExcerptEmpty } from './ArticleExcerptEmpty';
import { ArticleExcerptLengthExceeded } from './ArticleExcerptLengthExceeded';
import { ArticleExcerptContainsHtml } from './ArticleExcerptContainsHtml';

export class ArticleExcerpt extends StringValueObject {
  static readonly MAX_LENGTH = 300;

  constructor(value: string) {
    const trimmedValue = value.trim();
    ArticleExcerpt.validateEmpty(trimmedValue);
    ArticleExcerpt.validateLength(trimmedValue);
    ArticleExcerpt.validateNoHtml(trimmedValue);
    super(trimmedValue);
  }

  private static validateEmpty(value: string): void {
    if (value.length === 0) {
      throw new ArticleExcerptEmpty();
    }
  }

  private static validateLength(value: string): void {
    if (value.length > ArticleExcerpt.MAX_LENGTH) {
      throw new ArticleExcerptLengthExceeded();
    }
  }

  private static validateNoHtml(value: string): void {
    if (ArticleExcerpt.containsHtml(value)) {
      throw new ArticleExcerptContainsHtml();
    }
  }

  private static containsHtml(value: string): boolean {
    // Detectar etiquetas HTML básicas y malformadas
    const basicHtmlPattern = /<[^>]*>|<\/?|[<>]/;
    if (basicHtmlPattern.test(value)) {
      return true;
    }

    // Detectar scripts
    const scriptPattern = /<script[\s\S]*?>[\s\S]*?<\/script>/i;
    if (scriptPattern.test(value)) {
      return true;
    }

    // Detectar estilos
    const stylePattern = /<style[\s\S]*?>[\s\S]*?<\/style>/i;
    if (stylePattern.test(value)) {
      return true;
    }

    // Detectar atributos de estilo inline
    const inlineStylePattern = /style\s*=\s*["'][^"']*["']/i;
    if (inlineStylePattern.test(value)) {
      return true;
    }

    // Detectar entidades HTML
    const htmlEntityPattern = /&[a-z]+;/i;
    if (htmlEntityPattern.test(value)) {
      return true;
    }

    return false;
  }
}
