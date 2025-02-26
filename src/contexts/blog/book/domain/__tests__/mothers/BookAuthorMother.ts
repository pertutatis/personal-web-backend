import { BookAuthor } from "../../BookAuthor";

export class BookAuthorMother {
  static create(value: string = "Robert C. Martin"): BookAuthor {
    return new BookAuthor(value);
  }

  static random(): BookAuthor {
    const firstNames = ["Robert", "Martin", "Kent", "Eric", "Grady"];
    const lastNames = ["Martin", "Fowler", "Beck", "Evans", "Booch"];
    const middleInitials = ["C", "G", "R", "L", "J"];
    
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomMiddleInitial = middleInitials[Math.floor(Math.random() * middleInitials.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return new BookAuthor(`${randomFirstName} ${randomMiddleInitial}. ${randomLastName}`);
  }

  static empty(): BookAuthor {
    return new BookAuthor("");
  }

  static withSpacesOnly(): BookAuthor {
    return new BookAuthor("   ");
  }

  static tooLong(): BookAuthor {
    return new BookAuthor("a".repeat(BookAuthor.MAX_LENGTH + 1));
  }

  static maxLength(): BookAuthor {
    return new BookAuthor("a".repeat(BookAuthor.MAX_LENGTH));
  }

  static withSpecialCharacters(): BookAuthor {
    return new BookAuthor("Gabriel García Márquez");
  }

  static withWhitespace(): BookAuthor {
    return new BookAuthor("  John Doe  ");
  }

  static sameAs(other: string): BookAuthor {
    return new BookAuthor(other);
  }

  // Para mantener compatibilidad con otros tests
  static fromValue(value: string): BookAuthor {
    return new BookAuthor(value);
  }
}
