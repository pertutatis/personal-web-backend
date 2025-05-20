# OBR-001: Integridad Referencial entre Libros y Artículos

## Casos de Uso

### 1. Creación de Artículo con Referencias a Libros
- **Descripción**: Al crear un artículo con referencias a libros, se debe validar que todos los libros existan
- **Actor Principal**: Usuario del sistema
- **Precondiciones**: 
  - Los libros referenciados deben existir en el sistema
- **Flujo Principal**:
  1. Usuario intenta crear un artículo con referencias a libros
  2. Sistema valida que todos los IDs de libros existan
  3. Sistema crea el artículo con las referencias válidas
- **Flujos Alternativos**:
  - Si algún libro no existe, se lanza `InvalidBookReferenceError`

### 2. Actualización de Referencias de Libros en Artículo
- **Descripción**: Al actualizar las referencias de libros en un artículo, se valida la existencia de los nuevos libros
- **Actor Principal**: Usuario del sistema
- **Precondiciones**: 
  - El artículo debe existir
  - Los nuevos libros referenciados deben existir
- **Flujo Principal**:
  1. Usuario intenta actualizar referencias de libros en artículo
  2. Sistema valida que los nuevos IDs de libros existan
  3. Sistema actualiza las referencias del artículo
- **Flujos Alternativos**:
  - Si algún nuevo libro no existe, se lanza `InvalidBookReferenceError`

### 3. Eliminación de Libro
- **Descripción**: Al eliminar un libro, se actualizan todos los artículos que lo referencian
- **Actor Principal**: Usuario del sistema
- **Precondiciones**: 
  - El libro debe existir
- **Flujo Principal**:
  1. Usuario solicita eliminar un libro
  2. Sistema busca artículos que referencian el libro
  3. Sistema elimina las referencias al libro en los artículos encontrados
  4. Sistema elimina el libro
  5. Sistema emite evento `BookDeletedDomainEvent`
- **Flujos Alternativos**:
  - Si el libro no existe, se lanza `BookNotFoundError`

## Reglas de Negocio

### RN1: Validación de Referencias
- Los artículos solo pueden referenciar libros que existan en el sistema
- Se debe mantener la limitación de máximo 10 libros por artículo
- Las referencias duplicadas a un mismo libro serán ignoradas

### RN2: Manejo de Eliminación
- La eliminación de un libro debe ser atómica: o se completa todo el proceso o no se realiza ningún cambio
- Los artículos que pierden referencias a libros eliminados deben mantener el resto de sus datos intactos
- Se debe notificar del cambio mediante eventos de dominio

### RN3: Consistencia de Datos
- No pueden existir referencias a libros que no existen en el sistema
- La eliminación de referencias debe mantener el orden del array de IDs en los artículos
- Las actualizaciones deben mantener la inmutabilidad de los value objects

## Escenarios de Prueba

### 1. Tests Unitarios

#### 1.1 ArticleBookIds
```typescript
describe('ArticleBookIds', () => {
  it('should validate book existence when creating')
  it('should prevent duplicate book references')
  it('should maintain max limit of 10 books')
  it('should handle empty book references')
  it('should remove book reference correctly')
})
```

#### 1.2 DeleteBook Use Case
```typescript
describe('DeleteBook', () => {
  it('should delete book and update article references')
  it('should handle book not found')
  it('should emit BookDeletedDomainEvent')
  it('should maintain transaction atomicity')
})
```

### 2. Tests de Integración

```typescript
describe('Book-Article Integration', () => {
  it('should update all article references when deleting book')
  it('should validate book existence when creating article')
  it('should validate book existence when updating article')
  it('should handle concurrent book deletions')
})
```

### 3. Tests E2E

```typescript
describe('Book-Article E2E', () => {
  it('should create article with valid book references')
  it('should reject article creation with invalid book references')
  it('should update article with valid book references')
  it('should remove book and update articles through API')
})
```

## Métricas de Éxito

1. No existen referencias a libros eliminados en ningún artículo
2. Todas las validaciones de referencias funcionan correctamente
3. Los eventos de dominio se emiten y procesan correctamente
4. Las transacciones mantienen la consistencia de los datos
5. Los tests cubren todos los casos de uso y reglas de negocio
