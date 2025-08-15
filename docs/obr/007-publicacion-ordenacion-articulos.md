# OBR: Publicación y ordenación de artículos en el blog

**Status:** Defined  
**Date:** 2025-08-15
**Context:** Task 16 - published date

## Reglas de Negocio

- Un artículo solo se considera publicado si tiene el campo `publishedAt` definido.
- Al publicar un artículo, se asigna la fecha y hora actual a `publishedAt`.
- Los artículos sin `publishedAt` no aparecen en el listado público del blog.
- El listado público de artículos se ordena por `publishedAt` descendente.
- No se puede modificar la fecha de publicación una vez asignada (solo mediante proceso de publicación).

## Casos de Uso

1. **Publicar artículo**

   - Input: ID de artículo existente en estado borrador.
   - Output: Artículo con `publishedAt` asignado.
   - Validaciones: Solo artículos no publicados pueden ser publicados.

2. **Listar artículos publicados**
   - Input: Ninguno (o parámetros de paginación).
   - Output: Lista de artículos ordenados por `publishedAt` descendente.
   - Validaciones: Solo artículos con `publishedAt` definido.

## Escenarios de Test

- Publicar artículo asigna correctamente la fecha/hora.
- Listar artículos muestra solo los publicados y en orden correcto.
- Intentar publicar un artículo ya publicado retorna error.
- Artículos sin `publishedAt` no aparecen en el listado público.
- La fecha de publicación no se puede modificar manualmente.

## Edge Cases

- Artículo creado pero nunca publicado: no aparece en el blog.
- Artículo publicado y luego editado: `publishedAt` permanece igual.
- Artículo eliminado: no aparece en el listado.
