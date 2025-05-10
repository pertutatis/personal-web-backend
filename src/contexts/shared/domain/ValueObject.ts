export abstract class ValueObject<T> {
  constructor(readonly value: T) {}

  equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false
    }
    return JSON.stringify(this.value) === JSON.stringify(other.value)
  }
}
