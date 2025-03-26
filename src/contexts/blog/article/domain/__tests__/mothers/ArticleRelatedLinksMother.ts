import { ArticleRelatedLinks } from "../../ArticleRelatedLinks";
import { ArticleRelatedLinkMother } from "./ArticleRelatedLinkMother";

export class ArticleRelatedLinksMother {
  static create(count: number = 2): ArticleRelatedLinks {
    const links = Array.from({ length: count }, (_, index) =>
      ArticleRelatedLinkMother.create(
        `Link ${index + 1}`,
        `https://example.com/path-${index + 1}`
      )
    );
    return ArticleRelatedLinks.create(links);
  }

  static empty(): ArticleRelatedLinks {
    return ArticleRelatedLinks.create([]);
  }

  static withDuplicates(): ArticleRelatedLinks {
    const links = [
      ArticleRelatedLinkMother.create(
        "Link 1",
        "https://example.com/duplicate"
      ),
      ArticleRelatedLinkMother.create(
        "Link 2",
        "https://example.com/duplicate"
      )
    ];
    return ArticleRelatedLinks.create(links);
  }

  static exceedingMaxLinks(): ArticleRelatedLinks {
    const links = Array.from({ length: 11 }, (_, index) =>
      ArticleRelatedLinkMother.create(
        `Link ${index + 1}`,
        `https://example.com/path-${index + 1}`
      )
    );
    return ArticleRelatedLinks.create(links);
  }

  static maxLinks(): ArticleRelatedLinks {
    const links = Array.from({ length: 10 }, (_, index) =>
      ArticleRelatedLinkMother.create(
        `Link ${index + 1}`,
        `https://example.com/path-${index + 1}`
      )
    );
    return ArticleRelatedLinks.create(links);
  }
}
