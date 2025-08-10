# OBR: Series de Artículos

## Dominios

### Dominio de Series

Responsable de:

- Gestión del ciclo de vida de las series
- Validación de reglas específicas de series
- Eventos de dominio relacionados con series

### Dominio de Artículos

Responsable de:

- Mantener referencia a SeriesId
- Validar asignación/desasignación de series
- Emitir eventos de cambios en la relación con series

## Casos de Uso

### 1. Crear Serie (Dominio Series)

- **Actor**: Administrador
- **Precondiciones**: Usuario autenticado con permisos
- **Flujo Principal**:
  1. Admin proporciona título y descripción
  2. Sistema valida datos
  3. Sistema crea nueva serie
  4. Sistema emite evento SeriesCreatedDomainEvent
- **Excepciones**:
  - Título duplicado
  - Datos inválidos

### 2. Asignar Artículo a Serie (Coordinación entre Dominios)

- **Actor**: Administrador
- **Precondiciones**:
  - Serie existe (Dominio Series)
  - Artículo existe (Dominio Artículos)
  - Artículo no pertenece a otra serie
- **Flujo Principal**:
  1. Admin selecciona artículo y serie
  2. Sistema verifica existencia de serie (Dominio Series)
  3. Sistema verifica artículo (Dominio Artículos)
  4. Sistema actualiza artículo
  5. Sistema emite ArticleAssignedToSeriesDomainEvent
- **Excepciones**:
  - Artículo ya en otra serie
  - Serie no existe
  - Artículo no existe

### 3. Eliminar Serie (Dominio Series)

- **Actor**: Administrador
- **Precondiciones**:
  - Serie existe
  - Serie no tiene artículos publicados
- **Flujo Principal**:
  1. Admin solicita eliminar serie
  2. Sistema verifica que no haya artículos publicados
  3. Sistema elimina serie
  4. Sistema emite SeriesDeletedDomainEvent
  5. Dominio de Artículos reacciona y desvincula artículos
- **Excepciones**:
  - Serie no existe
  - Serie tiene artículos publicados

### 4. Listar Artículos de Serie (Coordinación entre Dominios)

- **Actor**: Usuario
- **Precondiciones**: Serie existe
- **Flujo Principal**:
  1. Usuario solicita artículos de serie con parámetros de paginación
  2. Sistema obtiene serie (Dominio Series)
  3. Sistema obtiene artículos asociados (Dominio Artículos)
  4. Sistema devuelve lista paginada ordenada por fecha de publicación
- **Parámetros de Paginación**:
  - page: número de página (default: 1)
  - limit: artículos por página (default: 10)

## Reglas de Negocio

1. **RN1: Unicidad de Serie (Dominio Series)**

   - Título de serie debe ser único
   - Una serie debe tener un identificador único

2. **RN2: Validación de Serie (Dominio Series)**

   - Título: requerido, máximo 100 caracteres
   - Descripción: requerido, máximo 500 caracteres

3. **RN3: Relación Artículo-Serie (Dominio Artículos)**

   - Un artículo solo puede pertenecer a una serie
   - Al asignar a nueva serie, se debe desvincular de la anterior
   - La referencia a serie es opcional

4. **RN4: Gestión de Referencias (Coordinación)**

   - No se permite eliminar series con artículos publicados
   - Al eliminar una serie, los artículos no publicados quedan sin serie
   - La eliminación debe mantener consistencia entre dominios

5. **RN5: Ordenación y Paginación (Dominio Series)**
   - Artículos en serie ordenados por fecha de publicación descendente
   - Paginación estándar con parámetros page y limit
   - Límite predeterminado de 10 artículos por página

## Eventos de Dominio

### Dominio Series

- SeriesCreatedDomainEvent
- SeriesUpdatedDomainEvent
- SeriesDeletedDomainEvent

### Dominio Artículos

- ArticleAssignedToSeriesDomainEvent
- ArticleRemovedFromSeriesDomainEvent

## Pruebas

### Pruebas Unitarias

1. **Dominio Series**

   - Creación de serie con datos válidos
   - Creación de serie con datos inválidos
   - Validación de unicidad de título
   - Eliminación de serie sin artículos

2. **Dominio Artículos**
   - Asignación de artículo a serie
   - Desvinculación de serie
   - Validación de restricciones de serie

### Pruebas de Integración

1. **Coordinación entre Dominios**
   - Flujo completo de creación y asignación
   - Eliminación de serie y actualización de artículos
   - Listado paginado de artículos en serie

### Pruebas E2E

1. Gestión completa de series desde backoffice
2. Visualización de series y navegación en blog
3. Validación de constraints y reglas de negocio

## Impacto en el Sistema

### Base de Datos

```sql
-- Dominio Series
CREATE TABLE article_series (
  id UUID PRIMARY KEY,
  title VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Dominio Artículos (Alteración)
ALTER TABLE articles ADD COLUMN series_id UUID REFERENCES article_series(id);
CREATE INDEX idx_articles_series ON articles(series_id);
```

### API

- Nuevos endpoints en dominios separados
- Coordinación mediante eventos de dominio
- Manejo consistente de errores entre dominios
