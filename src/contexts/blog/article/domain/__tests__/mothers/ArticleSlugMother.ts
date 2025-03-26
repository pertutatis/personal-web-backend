import { ArticleSlug } from "../../ArticleSlug";

export class ArticleSlugMother {
  static create(title: string = "10 Clean Code Principles Every Developer Should Follow"): ArticleSlug {
    return ArticleSlug.fromTitle(title);
  }

  static fromSpanishTitle(): ArticleSlug {
    return ArticleSlug.fromTitle(
      "Cómo Implementar Patrones de Diseño en JavaScript"
    );
  }

  static withSpecialCharacters(): ArticleSlug {
    return ArticleSlug.fromTitle(
      "Node.js & TypeScript: Una Guía Práctica!"
    );
  }

  static withMultipleSpaces(): ArticleSlug {
    return ArticleSlug.fromTitle(
      "   Clean   Code:   Principios   Básicos   "
    );
  }

  static tooLong(): ArticleSlug {
    return ArticleSlug.fromTitle(
      "a".repeat(101)
    );
  }

  static maxLength(): ArticleSlug {
    return ArticleSlug.fromTitle(
      "a".repeat(100)
    );
  }

  static empty(): ArticleSlug {
    return ArticleSlug.fromTitle("");
  }

  static withSpacesOnly(): ArticleSlug {
    return ArticleSlug.fromTitle("   ");
  }

  static withInvalidCharacters(): ArticleSlug {
    return ArticleSlug.fromTitle(
      "@#$%^&*()"
    );
  }

  static withConsecutiveDashes(): ArticleSlug {
    return ArticleSlug.fromTitle(
      "Clean---Code---Principles"
    );
  }
}
