import { ArticleBookIds } from '../../ArticleBookIds';
import { v4 as uuidv4 } from 'uuid';

export class ArticleBookIdsMother {
  static create(ids: string[] = ['cc8d8194-e099-4e3a-a431-6b4412dc5f6a']): ArticleBookIds {
    return ArticleBookIds.create(ids);
  }

  static random(count: number = 2): ArticleBookIds {
    return ArticleBookIds.create(
      Array.from({ length: count }, () => uuidv4())
    );
  }

  static empty(): ArticleBookIds {
    return ArticleBookIds.create([]);
  }

  static single(): ArticleBookIds {
    return this.create([uuidv4()]);
  }

  static withInvalidId(): ArticleBookIds {
    return this.create(['invalid-id']);
  }

  static withDuplicates(): ArticleBookIds {
    const id = uuidv4();
    return this.create([id, id]);
  }

  static withMaxItems(): ArticleBookIds {
    return this.random(10);
  }

  static exceedingMaxItems(): ArticleBookIds {
    return this.random(11);
  }

  static sequence(count: number): ArticleBookIds {
    return ArticleBookIds.create(
      Array.from({ length: count }, (_, i) => `book-${i + 1}`)
    );
  }
}
