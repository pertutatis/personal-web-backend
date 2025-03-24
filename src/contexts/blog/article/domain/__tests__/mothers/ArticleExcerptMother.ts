import { ArticleExcerpt } from '../../ArticleExcerpt';

export class ArticleExcerptMother {
  static create(value: string): ArticleExcerpt {
    return ArticleExcerpt.create(value);
  }

  static random(): ArticleExcerpt {
    return this.create('Random excerpt ' + Math.random());
  }

  static withMaxLength(): ArticleExcerpt {
    return this.create('a'.repeat(300));
  }

  static withHtml(): string {
    return '<p>Invalid excerpt with HTML</p>';
  }

  static empty(): string {
    return '';
  }

  static tooLong(): string {
    return 'a'.repeat(301);
  }

  static valid(): ArticleExcerpt {
    return this.create('This is a valid article excerpt');
  }
}
