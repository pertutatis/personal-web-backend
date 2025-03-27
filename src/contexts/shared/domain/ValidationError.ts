export abstract class ValidationError extends Error {
  constructor(
    readonly code: string,
    readonly message: string = code
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  toString(): string {
    return `[${this.code}] ${this.message}`;
  }
}
