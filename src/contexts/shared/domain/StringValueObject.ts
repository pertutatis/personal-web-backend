export abstract class StringValueObject {
  constructor(private readonly _value: string) {}

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: StringValueObject): boolean {
    return other.constructor.name === this.constructor.name && other.toString() === this.toString();
  }
}
