# API Documentation

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Blog API

### GET /api/blog/articles
List all blog articles with their related books
- Protected: No
- CORS: Restricted to allowed origins
- Response:
```json
[
  {
    "id": "string",
    "title": "string",
    "excerpt": "string",
    "content": "string",
    "books": [
      {
        "id": "string",
        "title": "string",
        "author": "string",
        "isbn": "string",
        "description": "string",
        "purchaseLink": "string | null",
        "createdAt": "date",
        "updatedAt": "date"
      }
    ],
    "relatedLinks": [
      {
        "text": "string",
        "url": "string"
      }
    ],
    "slug": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

### GET /api/blog/articles/by-slug/{slug}
Get single article by slug with its related books
- URL params: `slug`
- Protected: No
- CORS: Restricted to allowed origins
- Response: Same as single article from list endpoint
- Error: 404 if article not found

## Backoffice API

### Articles API

#### GET /api/backoffice/articles
List articles with pagination
- Query params: `page`, `limit`
- Protected: Yes
- Example: `GET /api/backoffice/articles?page=1&limit=10`

#### GET /api/backoffice/articles/{id}
Get single article by ID
- URL params: `id` (UUID v4)
- Protected: Yes
- Example: `GET /api/backoffice/articles/550e8400-e29b-41d4-a716-446655440000`

#### POST /api/backoffice/articles
Create new article
- Protected: Yes
- Body: 
```json
{
  "title": "string",
  "excerpt": "string",
  "content": "string",
  "bookIds": "string[]", // UUID v4 array
  "relatedLinks": [
    {
      "text": "string",
      "url": "string"
    }
  ],
  "slug": "string"
}
```

#### PUT /api/backoffice/articles/{id}
Update article
- URL params: `id` (UUID v4)
- Protected: Yes
- Body: Same as POST

#### DELETE /api/backoffice/articles/{id}
Delete article
- URL params: `id` (UUID v4)
- Protected: Yes

### Books API

#### GET /api/backoffice/books
List books with pagination
- Query params: `page`, `limit`
- Protected: Yes
- Example: `GET /api/backoffice/books?page=1&limit=10`

#### GET /api/backoffice/books/{id}
Get single book by ID
- URL params: `id` (UUID v4)
- Protected: Yes
- Example: `GET /api/backoffice/books/550e8400-e29b-41d4-a716-446655440000`

#### POST /api/backoffice/books
Create new book
- Protected: Yes
- Body:
```json
{
  "title": "string",
  "author": "string",
  "isbn": "string",
  "description": "string",
  "purchaseLink": "string"
}
```

#### PUT /api/backoffice/books/{id}
Update book
- URL params: `id` (UUID v4)
- Protected: Yes
- Body: Same as POST

#### DELETE /api/backoffice/books/{id}
Delete book
- URL params: `id` (UUID v4)
- Protected: Yes
- Note: Will remove references from articles

## CORS Policy

### Blog API
- Allowed Origins:
  * http://localhost:3000
  * http://localhost:5173
  * https://diegopertusa.netlify.app
  * https://diegopertusa.com
- Allowed Methods: GET, OPTIONS
- Max Age: 3600 (1 hour)

### Backoffice API
- No CORS restrictions (protected by authentication)

## Important Notes

### UUID Validation
- All IDs must be valid UUID v4 format
- Invalid UUIDs will return 400 Bad Request

### Book References
- Articles can reference 0-10 books
- Book IDs must exist in the database
- When a book is deleted, its references are removed from articles

### Error Responses
All errors follow this format:
```json
{
  "error": "string",
  "message": "string"
}
```

Common status codes:
- 400: Invalid input/validation error
- 401: Authentication required
- 403: Insufficient permissions / CORS violation
- 404: Resource not found
- 500: Server error

## Testing

### Postman Collection
A Postman collection is included at `./postman/personal-web-backend.postman_collection.json` with:
- Pre-configured environments (dev, test)
- Authentication setup
- Example requests for all endpoints
- Response validation tests

### Environment Variables
```
BASE_URL=http://localhost:3000
JWT_TOKEN=<your-jwt-token>
```

## Development Guidelines

### UUID Generation
- UUIDs should be generated on the client side
- Must be version 4 (random)
- Validated on both client and server

### Book Reference Integrity
- Validate book existence before creation/update
- Handle book deletion gracefully
- Monitor orphaned references
