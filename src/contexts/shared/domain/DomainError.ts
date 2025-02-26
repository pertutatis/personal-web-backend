export abstract class DomainError extends Error {
  abstract readonly type: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON(): { type: string; message: string } {
    return {
      type: this.type,
      message: this.message
    };
  }
}

export type DomainErrorJSON = {
  type: string;
  message: string;
};
