import { ArticleId } from "../../ArticleId";
import { v4 as uuidv4 } from 'uuid';

export class ArticleIdMother {
  static create(value: string = "550e8400-e29b-41d4-a716-446655440000"): ArticleId {
    return new ArticleId(value);
  }

  static random(): ArticleId {
    return new ArticleId(uuidv4());
  }

  static invalid(): ArticleId {
    return new ArticleId("invalid-id");
  }
}
