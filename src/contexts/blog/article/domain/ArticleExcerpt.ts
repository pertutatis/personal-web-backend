import { StringValueObject } from '@/contexts/shared/domain/StringValueObject';
import { ArticleExcerptEmpty } from './ArticleExcerptEmpty';
import { ArticleExcerptLengthExceeded } from './ArticleExcerptLengthExceeded';
import { ArticleExcerptContainsHtml } from './ArticleExcerptContainsHtml';

export class ArticleExcerpt extends StringValueObject {
  static create(value: string): ArticleExcerpt {
    const trimmedValue = value.trim();
    
    if (trimmedValue.length === 0) {
      throw new ArticleExcerptEmpty();
    }

    if (trimmedValue.length > 300) {
      throw new ArticleExcerptLengthExceeded();
    }

    if (this.containsHtml(trimmedValue)) {
      throw new ArticleExcerptContainsHtml();
    }

    return new ArticleExcerpt(trimmedValue);
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
