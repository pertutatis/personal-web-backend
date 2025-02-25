import { Identifier } from '@/contexts/shared/domain/Identifier';

export class ArticleId extends Identifier {
  static create(value: string): ArticleId {
    return new ArticleId(value);
  }
}
