import { ArticleTitle } from "../../ArticleTitle";

export class ArticleTitleMother {
  static create(value: string = "Clean Code Principles"): ArticleTitle {
    return new ArticleTitle(value);
  }

  static empty(): ArticleTitle {
    return new ArticleTitle("");
  }

  static withSpacesOnly(): ArticleTitle {
    return new ArticleTitle("   ");
  }

  static tooLong(): ArticleTitle {
    return new ArticleTitle("a".repeat(151));
  }

  static maxLength(): ArticleTitle {
    return new ArticleTitle("a".repeat(150));
  }

  static withWhitespace(): ArticleTitle {
    return new ArticleTitle("  Title With Spaces  ");
  }

  static random(): ArticleTitle {
    const titles = [
      "Clean Code Best Practices",
      "Design Patterns in JavaScript",
      "TDD and BDD Guide",
      "DDD Implementation Tips",
      "SOLID Principles Explained"
    ];
    return new ArticleTitle(titles[Math.floor(Math.random() * titles.length)]);
  }
}
