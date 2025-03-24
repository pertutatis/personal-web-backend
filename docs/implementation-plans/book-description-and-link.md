# Plan de Implementación: Añadir Descripción y Link de Compra a Books

## 1. Value Objects y Errores

### BookDescription
1. Crear errores:
   ```typescript
   BookDescriptionEmpty
   BookDescriptionLengthExceeded
   ```

2. Crear tests para BookDescription:
   - Validar creación con valor válido
   - Validar error al crear con string vacío
   - Validar error al exceder longitud máxima
   - Validar creación con múltiples líneas

3. Implementar BookDescription value object

### BookPurchaseLink
1. Crear errores:
   ```typescript
   BookPurchaseLinkInvalid
   BookPurchaseLinkLengthExceeded
   ```

2. Crear tests para BookPurchaseLink:
   - Validar creación con URL válida
   - Validar error al crear con URL inválida
   - Validar error al exceder longitud máxima
   - Validar creación con valor null/undefined

3. Implementar BookPurchaseLink value object

## 2. Object Mothers

1. Implementar BookDescriptionMother:
   ```typescript
   create()
   random()
   tooLong()
   empty()
   withMultipleLines()
   ```

2. Implementar BookPurchaseLinkMother:
   ```typescript
   create()
   random()
   tooLong()
   invalid()
   empty()
   ```

## 3. Actualización de la Entidad Book

1. Actualizar tests de Book:
   - Crear con todos los campos incluyendo descripción y link
   - Crear sin link de compra
   - Actualizar descripción
   - Actualizar link
   - Eliminar link (set to null)

2. Actualizar Book entity:
   - Añadir nuevos campos
   - Actualizar constructor y métodos
   - Actualizar event handlers

## 4. Casos de Uso

1. Actualizar CreateBook:
   - Actualizar tests
   - Actualizar command
   - Actualizar handler

2. Actualizar UpdateBook:
   - Actualizar tests
   - Actualizar command
   - Actualizar handler

3. Actualizar GetBook y ListBooks:
   - Actualizar tests para verificar nuevos campos
   - Actualizar response DTOs

## 5. Infraestructura

1. Crear migración SQL:
   ```sql
   ALTER TABLE books
   ADD COLUMN description TEXT NOT NULL DEFAULT '',
   ADD COLUMN purchase_link TEXT;
   ```

2. Actualizar PostgresBookRepository:
   - Actualizar tests
   - Actualizar queries
   - Actualizar mappers

## 6. API

1. Actualizar tests E2E:
   - Crear libro con nuevos campos
   - Actualizar libro modificando nuevos campos
   - Validar respuestas incluyen nuevos campos

2. Actualizar rutas API:
   - Actualizar schemas de request/response
   - Actualizar validaciones
   - Actualizar mappers

## 7. Documentación

1. Actualizar API OpenAPI specs:
   - Añadir nuevos campos a schemas
   - Actualizar ejemplos

2. Actualizar documentación de API

## Secuencia de Implementación (TDD)

1. Crear tests para los nuevos Value Objects
2. Implementar Value Objects y sus errores
3. Crear tests para la entidad Book actualizada
4. Implementar cambios en Book
5. Crear tests para casos de uso actualizados
6. Implementar cambios en casos de uso
7. Crear tests de infraestructura
8. Implementar cambios de infraestructura
9. Crear tests E2E
10. Implementar cambios en API
11. Actualizar documentación

## Consideraciones

- Seguir estrictamente TDD: red -> green -> refactor
- Mantener la cohesión con el código existente
- Asegurar que los tests cubran todos los casos de uso
- Validar que la migración sea segura y no afecte datos existentes
- Documentar cualquier cambio en la API

## Criterios de Aceptación

1. Todos los tests pasan (unit, integration, e2e)
2. Cobertura de tests mantiene o supera el nivel actual
3. La documentación está actualizada y es precisa
4. La migración se ejecuta sin errores
5. La API mantiene compatibilidad hacia atrás
6. Los nuevos campos se validan correctamente
7. La funcionalidad cumple con los requisitos de negocio
