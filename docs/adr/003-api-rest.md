# ADR 003: Diseño de API REST

## Estado
Aceptado

## Contexto
Necesitamos definir los endpoints de la API REST para el sistema de blog, asegurando que sigan las mejores prácticas RESTful y proporcionen una interfaz clara y consistente.

## Decisión
Implementaremos los siguientes endpoints utilizando Next.js API routes:

1. Artículos:
   ```
   GET /api/blog/articles
   - Listar todos los artículos
   - Query params: 
     - page (número de página)
     - limit (artículos por página)
     - category (filtrar por categoría)
   - Response: 200 OK
     {
       data: Article[],
       meta: {
         total: number,
         page: number,
         limit: number
       }
     }

   GET /api/blog/articles/{id}
   - Obtener un artículo por ID
   - Response: 200 OK (Article) | 404 Not Found

   POST /api/blog/articles
   - Crear un nuevo artículo
   - Body: ArticleCreateDTO
   - Response: 201 Created (Article) | 400 Bad Request

   PUT /api/blog/articles/{id}
   - Actualizar un artículo existente
   - Body: ArticleUpdateDTO
   - Response: 200 OK (Article) | 404 Not Found | 400 Bad Request
   ```

2. Libros:
   ```
   GET /api/blog/books
   - Listar todos los libros
   - Query params:
     - page (número de página)
     - limit (libros por página)
   - Response: 200 OK
     {
       data: Book[],
       meta: {
         total: number,
         page: number,
         limit: number
       }
     }

   POST /api/blog/books
   - Crear un nuevo libro
   - Body: BookCreateDTO
   - Response: 201 Created (Book) | 400 Bad Request

   PUT /api/blog/books/{id}
   - Actualizar un libro existente
   - Body: BookUpdateDTO
   - Response: 200 OK (Book) | 404 Not Found | 400 Bad Request
   ```

3. Manejo de Errores:
   ```
   {
     "error": {
       "code": string,
       "message": string,
       "details?: object
     }
   }
   ```

## Consecuencias
### Positivas
- API RESTful consistente y predecible
- Paginación estandarizada
- Manejo de errores uniforme
- Endpoints intuitivos y bien organizados
- Fácil versionado futuro (/api/v1/...)

### Negativas
- Necesidad de mantener compatibilidad hacia atrás
- Potencial overhead en serialización/deserialización
- Posible necesidad de documentación adicional para casos complejos
