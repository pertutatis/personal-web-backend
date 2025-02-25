export abstract class DomainError extends Error {
  constructor(readonly message: string) {
    super(message);
  }

  abstract get type(): string;
}
