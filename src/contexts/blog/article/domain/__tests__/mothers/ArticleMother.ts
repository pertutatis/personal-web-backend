import { Article } from "../../Article";
import { ArticleIdMother } from "./ArticleIdMother";
import { ArticleTitleMother } from "./ArticleTitleMother";
import { ArticleContentMother } from "./ArticleContentMother";
import { ArticleExcerptMother } from "./ArticleExcerptMother";
import { ArticleBookIdsMother } from "./ArticleBookIdsMother";
import { ArticleRelatedLinksMother } from "./ArticleRelatedLinksMother";
import { ArticleExcerpt } from "../../ArticleExcerpt";
import { ArticleRelatedLink } from "../../ArticleRelatedLink";
import { ArticleRelatedLinks } from "../../ArticleRelatedLinks";

export class ArticleMother {
  static create(
    id = ArticleIdMother.create(),
    title = ArticleTitleMother.create(),
    excerpt = ArticleExcerptMother.create('A guide to writing clean, maintainable code'),
    content = ArticleContentMother.create(),
    bookIds = ArticleBookIdsMother.create(),
    relatedLinks = ArticleRelatedLinksMother.create(),
    createdAt = new Date(),
    updatedAt = new Date()
  ): Article {
    return Article.create({
      id,
      title,
      excerpt,
      content,
      bookIds,
      relatedLinks,
      createdAt,
      updatedAt
    });
  }

  static random(): Article {
    const now = new Date();
    return Article.create({
      id: ArticleIdMother.random(),
      title: ArticleTitleMother.random(),
      excerpt: ArticleExcerptMother.random(),
      content: ArticleContentMother.random(),
      bookIds: ArticleBookIdsMother.random(),
      relatedLinks: ArticleRelatedLinksMother.create(2),
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

  static withExcerpt(excerpt: string): Article {
    return this.create(
      undefined,
      undefined,
      ArticleExcerpt.create(excerpt)
    );
  }

  static withContent(content: string): Article {
    return this.create(
      undefined,
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
      undefined,
      ArticleBookIdsMother.create(bookIds)
    );
  }

  static withRelatedLinks(links: Array<{ text: string; url: string }>): Article {
    const relatedLinks = links.map(link =>
      ArticleRelatedLink.create(link.text, link.url)
    );
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      ArticleRelatedLinks.create(relatedLinks)
    );
  }

  static withNoRelatedLinks(): Article {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      ArticleRelatedLinksMother.empty()
    );
  }

  static withMaxRelatedLinks(): Article {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      ArticleRelatedLinksMother.maxLinks()
    );
  }

  static withSingleBook(): Article {
    return this.create(
      undefined,
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
      ArticleExcerpt.create(ArticleExcerptMother.empty()),
      ArticleContentMother.empty(),
      ArticleBookIdsMother.empty(),
      undefined
    );
  }
}
