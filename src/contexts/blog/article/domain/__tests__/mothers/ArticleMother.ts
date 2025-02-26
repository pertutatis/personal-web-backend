import { Article } from "../../Article";
import { ArticleIdMother } from "./ArticleIdMother";
import { ArticleTitleMother } from "./ArticleTitleMother";
import { ArticleContentMother } from "./ArticleContentMother";
import { ArticleBookIdsMother } from "./ArticleBookIdsMother";

export class ArticleMother {
  static create(
    id = ArticleIdMother.create(),
    title = ArticleTitleMother.create(),
    content = ArticleContentMother.create(),
    bookIds = ArticleBookIdsMother.create(),
    createdAt = new Date(),
    updatedAt = new Date()
  ): Article {
    return Article.create({
      id,
      title,
      content,
      bookIds,
      createdAt,
      updatedAt
    });
  }

  static random(): Article {
    const now = new Date();
    return Article.create({
      id: ArticleIdMother.random(),
      title: ArticleTitleMother.random(),
      content: ArticleContentMother.random(),
      bookIds: ArticleBookIdsMother.random(),
      createdAt: now,
      updatedAt: now
    });
  }

  static withId(id: string): Article {
    return this.create(
      ArticleIdMother.create(id)
    );
  }

  static withTitle(title: string): Article {
    return this.create(
      undefined,
      ArticleTitleMother.create(title)
    );
  }

  static withContent(content: string): Article {
    return this.create(
      undefined,
      undefined,
      ArticleContentMother.create(content)
    );
  }

  static withBookIds(bookIds: string[]): Article {
    return this.create(
      undefined,
      undefined,
      undefined,
      ArticleBookIdsMother.create(bookIds)
    );
  }

  static withSingleBook(): Article {
    return this.create(
      undefined,
      undefined,
      undefined,
      ArticleBookIdsMother.withOne()
    );
  }

  static withManyBooks(count: number = 5): Article {
    return this.create(
      undefined,
      undefined,
      undefined,
      ArticleBookIdsMother.withMany(count)
    );
  }

  static withDates(createdAt: Date, updatedAt: Date): Article {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      createdAt,
      updatedAt
    );
  }

  static invalid(): Article {
    return this.create(
      ArticleIdMother.invalid(),
      ArticleTitleMother.empty(),
      ArticleContentMother.empty(),
      ArticleBookIdsMother.empty()
    );
  }
}
