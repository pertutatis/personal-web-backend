import { BookIsbn } from "../../BookIsbn";

export class BookIsbnMother {
  static create(value: string = "978-0-13-235088-4"): BookIsbn {
    return new BookIsbn(value);
  }

  static isbn10(value: string = "0-7475-3269-9"): BookIsbn {
    return new BookIsbn(value);
  }

  static isbn13(value: string = "978-0-7475-3269-9"): BookIsbn {
    return new BookIsbn(value);
  }

  static invalidIsbn10(): BookIsbn {
    // Wrong checksum
    return new BookIsbn("0747532690");
  }

  static invalidIsbn13(): BookIsbn {
    // Wrong checksum
    return new BookIsbn("9780747532690");
  }

  static withHyphens(): BookIsbn {
    return new BookIsbn("0-7475-3269-9");
  }

  static withSpaces(): BookIsbn {
    return new BookIsbn("0 7475 3269 9");
  }

  static withoutSeparators(): BookIsbn {
    return new BookIsbn("0747532699");
  }

  static withXChecksum(): BookIsbn {
    return new BookIsbn("097522980X");
  }

  static withInvalidXPosition(): BookIsbn {
    return new BookIsbn("0X4753269X");
  }

  static invalidFormat(): BookIsbn {
    return new BookIsbn("123456789");
  }

  static empty(): BookIsbn {
    return new BookIsbn("");
  }

  // Este método se usa en otros tests, no podemos eliminarlo
  static invalid(): BookIsbn {
    return new BookIsbn("invalid-isbn");
  }

  static random(): BookIsbn {
    // Genera un ISBN-13 aleatorio válido
    const prefix = "978";
    const group = Math.floor(Math.random() * 10).toString();
    const publisher = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
    const title = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    
    // Calcula el dígito de control
    const digits = `${prefix}${group}${publisher}${title}`;
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += parseInt(digits[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = ((10 - (sum % 10)) % 10).toString();

    return new BookIsbn(`${prefix}-${group}-${publisher}-${title}-${checkDigit}`);
  }
}
