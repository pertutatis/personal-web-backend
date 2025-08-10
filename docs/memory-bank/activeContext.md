# Active Context

## Current Focus

- Implementación de Series de Artículos como dominio independiente
- Integración con dominio de Articles existente
- Desarrollo siguiendo TDD

## Pasos de Desarrollo

### 1. Preparación del Dominio Series

1. Crear estructura de directorios:

   ```
   src/contexts/blog/series/
   ├── domain/
   │   ├── SeriesId.ts
   │   ├── SeriesTitle.ts
   │   ├── SeriesDescription.ts
   │   ├── ArticleSeries.ts
   │   └── SeriesRepository.ts
   ├── application/
   │   ├── CreateSeries.ts
   │   ├── UpdateSeries.ts
   │   └── DeleteSeries.ts
   └── infrastructure/
       ├── persistence/
       │   └── SeriesRepository.ts
       └── http/
           └── SeriesController.ts
   ```

2. Implementar Value Objects (TDD):

   - SeriesId: Tests + Implementación
   - SeriesTitle: Tests + Implementación
   - SeriesDescription: Tests + Implementación

3. Implementar Agregado Series (TDD):
   - ArticleSeries: Tests + Implementación
   - SeriesRepository interface
   - Eventos de dominio

### 2. Actualización del Dominio Articles

1. Añadir SeriesId a Article:

   - Modificar Article entity
   - Actualizar tests existentes
   - Añadir nuevos tests para funcionalidad de series

2. Implementar eventos de dominio:
   - ArticleAssignedToSeriesDomainEvent
   - ArticleRemovedFromSeriesDomainEvent

### 3. Infraestructura

1. Base de datos:

   - Crear migración para tabla article_series
   - Añadir campo series_id a articles
   - Crear índices necesarios

2. Implementar SeriesRepository:
   - Tests de integración
   - Implementación PostgreSQL

### 4. Casos de Uso (TDD)

1. Dominio Series:

   - CreateSeries
   - UpdateSeries
   - DeleteSeries
   - GetSeriesById
   - ListSeries

2. Dominio Articles:
   - AssignArticleToSeries
   - RemoveArticleFromSeries
   - ListArticlesBySeries

### 5. API Endpoints

1. Backoffice:

   - POST /api/backoffice/series
   - PUT /api/backoffice/series/{id}
   - DELETE /api/backoffice/series/{id}
   - GET /api/backoffice/series
   - PATCH /api/backoffice/articles/{id}/series

2. Blog:
   - GET /api/blog/series
   - GET /api/blog/series/{id}/articles

### 6. Testing E2E

1. Series Management:

   - Crear serie
   - Actualizar serie
   - Eliminar serie
   - Validar restricciones

2. Article Integration:
   - Asignar artículo a serie
   - Listar artículos de serie
   - Paginación
   - Ordenación

### 7. Documentación

1. Actualizar Swagger/OpenAPI
2. Actualizar README
3. Documentar endpoints y ejemplos

## Estado Actual

- Diseño completado
- Documentación inicial creada
- Pendiente aprobación para inicio de implementación

## Consideraciones Técnicas

- Usar TDD en cada paso
- Mantener separación clara entre dominios
- Validar eventos de dominio
- Asegurar consistencia en base de datos
