# Active Context

## Current Focus

- Implementación de Series de Artículos
- Mejora de la organización del contenido
- Expansión de funcionalidades del blog

## Recent Changes

- ADR-019: Decisión de implementar series de artículos
- OBR-002: Definición de casos de uso y reglas de negocio para series
- Decisiones sobre gestión de series:
  - No se permite eliminar series con artículos publicados
  - Implementación de paginación estándar
  - Ordenación por fecha de publicación

## Next Steps

1. Diseñar e implementar modelo de dominio para Series
2. Crear nuevos endpoints con soporte de paginación
3. Actualizar estructura de base de datos
4. Desarrollar pruebas unitarias, de integración y e2e

## Active Decisions

- Un artículo solo puede pertenecer a una serie
- Series con artículos publicados no pueden ser eliminadas
- Paginación estándar (10 artículos por página por defecto)
- Ordenación por fecha de publicación dentro de series

## Technical Considerations

- Mantener consistencia en validación de eliminación de series
- Optimizar consultas paginadas de artículos por serie
- Asegurar integridad referencial en base de datos
- Implementar validaciones de unicidad de título de serie
- Gestionar eficientemente la paginación en queries

## Integration Points

- Integración con el módulo existente de artículos
- Actualización de endpoints de blog para incluir información de series
- Nuevos endpoints en backoffice para gestión de series

## Performance Considerations

- Índices optimizados para consultas paginadas
- Caching de resultados de series populares
- Optimización de queries de conteo para paginación
