export abstract class StringValueObject {
  constructor(private readonly _value: string) {
    Object.defineProperty(this, '_value', {
      value: _value,
      enumerable: true,
      writable: false,
      configurable: false,
    })
  }

  get value(): string {
    return this._value
  }

  equals(other: unknown): boolean {
    if (!other) {
      return false
    }

    if (!(other instanceof StringValueObject)) {
      return false
    }

    if (other.constructor.name !== this.constructor.name) {
      return false
    }

    return other.value === this.value
  }

  toString(): string {
    return this.value
  }

  toJSON(): string {
    return this.value
  }
}
