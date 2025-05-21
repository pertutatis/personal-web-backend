# API Integration Guide

## Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 13+
- JWT authentication token

### Environment Setup
1. Configure your environment:
```bash
BASE_URL=http://localhost:3000
JWT_TOKEN=<your-jwt-token>
```

2. Set request headers:
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

## Best Practices

### UUID Management
1. Generate UUIDs client-side using UUID v4
2. Validate format before sending
3. Handle validation errors (400 responses)

### Book References
1. Verify book exists before referencing
2. Keep references under limit (max 10)
3. Handle book deletion gracefully:
   - Listen for deletions
   - Update UI accordingly
   - Remove references from articles

### Error Handling
1. Implement proper error boundaries
2. Handle common status codes:
   ```typescript
   switch (response.status) {
     case 400: // Validation error
     case 401: // Auth required
     case 403: // Forbidden
     case 404: // Not found
     case 500: // Server error
   }
   ```

## Integration Examples

### Creating an Article with Book References
```typescript
// 1. Generate UUID
const articleId = uuid.v4();

// 2. Validate book references
const bookIds = ['uuid1', 'uuid2']; // Max 10
const validBookIds = await validateBooks(bookIds);

// 3. Create article
const article = {
  id: articleId,
  title: 'My Article',
  excerpt: 'Short description',
  content: 'Full content',
  bookIds: validBookIds,
  relatedLinks: []
};

// 4. Send request
const response = await fetch('/articles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(article)
});
```

### Handling Book Deletions
```typescript
// 1. Check article's book references
const article = await getArticle(articleId);

// 2. Filter out deleted book
const updatedBookIds = article.bookIds.filter(id => id !== deletedBookId);

// 3. Update article
await updateArticle(articleId, {
  ...article,
  bookIds: updatedBookIds
});
```

## Testing Integration

1. Use provided Postman collection
2. Test all CRUD operations
3. Verify error handling
4. Check UUID validation
5. Test book reference integrity

## Common Issues

### UUID Validation
- Ensure proper v4 format
- Check for empty/null values
- Validate before requests

### Book References
- Keep under 10 refs per article
- Validate book existence
- Handle deletion events

### Authentication
- Refresh tokens when needed
- Handle expired tokens
- Secure token storage
