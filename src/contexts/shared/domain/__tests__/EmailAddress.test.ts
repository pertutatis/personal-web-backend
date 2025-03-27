import { EmailAddress } from '../EmailAddress';
import { EmailAddressInvalid } from '../EmailAddressInvalid';

describe('EmailAddress', () => {
  it('should create a valid email address', () => {
    const email = 'test@example.com';
    const emailAddress = new EmailAddress(email);
    expect(emailAddress.value).toBe(email);
  });

  it('should throw EmailAddressInvalid for invalid format', () => {
    const invalidEmails = [
      'test',
      'test@',
      '@example.com',
      'test@example',
      'test@@example.com',
      'test@.com'
    ];

    invalidEmails.forEach(email => {
      expect(() => new EmailAddress(email)).toThrow(EmailAddressInvalid);
    });
  });

  it('should trim spaces', () => {
    const email = '  test@example.com  ';
    const emailAddress = new EmailAddress(email);
    expect(emailAddress.value).toBe('test@example.com');
  });

  it('should accept valid complex email formats', () => {
    const validEmails = [
      'test.name@example.com',
      'test+label@example.com',
      'test@sub.example.com',
      'test123@example.com',
      'test.name-123+label@sub.example.com'
    ];

    validEmails.forEach(email => {
      expect(() => new EmailAddress(email)).not.toThrow();
    });
  });
});
