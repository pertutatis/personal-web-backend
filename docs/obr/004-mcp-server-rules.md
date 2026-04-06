# OBR-004: Reglas de Negocio para Integración MCP

## Casos de Uso Estándar

1. **Publicar artículo**

   - El agente IA puede crear y publicar artículos en el blog.
   - Validación de contenido, título y relaciones con libros.

2. **Editar artículo**

   - Modificación de artículos existentes por el agente IA.
   - Control de versiones y registro de cambios.

3. **Eliminar artículo**

   - Borrado seguro, con registro de auditoría.

4. **Consultar artículos**
   - Listado y búsqueda de artículos publicados y en borrador.

## Casos de Uso Específicos

1. **Moderación automática**

   - El agente IA analiza el contenido antes de publicar.
   - Detecta lenguaje ofensivo, spam o contenido no permitido.
   - Puede rechazar o marcar artículos para revisión manual.

2. **Control de versiones**
   - Cada edición genera una nueva versión.
   - Permite revertir cambios y consultar historial.

## Edge-cases

- Fallos de conexión MCP.
- Autenticación fallida del agente.
- Concurrencia en edición de artículos.
- Rollback ante errores de validación o moderación.
- Conflictos de versiones.

## Escenarios de Test

- Mock de agente IA para pruebas de integración.
- Validación de reglas de negocio en operaciones MCP.
- Pruebas de moderación automática (detección de contenido prohibido).
- Pruebas de control de versiones (revertir, comparar).
- Pruebas de seguridad y control de acceso.
