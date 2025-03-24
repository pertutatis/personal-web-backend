import { BookDescription } from '../../BookDescription';

export class BookDescriptionMother {
  static create(value: string = 'A test book description'): BookDescription {
    return BookDescription.create(value);
  }

  static random(): BookDescription {
    const randomText = `Book description ${Math.random().toString(36).substring(7)}`;
    return BookDescription.create(randomText);
  }

  static tooLong(): string {
    return 'a'.repeat(1001);
  }

  static empty(): string {
    return '';
  }

  static withMultipleLines(): BookDescription {
    return BookDescription.create('Line 1\nLine 2\nLine 3');
  }

  static atMaxLength(): BookDescription {
    return BookDescription.create('a'.repeat(1000));
  }
}
