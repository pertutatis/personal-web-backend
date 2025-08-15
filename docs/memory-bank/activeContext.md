# Active Context

## Current Focus

- Implementación de la funcionalidad de publicación y ordenación de artículos en el blog
- Añadir campo `publishedAt` al modelo de artículo
- Modificar el proceso de publicación para asignar fecha/hora
- Actualizar el endpoint GET para ordenar por `publishedAt` descendente
- Documentación y tests siguiendo TDD

## Decisiones recientes

- ADR [`020-publishedat-ordenacion-articulos.md`](docs/adr/020-publishedat-ordenacion-articulos.md): Añadir campo publishedAt y ordenación por fecha de publicación
- OBR [`007-publicacion-ordenacion-articulos.md`](docs/obr/007-publicacion-ordenacion-articulos.md): Reglas de negocio, casos de uso y escenarios de test

## Pasos de Desarrollo

1. Actualizar modelo de artículo y migraciones
2. Modificar proceso de publicación
3. Actualizar lógica de listado y ordenación
4. Escribir tests unitarios y e2e
5. Actualizar documentación Swagger/OpenAPI
