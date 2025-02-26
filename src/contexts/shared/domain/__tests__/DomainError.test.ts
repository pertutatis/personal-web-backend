import { DomainError } from '../DomainError';

class TestError extends DomainError {
  readonly type = 'TestError';

  constructor(message: string) {
    super(message);
  }
}

describe('DomainError', () => {
  it('should create error with correct type and message', () => {
    const message = 'Test error message';
    const error = new TestError(message);

    expect(error.type).toBe('TestError');
    expect(error.message).toBe(message);
    expect(error.name).toBe('TestError');
  });

  it('should serialize to JSON correctly', () => {
    const message = 'Test error message';
    const error = new TestError(message);
    const json = error.toJSON();

    expect(json).toEqual({
      type: 'TestError',
      message: message
    });
  });

  it('should capture stack trace', () => {
    const error = new TestError('Test error');
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('TestError');
  });

  it('should be instance of Error', () => {
    const error = new TestError('Test error');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
    expect(error).toBeInstanceOf(TestError);
  });
});
