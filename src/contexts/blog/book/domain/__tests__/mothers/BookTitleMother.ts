import { BookTitle } from "../../BookTitle";

export class BookTitleMother {
  static create(value: string = "Clean Code"): BookTitle {
    return new BookTitle(value);
  }

  static random(): BookTitle {
    const adjectives = ["Clean", "Advanced", "Modern", "Professional", "Essential"];
    const subjects = ["Code", "Architecture", "Development", "Programming", "Engineering"];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    return new BookTitle(`${randomAdjective} ${randomSubject}`);
  }

  static tooLong(): BookTitle {
    // Genera un título de 256 caracteres (excede el límite de 255)
    return new BookTitle("a".repeat(256));
  }

  static maxLength(): BookTitle {
    // Genera un título de exactamente 255 caracteres
    return new BookTitle("a".repeat(255));
  }

  static empty(): BookTitle {
    return new BookTitle("");
  }

  static withSpacesOnly(): BookTitle {
    return new BookTitle("   ");
  }

  static withSpecialCharacters(): BookTitle {
    return new BookTitle("¡The Amazing Book! (2nd Edition) - Vol. 1");
  }

  static withWhitespace(): BookTitle {
    return new BookTitle("  Book Title  ");
  }

  static fromValue(value: string): BookTitle {
    return new BookTitle(value);
  }
}
