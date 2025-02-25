export class Collection<T> {
  constructor(readonly items: T[]) {}

  get length(): number {
    return this.items.length;
  }

  map<U>(fn: (item: T) => U): Collection<U> {
    return new Collection(this.items.map(fn));
  }

  filter(fn: (item: T) => boolean): Collection<T> {
    return new Collection(this.items.filter(fn));
  }

  find(fn: (item: T) => boolean): T | undefined {
    return this.items.find(fn);
  }

  forEach(fn: (item: T) => void): void {
    this.items.forEach(fn);
  }

  some(fn: (item: T) => boolean): boolean {
    return this.items.some(fn);
  }

  every(fn: (item: T) => boolean): boolean {
    return this.items.every(fn);
  }

  toArray(): T[] {
    return [...this.items];
  }
}
