# ADR 011: Simplificación de Value Objects usando Constructores

## Estado
Implementado

## Contexto
Inicialmente, los Value Objects en el sistema utilizaban named constructors (métodos estáticos factory) para su creación e inicialización. Durante la implementación, identificamos diferentes tipos de Value Objects con necesidades específicas.

## Decisión
Hemos implementado diferentes patrones según el tipo y necesidades específicas de cada Value Object:

### 1. Patrón Básico (Constructor con Validaciones)
Para Value Objects con validaciones simples. El constructor es público y realiza las validaciones directamente.

```typescript
export class BookTitle extends StringValueObject {
  static readonly MAX_LENGTH = 255;

  constructor(value: string) {
    const trimmedValue = value.trim();
    BookTitle.validateEmpty(trimmedValue);
    BookTitle.validateLength(trimmedValue);
    super(trimmedValue);
  }
}
```

### 2. Patrón con Constructor Privado (Estado Especial o Primitivos)
Para Value Objects que necesitan manejo especial de nulos o conversión de primitivos.

```typescript
export class BookPurchaseLink {
  private constructor(public readonly value: string | null) {}

  static create(value: string | null | undefined): BookPurchaseLink {
    if (value === null || value === undefined) {
      return new BookPurchaseLink(null);
    }
    const trimmedValue = value.trim();
    this.validateUrl(trimmedValue);
    return new BookPurchaseLink(trimmedValue);
  }
}
```

### 3. Patrón con Factory Method (Lógica de Creación)
Para Value Objects que necesitan una lógica específica de transformación.

```typescript
export class ArticleSlug extends StringValueObject {
  static fromTitle(title: string): ArticleSlug {
    const slug = this.generateSlug(title);
    return new ArticleSlug(slug);
  }
}
```

### 4. Patrón de Identificadores
Para Value Objects que representan identidades. Caracterizado por:

#### Base Class Minimalista
```typescript
export abstract class Identifier extends StringValueObject {
  constructor(value: string) {
    super(value);
  }

  equals(other: Identifier): boolean {
    return other.constructor.name === this.constructor.name && 
           other.value === this.value;
  }
}
```

#### Implementaciones Simples
```typescript
export class BookId extends Identifier {
  constructor(value: string) {
    super(value);
  }
}
```

#### Object Mother Especializado
```typescript
export class ArticleIdMother {
  static create(value: string = 'default-uuid'): ArticleId {
    return new ArticleId(value);
  }

  static random(): ArticleId {
    return new ArticleId(uuidv4());
  }

  static sequence(index: number): ArticleId {
    return new ArticleId(`article-${index}`);
  }

  // Helpers para tests específicos
  static existing(): ArticleId {
    return new ArticleId('existing-article-id');
  }
}
```

#### Testing Completo
```typescript
describe('Identifier', () => {
  it('should work as object key', () => {
    const map = new Map<ArticleId, string>();
    map.set(id1, 'value1');
    expect(map.get(id1)).toBe('value1');
  });

  it('should handle sequential ids', () => {
    const ids = Array.from(
      { length: 5 }, 
      (_, i) => ArticleIdMother.sequence(i + 1)
    );
  });
});
```

## Características de los Patrones

### 1. Patrón Básico
- Constructor público con validaciones
- Métodos privados para validación
- Sin lógica de transformación
- Tests directos y simples

### 2. Constructor Privado
- Control total de la creación
- Manejo de casos especiales
- Método create() como interfaz pública
- Tests para casos nulos/undefined

### 3. Factory Method
- Lógica compleja de creación
- Transformación de datos
- Múltiples formas de creación
- Tests para cada método factory

### 4. Identificadores
- Sin validaciones de formato
- Herencia simple de base class
- Útiles como keys en colecciones
- Tests enfocados en colecciones

## Mejores Prácticas Establecidas

### Generales
1. Elegir el patrón según la necesidad
2. Mantener la cohesión y encapsulamiento
3. Separar validaciones en métodos privados
4. Usar constantes para configuración

### Testing
1. Cubrir casos básicos y edge
2. Verificar inmutabilidad
3. Probar casos de uso reales
4. Usar Object Mothers especializados

### Específicas para Identificadores
1. Mantener implementación simple
2. No añadir validaciones innecesarias
3. Proveer helpers útiles en Mother
4. Probar uso en colecciones

## Implementación Realizada

### Value Objects Migrados
1. Patrón Básico:
   - EmailAddress, BookTitle, BookAuthor
   - ArticleTitle, ArticleContent, ArticleExcerpt

2. Constructor Privado:
   - BookPurchaseLink (manejo de nulos)
   - ArticleRelatedLink/Links (conversión de primitivos)

3. Factory Method:
   - ArticleSlug (generación desde título)
   - BookIsbn (validación compleja)

4. Identificadores:
   - ArticleId, BookId

## Notas Finales
- La simplicidad es preferible cuando sea posible
- Los patrones deben aportar valor claro
- La consistencia dentro de cada patrón es importante
- Los tests son clave para documentar el uso
