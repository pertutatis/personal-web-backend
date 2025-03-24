# ADR 007: Agregar campo excerpt a Artículos

## Estado
Propuesto

## Contexto
Los artículos necesitan mostrar un resumen o extracto (excerpt) que permita a los lectores tener una vista previa del contenido sin necesidad de abrir el artículo completo. Este excerpt será utilizado en listados y vistas previas.

## Decisión
Agregaremos un nuevo campo `excerpt` a la entidad Article con las siguientes características:

1. Será un Value Object llamado `ArticleExcerpt`
2. Tendrá validaciones de:
   - No puede estar vacío
   - Longitud máxima de 300 caracteres
   - Debe ser texto plano (sin HTML)
3. Será requerido al crear un artículo
4. Podrá ser actualizado junto con otros campos del artículo

## Consecuencias

### Positivas
- Mejora la experiencia de usuario al mostrar previews de artículos
- Permite optimizar el rendimiento al no tener que cargar el contenido completo en listados
- Facilita la compartición en redes sociales y SEO

### Negativas
- Requiere migración de datos para artículos existentes
- Aumenta la complejidad del dominio con un nuevo Value Object
- Los autores deberán escribir un excerpt adicional al contenido

## Implementación Técnica

1. Crear nuevo Value Object `ArticleExcerpt`
2. Modificar la entidad `Article` para incluir el nuevo campo
3. Actualizar eventos de dominio para incluir el excerpt
4. Modificar el repositorio y su implementación
5. Actualizar casos de uso afectados
6. Crear tests para todas las nuevas funcionalidades
7. Actualizar documentación de API

## Alternativas Consideradas

1. **Generar excerpt automáticamente del contenido**
   - Pros: No requiere entrada adicional del usuario
   - Contras: Menor control sobre el resultado, posible pérdida de contexto

2. **Hacer el excerpt opcional**
   - Pros: Más flexible para el usuario
   - Contras: Inconsistencia en la experiencia de usuario

## Compliance
- El excerpt debe cumplir con las mismas políticas de contenido que el artículo principal
- Se debe validar que no contenga información sensible o inapropiada

## Referencias
- [Issue #XX] Agregar campo excerpt a artículos
- Domain Driven Design patterns
- SEO best practices for article excerpts
