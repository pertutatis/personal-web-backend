export abstract class StringValueObject {
  constructor(readonly value: string) {}

  toString(): string {
    return this.value;
  }

  equals(other: StringValueObject): boolean {
    return this.value === other?.value;
  }
}
