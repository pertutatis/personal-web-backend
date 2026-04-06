# Technical Context

## Core Technologies

### Backend Framework

- **Next.js 14+**
  - API Routes
  - TypeScript support
  - File-based routing
  - Built-in performance optimizations

### Database

- **PostgreSQL (Desarrollo/Test)**
  - Relational database
  - ACID compliance
  - JSON support
  - Robust indexing
- **Supabase (Producción)**
  - PostgreSQL as a service
  - Built-in connection pooling
  - Automatic backups
  - Escalabilidad automática

### Language

- **TypeScript**
  - Static typing
  - Enhanced IDE support
  - Better maintainability
  - Decorators support

### MCP Integration

- **Servidor MCP**: Adaptador en infraestructura para comunicación con agente IA.
- **Protocolo MCP**: Soporte para comandos de publicación, edición, moderación y versionado.
- **Autenticación**: JWT o similar para agentes.
- **Logging y auditoría**: Registro de acciones automáticas.
- **Dependencias**: Librerías MCP, módulos de seguridad y validación.

## Development Setup

### Environment Requirements

```bash
Node.js >= 18
PostgreSQL >= 14
Docker (opcional)
```

### Project Structure

```
src/
├── app/              # Next.js app directory
│   └── api/          # API routes
├── contexts/         # Bounded contexts
│   ├── blog/         # Blog context
│   │   ├── article/  # Article aggregate
│   │   └── book/     # Book aggregate
│   └── shared/       # Shared kernel
│       └── infrastructure/
│           ├── persistence/
│           │   ├── PostgresRepository.ts
│           │   └── SupabaseRepository.ts
│           ├── mcp/
│           │   └── MCPAdapter.ts
└── types/           # TypeScript definitions
```

### Development Tools

1. **Testing**

   - Jest for unit/integration tests
   - Playwright for E2E testing
   - Object Mothers for test data

2. **Code Quality**

   - ESLint
   - TypeScript strict mode
   - Editor Config

3. **Docker**
   - Development environment
   - PostgreSQL container
   - Test environment

## Technical Constraints

### Database Configuration

```bash
# Producción (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://puawbpuoeqhgprxadrxd.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=sb_publishable_Iejo04gqjj897USZg_7VyQ_9Rbxf7Xe

# Desarrollo/Test (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Performance Requirements

- Response time < 200ms
- Efficient pagination
- Optimized database queries
- Consistent performance across environments

### Security Constraints

- Input validation
- SQL injection prevention
- Rate limiting (pendiente)
- Environment-specific security configs
- Autenticación y autorización específica para agentes MCP

### Scalability Requirements

- Stateless API design
- Connection pooling
- Caching (pendiente)
- Extensibilidad para nuevos comandos MCP y reglas IA
