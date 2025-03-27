import { BookDescription } from '../BookDescription';
import { BookDescriptionEmpty } from '../BookDescriptionEmpty';
import { BookDescriptionLengthExceeded } from '../BookDescriptionLengthExceeded';

describe('BookDescription', () => {
  it('should create a valid book description', () => {
    const description = 'A valid book description';
    const bookDescription = new BookDescription(description);

    expect(bookDescription.value).toBe(description);
  });

  it('should allow multiline descriptions', () => {
    const description = 'Line 1\nLine 2\nLine 3';
    const bookDescription = new BookDescription(description);

    expect(bookDescription.value).toBe(description);
  });

  it('should fail when description is empty', () => {
    expect(() => {
      new BookDescription('');
    }).toThrow(BookDescriptionEmpty);

    expect(() => {
      new BookDescription('   ');
    }).toThrow(BookDescriptionEmpty);
  });

  it('should fail when description length exceeds maximum', () => {
    const description = 'a'.repeat(1001);
    
    expect(() => {
      new BookDescription(description);
    }).toThrow(BookDescriptionLengthExceeded);
  });

  it('should create with maximum length', () => {
    const description = 'a'.repeat(1000);
    const bookDescription = new BookDescription(description);

    expect(bookDescription.value).toBe(description);
  });

  it('should trim spaces', () => {
    const description = '  A description with spaces  ';
    const bookDescription = new BookDescription(description);

    expect(bookDescription.value).toBe(description.trim());
  });
});
