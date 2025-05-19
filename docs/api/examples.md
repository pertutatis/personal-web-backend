# Guía de Uso de la API

Esta guía proporciona ejemplos prácticos de cómo usar la API RESTful del blog personal.

## Autenticación (Próximamente)

La API implementará autenticación JWT con los siguientes endpoints:

```bash
# Login
POST /api/backoffice/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

# Register
POST /api/backoffice/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePassword123!"
}

# Refresh Token
POST /api/backoffice/auth/refresh-token
Authorization: Bearer <refresh_token>
```

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
      "excerpt": "Un breve resumen del artículo",
      "slug": "mi-primer-articulo",
      "bookIds": ["123e4567-e89b-12d3-a456-426614174001"],
      "relatedLinks": [
        {
          "text": "Artículo relacionado",
          "url": "https://example.com/related"
        }
      ],
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
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Mi Primer Artículo",
    "content": "Este es el contenido del artículo...",
    "excerpt": "Un breve resumen del artículo",
    "bookIds": ["123e4567-e89b-12d3-a456-426614174001"],
    "relatedLinks": [
      {
        "text": "Artículo relacionado",
        "url": "https://example.com/related"
      }
    ]
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
    "content": "Contenido actualizado...",
    "excerpt": "Resumen actualizado",
    "relatedLinks": [
      {
        "text": "Nuevo enlace relacionado",
        "url": "https://example.com/new"
      }
    ]
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
      "description": "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees...",
      "purchaseLink": "https://example.com/buy/clean-code",
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
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "description": "Even bad code can function. But if code isn't clean...",
    "purchaseLink": "https://example.com/buy/clean-code"
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
    "isbn": "9780132350884",
    "description": "Descripción actualizada...",
    "purchaseLink": "https://example.com/buy/clean-code-updated"
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
  "type": "ValidationError",
  "message": "title cannot be empty"
}
```

### Recurso No Encontrado (404)
```json
{
  "type": "NotFoundError",
  "message": "Article not found"
}
```

### ID Duplicado (409)
```json
{
  "type": "DuplicateError",
  "message": "Article ID already exists"
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
- `id`: UUID v4 válido
- `title`: Requerido, máximo 100 caracteres
- `content`: Requerido, máximo 10000 caracteres
- `excerpt`: Requerido, máximo 160 caracteres, sin HTML
- `bookIds`: Array de UUIDs (opcional)
- `relatedLinks`: Array de objetos (máximo 10)
  - `text`: Requerido, máximo 100 caracteres
  - `url`: URL válida, máximo 2000 caracteres

### Libros
- `id`: UUID v4 válido
- `title`: Requerido, máximo 100 caracteres
- `author`: Requerido, máximo 100 caracteres
- `isbn`: Requerido, formato ISBN válido
- `description`: Requerido, máximo 1000 caracteres
- `purchaseLink`: URL válida, máximo 2000 caracteres (opcional)
