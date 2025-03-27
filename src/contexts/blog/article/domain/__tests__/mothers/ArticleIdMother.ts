import { ArticleId } from "../../ArticleId";
import { v4 as uuidv4 } from 'uuid';

export class ArticleIdMother {
  static create(value: string = 'cc8d8194-e099-4e3a-a431-6b4412dc5f6a'): ArticleId {
    return new ArticleId(value);
  }

  static random(): ArticleId {
    return new ArticleId(uuidv4());
  }

  static sequence(index: number): ArticleId {
    return new ArticleId(`article-${index}`);
  }

  static invalid(): ArticleId {
    return new ArticleId('invalid-id');
  }

  static empty(): ArticleId {
    return new ArticleId('');
  }

  static withDashes(): ArticleId {
    return new ArticleId('article-id-with-dashes');
  }

  static withNumbers(): ArticleId {
    return new ArticleId('article123');
  }

  static withSpecialChars(): ArticleId {
    return new ArticleId('article.id_special@chars');
  }

  // Helper para tests de colecciones
  static multiple(count: number): ArticleId[] {
    return Array.from({ length: count }, (_, index) => this.sequence(index + 1));
  }

  // Helper para tests de bases de datos
  static existing(): ArticleId {
    return new ArticleId('existing-article-id');
  }

  static nonExisting(): ArticleId {
    return new ArticleId('non-existing-article-id');
  }
}
