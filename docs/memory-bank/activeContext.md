# Active Context

## Current Focus
Migración a Supabase como base de datos de producción, manteniendo bases de datos separadas para desarrollo y testing.

## Recent Changes
1. Creado ADR-016: Estrategia de migración a Supabase
2. Creado OBR-003: Reglas de negocio para migración de base de datos
3. Definida estrategia de gestión de múltiples entornos
4. Planificada la actualización de repositorios y controllers

## Active Development
### Migración a Supabase
- Documentación inicial completada (ADR y OBR)
- Pendiente implementación de cambios en infraestructura
- Planificada actualización de controllers
- Tests por adaptar al nuevo entorno

### Architectural Decisions
- ADR-016: Define la estrategia de migración a Supabase
- OBR-003: Establece reglas y casos de uso para la migración
- Mantenimiento de la arquitectura hexagonal
- Separación clara entre entornos (prod/dev/test)

## Next Steps
1. Configurar entornos de base de datos según documentación
2. Implementar adaptadores Supabase
3. Actualizar repositorios existentes
4. Revisar y actualizar controllers
5. Adaptar suite de tests

## Technical Considerations
- Mantener la misma estructura de tablas en todos los entornos
- Implementar factory pattern para selección de repositorio
- Asegurar tiempos de respuesta consistentes
- Mantener integridad referencial en todos los entornos

## Current Challenges
1. Gestión de múltiples implementaciones de repositorio
2. Mantener consistencia entre entornos
3. Asegurar rendimiento similar en todos los entornos
4. Migración sin interrumpir el servicio

## Documentation Status
- ADR-016 completado y revisado
- OBR-003 completado y revisado
- Pendiente actualizar documentación técnica
- Pendiente actualizar documentación de API
