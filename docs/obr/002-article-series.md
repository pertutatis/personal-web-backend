# OBR: Series de Artículos

## Casos de Uso

### 1. Crear Serie

- **Actor**: Administrador
- **Precondiciones**: Usuario autenticado con permisos
- **Flujo Principal**:
  1. Admin proporciona título y descripción
  2. Sistema valida datos
  3. Sistema crea nueva serie
  4. Sistema devuelve serie creada
- **Excepciones**:
  - Título duplicado
  - Datos inválidos

### 2. Asignar Artículo a Serie

- **Actor**: Administrador
- **Precondiciones**:
  - Serie existe
  - Artículo existe
  - Artículo no pertenece a otra serie
- **Flujo Principal**:
  1. Admin selecciona artículo y serie
  2. Sistema verifica restricciones
  3. Sistema actualiza artículo
- **Excepciones**:
  - Artículo ya en otra serie
  - Serie no existe
  - Artículo no existe

### 3. Eliminar Serie

- **Actor**: Administrador
- **Precondiciones**:
  - Serie existe
  - Serie no tiene artículos publicados
- **Flujo Principal**:
  1. Admin solicita eliminar serie
  2. Sistema verifica que no haya artículos publicados
  3. Sistema elimina serie
  4. Sistema desvincula artículos no publicados
- **Excepciones**:
  - Serie no existe
  - Serie tiene artículos publicados

### 4. Listar Artículos de Serie

- **Actor**: Usuario
- **Precondiciones**: Serie existe
- **Flujo Principal**:
  1. Usuario solicita artículos de serie con parámetros de paginación
  2. Sistema devuelve lista paginada ordenada por fecha de publicación
- **Parámetros de Paginación**:
  - page: número de página (default: 1)
  - limit: artículos por página (default: 10)

## Reglas de Negocio

1. **RN1: Unicidad de Serie**

   - Un artículo solo puede pertenecer a una serie
   - Al asignar a nueva serie, se debe desvincular de la anterior

2. **RN2: Validación de Serie**

   - Título: requerido, máximo 100 caracteres
   - Descripción: requerido, máximo 500 caracteres
   - Debe tener un identificador único

3. **RN3: Gestión de Referencias**

   - No se permite eliminar series con artículos publicados
   - Al eliminar una serie, los artículos no publicados quedan sin serie

4. **RN4: Ordenación y Paginación**
   - Artículos en serie ordenados por fecha de publicación descendente
   - Paginación estándar con parámetros page y limit
   - Límite predeterminado de 10 artículos por página

## Escenarios de Prueba

### Pruebas Unitarias

1. Creación de serie con datos válidos
2. Creación de serie con datos inválidos
3. Asignación de artículo a serie
4. Intento de asignar artículo ya en serie
5. Eliminación de serie sin artículos publicados
6. Intento de eliminar serie con artículos publicados
7. Validación de reglas de negocio

### Pruebas de Integración

1. Flujo completo de creación y asignación
2. Actualización de serie con artículos
3. Eliminación de serie y verificación de artículos
4. Listado paginado de artículos en serie

### Pruebas E2E

1. Creación de serie desde backoffice
2. Asignación de artículos desde backoffice
3. Visualización de series en blog con paginación
4. Navegación entre artículos de serie

## Impacto en el Sistema

### Base de Datos

- Nueva tabla `article_series`
- Nuevo campo `series_id` en `articles`
- Índices para optimizar consultas y paginación

### API

- Nuevos endpoints en blog y backoffice
- Soporte de paginación en endpoints de listado
- Validaciones adicionales en endpoints de eliminación

### UI

- Nuevas vistas en backoffice para gestión
- Componentes de paginación en listados
- Mensajes de error específicos para validaciones de series
