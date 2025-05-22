# Active Context

## Current Focus
Implementación del read model para el blog público, separando la gestión (backoffice) de la visualización (blog).

## Recent Changes
1. Completada la integridad referencial entre libros y artículos
2. Implementado sistema de eventos para mantener consistencia
3. Mejorada la documentación API y guías de integración

## Active Development
### Blog Read Model
- Contexto blog implementado con:
  * Modelos de dominio específicos (BlogArticle, BlogBook)
  * Casos de uso implementados (GetArticleBySlug, ListArticles)
  * Repositorios y tests implementados
- Tests unitarios y de integración completos
- Repositorio PostgreSQL implementado y testeado

### Architectural Decisions
- ADR-015: Implementada la arquitectura del contexto blog
- OBR-002: Implementados casos de uso según especificaciones
- Modelos read-only optimizados para consultas
- Separación clara del contexto backoffice

## Next Steps
1. Configurar middleware CORS
2. Implementar rate limiting
3. Optimizar queries N+1
4. Añadir caché para mejorar rendimiento

## Technical Considerations
- No duplicar datos, usar read models optimizados
- Mantener consistencia con el backoffice
- Considerar futuras optimizaciones (caché, rate limiting)
- Asegurar seguridad mediante CORS

## Current Challenges
1. Balance entre compartir base de datos y mantener contextos separados
2. Optimizar queries para incluir información de libros
3. Asegurar rendimiento sin paginación inicial

## Documentation Status
- ADRs actualizados con nuevo contexto
- OBRs definen comportamiento esperado
- Swagger pendiente de actualizar con nuevos endpoints
