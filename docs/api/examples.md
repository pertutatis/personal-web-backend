# Guía de Uso de la API

Esta guía proporciona ejemplos prácticos de cómo usar la API RESTful del blog personal.

## Autenticación

Actualmente la API no requiere autenticación.

## Artículos

### Listar Artículos

```bash
curl -X GET "http://localhost:3000/api/blog/articles?page=1&limit=10"
```

Ejemplo de respuesta:
```json
{
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Mi Primer Artículo",
      "content": "Este es el contenido del artículo...",
      "bookIds": ["123e4567-e89b-12d3-a456-426614174001"],
      "createdAt": "2025-03-23T15:00:00.000Z",
      "updatedAt": "2025-03-23T15:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1
}
```

### Crear Artículo

```bash
curl -X POST "http://localhost:3000/api/blog/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi Primer Artículo",
    "content": "Este es el contenido del artículo...",
    "bookIds": ["123e4567-e89b-12d3-a456-426614174001"]
  }'
```

### Obtener Artículo

```bash
curl -X GET "http://localhost:3000/api/blog/articles/123e4567-e89b-12d3-a456-426614174000"
```

### Actualizar Artículo

```bash
curl -X PUT "http://localhost:3000/api/blog/articles/123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título Actualizado",
    "content": "Contenido actualizado..."
  }'
```

### Eliminar Artículo

```bash
curl -X DELETE "http://localhost:3000/api/blog/articles/123e4567-e89b-12d3-a456-426614174000"
```

## Libros

### Listar Libros

```bash
curl -X GET "http://localhost:3000/api/blog/books?page=1&limit=10"
```

Ejemplo de respuesta:
```json
{
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "isbn": "9780132350884",
      "createdAt": "2025-03-23T15:00:00.000Z",
      "updatedAt": "2025-03-23T15:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1
}
```

### Crear Libro

```bash
curl -X POST "http://localhost:3000/api/blog/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884"
  }'
```

### Obtener Libro

```bash
curl -X GET "http://localhost:3000/api/blog/books/123e4567-e89b-12d3-a456-426614174001"
```

### Actualizar Libro

```bash
curl -X PUT "http://localhost:3000/api/blog/books/123e4567-e89b-12d3-a456-426614174001" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "isbn": "9780132350884"
  }'
```

### Eliminar Libro

```bash
curl -X DELETE "http://localhost:3000/api/blog/books/123e4567-e89b-12d3-a456-426614174001"
```

## Manejo de Errores

La API utiliza códigos de estado HTTP estándar y devuelve mensajes de error descriptivos:

### Error de Validación (400)
```json
{
  "error": "title cannot be empty"
}
```

### Recurso No Encontrado (404)
```json
{
  "error": "Article not found"
}
```

## Paginación

Todos los endpoints de listado soportan paginación mediante los parámetros `page` y `limit`:

- `page`: Número de página (por defecto: 1)
- `limit`: Elementos por página (por defecto: 10, máximo: 100)

Ejemplo:
```bash
curl -X GET "http://localhost:3000/api/blog/articles?page=2&limit=20"
```

## Validaciones

### Artículos
- `title`: Requerido, máximo 100 caracteres
- `content`: Requerido, máximo 10000 caracteres
- `bookIds`: Array de UUIDs (opcional)

### Libros
- `title`: Requerido, máximo 100 caracteres
- `author`: Requerido, máximo 100 caracteres
- `isbn`: Requerido, formato ISBN válido
