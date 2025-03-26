import { ArticleRelatedLink } from "../../ArticleRelatedLink";

export class ArticleRelatedLinkMother {
  static create(
    text: string = "Aprende más sobre Clean Code",
    url: string = "https://example.com/clean-code"
  ): ArticleRelatedLink {
    return ArticleRelatedLink.create(text, url);
  }

  static random(): ArticleRelatedLink {
    const texts = [
      "Guía completa de TDD",
      "Patrones de diseño en TypeScript",
      "Arquitectura hexagonal en práctica",
      "Principios SOLID explicados",
      "Clean Code en JavaScript"
    ];
    
    const domains = ["example.com", "blog.dev", "docs.tech", "learn.io", "guide.dev"];
    const paths = ["guide", "tutorial", "article", "doc", "reference"];
    
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomPath = paths[Math.floor(Math.random() * paths.length)];
    
    return ArticleRelatedLink.create(
      randomText,
      `https://${randomDomain}/${randomPath}`
    );
  }

  static withEmptyText(): ArticleRelatedLink {
    return ArticleRelatedLink.create("", "https://example.com");
  }

  static withEmptyUrl(): ArticleRelatedLink {
    return ArticleRelatedLink.create("Text", "");
  }

  static withInvalidUrl(): ArticleRelatedLink {
    return ArticleRelatedLink.create("Text", "not-a-valid-url");
  }

  static withTextTooLong(): ArticleRelatedLink {
    return ArticleRelatedLink.create("a".repeat(101), "https://example.com");
  }

  static withUrlTooLong(): ArticleRelatedLink {
    return ArticleRelatedLink.create(
      "Text",
      `https://example.com/${"a".repeat(2000)}`
    );
  }

  static withWhitespace(): ArticleRelatedLink {
    return ArticleRelatedLink.create(
      "  Text with spaces  ",
      "  https://example.com/path  "
    );
  }

  static maxLengths(): ArticleRelatedLink {
    return ArticleRelatedLink.create(
      "a".repeat(100),
      `https://example.com/${"a".repeat(1980)}`
    );
  }
}
