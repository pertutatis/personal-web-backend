export abstract class ValueObject<T> {
  constructor(readonly value: T) {
    Object.freeze(this)
  }

  equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false
    }
    return JSON.stringify(this.value) === JSON.stringify(other.value)
  }

  toString(): string {
    if (typeof this.value === 'object') {
      return JSON.stringify(this.value)
    }
    return String(this.value)
  }

  toJSON(): T {
    return this.value
  }
}
