# Required Changes for Project Setup

## Initial Setup Checklist
1. Environment Setup
   - [ ] Copy .env.example to .env
   - [ ] Configure database credentials
   - [ ] Set appropriate ports

2. Database Setup
   - [ ] Start Docker containers: `docker-compose up -d`
   - [ ] Verify articles database is created
   - [ ] Verify books database is created
   - [ ] Check database schemas are applied

3. Development Environment
   - [ ] Install dependencies: `npm install`
   - [ ] Verify Node.js version (>=20.0.0)
   - [ ] Check TypeScript configuration
   - [ ] Ensure path aliases work

4. Test Environment
   - [ ] Run database setup: `npm run test:setup-db`
   - [ ] Run test suite: `npm test`
   - [ ] Verify all tests pass
   - [ ] Check test coverage

5. API Verification
   ### Articles
   ```bash
   # List articles
   curl http://localhost:3000/api/blog/articles
   
   # Get single article
   curl http://localhost:3000/api/blog/articles/[id]
   
   # Create article
   curl -X POST http://localhost:3000/api/blog/articles \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Article","content":"Content","bookIds":[]}'
   
   # Update article
   curl -X PUT http://localhost:3000/api/blog/articles/[id] \
     -H "Content-Type: application/json" \
     -d '{"title":"Updated","content":"New Content","bookIds":[]}'
   ```

   ### Books
   ```bash
   # List books
   curl http://localhost:3000/api/blog/books
   
   # Get single book
   curl http://localhost:3000/api/blog/books/[id]
   
   # Create book
   curl -X POST http://localhost:3000/api/blog/books \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Book","author":"Author","isbn":"1234567890"}'
   
   # Update book
   curl -X PUT http://localhost:3000/api/blog/books/[id] \
     -H "Content-Type: application/json" \
     -d '{"title":"Updated","author":"New Author","isbn":"0987654321"}'
   ```

## Common Issues

### Database Connection Issues
- Error: "ECONNREFUSED"
  - Check Docker containers are running
  - Verify database ports are correct
  - Ensure credentials match

### Test Issues
- Error: "Database does not exist"
  - Run `npm run test:setup-db`
  - Check database configuration
  
- Error: "Jest did not exit"
  - Check for unclosed database connections
  - Verify afterAll hooks are running

### API Issues
- 404 Not Found
  - Verify API routes are correctly defined
  - Check URL paths are correct
  
- 400 Bad Request
  - Validate request payload format
  - Check required fields are present
  
- 500 Internal Server Error
  - Check database connection
  - Verify environment variables
  - Review error logs

## Next Steps
See [remaining-tasks.md](../prompts/remaining-tasks.md) for planned improvements and features.
