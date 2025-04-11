export class UuidValidator {
  private static readonly UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  static isValidUuid(value: string): boolean {
    return this.UUID_V4_REGEX.test(value);
  }

  static ensureValidUuid(value: string, errorMessage?: string): void {
    if (!this.isValidUuid(value)) {
      throw new Error(errorMessage || 'Invalid UUID v4 format');
    }
  }
}
