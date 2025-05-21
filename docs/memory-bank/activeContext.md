# Active Context

## Current Focus
Implementación del read model para el blog público, separando la gestión (backoffice) de la visualización (blog).

## Recent Changes
1. Completada la integridad referencial entre libros y artículos
2. Implementado sistema de eventos para mantener consistencia
3. Mejorada la documentación API y guías de integración

## Active Development
### Blog Read Model
- Nuevo contexto separado del backoffice
- Dos casos de uso principales:
  * Listar todos los artículos (sin paginación)
  * Obtener artículo por slug
- Exposición conjunta de artículos y libros relacionados
- Restricción de acceso mediante CORS a dominios específicos

### Architectural Decisions
- ADR-015: Define la arquitectura del contexto blog
- OBR-002: Define casos de uso y reglas de negocio
- Uso de la misma base de datos sin duplicación
- Modelos de dominio específicos para el blog

## Next Steps
1. Implementar estructura base del contexto blog
2. Desarrollar casos de uso siguiendo TDD
3. Configurar middleware CORS
4. Añadir tests e2e

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
