# ADR: Añadir campo publishedAt y ordenación por fecha de publicación en artículos del blog

Fecha: 2025-08-15

## Estado

Aceptado y pendiente de implementación.

## Contexto

Actualmente, los artículos del blog se ordenan por `createdAt`. No existe un campo explícito para la fecha de publicación. El proceso de publicación no registra la fecha/hora en la entidad.

## Decisión

- Se añade el campo `publishedAt` al modelo de artículo.
- Al publicar un artículo, se asigna la fecha y hora actual a `publishedAt`.
- El endpoint GET `/api/blog/articles` ordena los artículos por `publishedAt` descendente (más recientes primero).
- Si un artículo no tiene `publishedAt`, no se muestra en el listado público del blog.

## Consecuencias

- Permite distinguir entre fecha de creación y fecha de publicación.
- Mejora la experiencia del usuario mostrando primero los artículos más recientes.
- Facilita futuras extensiones (programar publicaciones, ocultar borradores, etc).
- Requiere migración en la base de datos y actualización de tests.

## Alternativas consideradas

- Usar `createdAt` como fecha de publicación (descartado por no cubrir casos de borradores y publicaciones programadas).
- Ordenar por otro campo (irrelevante para el caso de uso).
