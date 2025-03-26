# ADR 010: Añadir Enlaces Relacionados y Slug a los Artículos

## Contexto
Los artículos necesitan poder referenciar contenido externo relacionado y tener una URL amigable para SEO. Esto requiere añadir enlaces relacionados opcionales y un slug derivado del título.

## Decisión
Añadiremos dos nuevos campos a la entidad Article:
1. `relatedLinks`: Una colección opcional de enlaces relacionados
2. `slug`: Un identificador URL-friendly generado a partir del título

### Value Objects
- `ArticleRelatedLink`: Value Object para enlaces relacionados
  - Contiene `text` (texto descriptivo) y `url` (enlace)
  - La URL debe ser válida
  - El texto no puede estar vacío
  - Longitud máxima texto: 100 caracteres
  - Longitud máxima URL: 2000 caracteres (estándar para URLs)

- `ArticleRelatedLinks`: Value Object Collection para la lista de enlaces
  - Puede estar vacío (campo opcional)
  - Máximo 10 enlaces relacionados
  - No permite enlaces duplicados (misma URL)

- `ArticleSlug`: Value Object para el slug
  - Generado automáticamente del título
  - Solo letras minúsculas, números y guiones
  - Sin caracteres especiales ni acentos
  - Longitud máxima: 100 caracteres
  - No puede estar vacío

### Validaciones
1. `ArticleRelatedLink`:
   - Se validará que la URL sea válida
   - Se validará que el texto no esté vacío
   - Se validarán las longitudes máximas

2. `ArticleRelatedLinks`:
   - Se validará el número máximo de enlaces
   - Se validará que no haya URLs duplicadas

3. `ArticleSlug`:
   - Se validará el formato (solo caracteres permitidos)
   - Se validará la longitud máxima
   - Se validará que no esté vacío

### Transformación del Título a Slug
1. Convertir a minúsculas
2. Reemplazar espacios por guiones
3. Eliminar acentos y caracteres especiales
4. Eliminar caracteres no alfanuméricos excepto guiones
5. Eliminar guiones consecutivos
6. Eliminar guiones al inicio y final

Ejemplos:
- "Mi Título" → "mi-titulo"
- "¿Qué es SOLID?" → "que-es-solid"
- "Node.js & TypeScript" → "nodejs-typescript"

## Consecuencias
1. Positivas:
   - Mejor SEO con URLs amigables
   - Mayor interconexión con contenido externo
   - Mejor experiencia de usuario al proporcionar recursos adicionales
   - Slugs consistentes y automáticos

2. Negativas:
   - Mayor complejidad en la entidad Article
   - Necesidad de migración de datos para generar slugs
   - Mayor superficie de validación
   - Necesidad de manejar colisiones de slugs

## Estado
Propuesto
