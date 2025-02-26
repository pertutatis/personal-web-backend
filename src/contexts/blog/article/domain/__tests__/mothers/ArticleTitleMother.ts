import { ArticleTitle } from "../../ArticleTitle";

export class ArticleTitleMother {
  static create(value: string = "10 Clean Code Principles Every Developer Should Follow"): ArticleTitle {
    return ArticleTitle.create(value);
  }

  static random(): ArticleTitle {
    const subjects = ["Clean Code", "Testing", "Architecture", "Design Patterns", "SOLID"];
    const topics = ["Principles", "Practices", "Guidelines", "Tips", "Techniques"];
    const numbers = ["5", "7", "10", "12", "15"];
    
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    return ArticleTitle.create(`${randomNumber} ${randomSubject} ${randomTopic} Every Developer Should Know`);
  }

  static tooLong(): ArticleTitle {
    // Max length for ArticleTitle is 150 characters
    return ArticleTitle.create("a".repeat(151));
  }

  static maxLength(): ArticleTitle {
    // Exactly 150 characters
    return ArticleTitle.create("a".repeat(150));
  }

  static empty(): ArticleTitle {
    return ArticleTitle.create("");
  }

  static withSpacesOnly(): ArticleTitle {
    return ArticleTitle.create("   ");
  }

  static withWhitespace(): ArticleTitle {
    return ArticleTitle.create("  Title with spaces  ");
  }

  static fromValue(value: string): ArticleTitle {
    return ArticleTitle.create(value);
  }
}
