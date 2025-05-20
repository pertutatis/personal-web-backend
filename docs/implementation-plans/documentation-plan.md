# Plan de Documentación de la API

## 1. Estructura de la Documentación

### 1.1 Archivos a Crear
- `openapi.json`: Especificación OpenAPI/Swagger
- `examples.md`: Guía de uso con ejemplos prácticos

### 1.2 Contenido de OpenAPI

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Personal Web Backend API",
    "description": "API RESTful para la gestión de artículos y libros del blog personal",
    "version": "1.0.0"
  }
}
```

## 2. Endpoints a Documentar

### 2.1 Artículos
- `GET /api/blog/articles`: Listar artículos (paginado)
- `POST /api/blog/articles`: Crear artículo
- `GET /api/blog/articles/{id}`: Obtener artículo
- `PUT /api/blog/articles/{id}`: Actualizar artículo
- `DELETE /api/blog/articles/{id}`: Eliminar artículo

### 2.2 Libros
- `GET /api/blog/books`: Listar libros (paginado)
- `POST /api/blog/books`: Crear libro
- `GET /api/blog/books/{id}`: Obtener libro
- `PUT /api/blog/books/{id}`: Actualizar libro
- `DELETE /api/blog/books/{id}`: Eliminar libro

## 3. Esquemas de Datos

### 3.1 Article
```json
{
  "id": "string (UUID)",
  "title": "string (max 100 chars)",
  "content": "string (max 10000 chars)",
  "bookIds": "string[] (UUID array)",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

### 3.2 Book
```json
{
  "id": "string (UUID)",
  "title": "string (max 100 chars)",
  "author": "string (max 100 chars)",
  "isbn": "string (ISBN format)",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

## 4. Códigos de Respuesta

- 200 OK: Operación exitosa
- 201 Created: Recurso creado exitosamente
- 400 Bad Request: Error de validación
- 404 Not Found: Recurso no encontrado
- 500 Internal Server Error: Error del servidor

## 5. Ejemplos de Uso

### 5.1 Crear un Artículo
```json
// Request
POST /api/blog/articles
Content-Type: application/json

{
  "title": "Mi Primer Artículo",
  "content": "Contenido del artículo...",
  "bookIds": ["uuid-1", "uuid-2"]
}

// Response
201 Created
{
  "id": "uuid",
  "title": "Mi Primer Artículo",
  "content": "Contenido del artículo...",
  "bookIds": ["uuid-1", "uuid-2"],
  "createdAt": "2025-03-23T15:12:58.000Z",
  "updatedAt": "2025-03-23T15:12:58.000Z"
}
```

### 5.2 Crear un Libro
```json
// Request
POST /api/blog/books
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884"
}

// Response
201 Created
{
  "id": "uuid",
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "createdAt": "2025-03-23T15:12:58.000Z",
  "updatedAt": "2025-03-23T15:12:58.000Z"
}
```

## 6. Siguientes Pasos

1. Implementar documentación OpenAPI en formato JSON
2. Crear guía de ejemplos detallada
3. Integrar Swagger UI para visualización interactiva
4. Configurar scripts para validación de documentación
5. Actualizar README con enlace a la documentación
