import { StringValueObject } from './StringValueObject';

export abstract class Identifier extends StringValueObject {
  constructor(value: string) {
    super(value);
  }

  equals(other: unknown): boolean {
    if (!(other instanceof Identifier)) {
      return false;
    }
    
    if (this.constructor !== other.constructor) {
      return false;
    }

    return this.value === other.value;
  }

  hashCode(): number {
    let hash = 0;
    // Incluir el nombre de la clase en el hash
    const typeString = this.constructor.name;
    for (let i = 0; i < typeString.length; i++) {
      hash = Math.imul(31, hash) + typeString.charCodeAt(i) | 0;
    }
    // Añadir el valor
    for (let i = 0; i < this.value.length; i++) {
      hash = Math.imul(31, hash) + this.value.charCodeAt(i) | 0;
    }
    return hash;
  }

  toString(): string {
    return this.value;
  }

  toJSON(): string {
    return this.value;
  }

  // Retorna una representación única para comparaciones
  valueOf(): string | number {
    return this.hashCode();
  }

  // Para comparaciones en Set
  [Symbol.toPrimitive](hint: string): string | number {
    if (hint === 'number') {
      return this.hashCode();
    }
    return `${this.constructor.name}:${this.value}`;
  }
}
