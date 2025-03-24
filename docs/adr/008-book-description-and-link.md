# ADR 008: Añadir Descripción y Link de Compra a los Libros

## Contexto
Los libros necesitan tener una descripción que proporcione más información sobre su contenido y un enlace donde se pueda comprar el libro.

## Decisión
Añadiremos dos nuevos campos a la entidad Book:
1. `description`: Un campo de texto que permita una descripción detallada del libro
2. `purchaseLink`: Una URL válida donde se pueda comprar el libro

### Value Objects
- `BookDescription`: Value Object para la descripción del libro
  - No puede estar vacío
  - Longitud máxima: 1000 caracteres
  - Puede contener múltiples líneas y formateo básico

- `BookPurchaseLink`: Value Object para el link de compra
  - Debe ser una URL válida
  - Longitud máxima: 2000 caracteres (estándar para URLs)
  - El campo es opcional

### Validaciones
1. `BookDescription`:
   - Se validará que no esté vacío
   - Se validará la longitud máxima
   - Se permitirá texto con múltiples líneas

2. `BookPurchaseLink`:
   - Se validará el formato de URL cuando se proporcione
   - Se validará la longitud máxima
   - Se permitirá que sea null/undefined

## Consecuencias
1. Positivas:
   - Mayor información sobre cada libro
   - Facilita la compra de libros a los usuarios
   - Mejor experiencia de usuario al tener más contexto

2. Negativas:
   - Mayor complejidad en la entidad Book
   - Necesidad de migración de datos
   - Más campos para validar y mantener

## Estado
Propuesto
