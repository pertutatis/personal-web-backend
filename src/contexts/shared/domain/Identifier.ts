import { StringValueObject } from './StringValueObject';

export abstract class Identifier extends StringValueObject {
  constructor(value: string) {
    super(value);
  }

  equals(other: Identifier): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
