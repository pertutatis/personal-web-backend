# Plan de Implementación: Integración con Supabase

## Estructura de la Solución

### 1. Interfaz DatabaseConnection

```typescript
interface DatabaseConnection {
  execute<T>(query: string, values?: any[]): Promise<QueryResult<T>>;
  close(): Promise<void>;
  getDatabase(): string;
}
```

### 2. Implementaciones

#### PostgresConnection (Existente)
- Se mantiene para desarrollo y tests
- Se actualiza para implementar la nueva interfaz

#### SupabaseConnection (Nueva)
```typescript
class SupabaseConnection implements DatabaseConnection {
  constructor(private supabase: SupabaseClient) {}
  
  async execute<T>(query: string, values?: any[]): Promise<QueryResult<T>> {
    // Implementar usando supabase.rpc() o supabase.from()
  }
  
  async close(): Promise<void> {
    // Implementar cleanup si es necesario
  }
  
  getDatabase(): string {
    return 'supabase';
  }
}
```

### 3. Factory de Conexiones

```typescript
class DatabaseConnectionFactory {
  static async create(config: DatabaseConfig): Promise<DatabaseConnection> {
    if (process.env.NODE_ENV === 'production') {
      return createSupabaseConnection(config);
    }
    return createPostgresConnection(config);
  }
}
```

### 4. Configuración de Entornos

```typescript
// .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
NODE_ENV=development

// .env.test
DATABASE_URL=postgresql://user:password@localhost:5432/test_dbname
NODE_ENV=test

// .env.production
NEXT_PUBLIC_SUPABASE_URL=https://puawbpuoeqhgprxadrxd.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=sb_publishable_Iejo04gqjj897USZg_7VyQ_9Rbxf7Xe
NODE_ENV=production
```

## Pasos de Implementación

1. **Preparación (Infraestructura)**
   - Crear interfaz `DatabaseConnection`
   - Actualizar `PostgresConnection` para implementar la interfaz
   - Crear `SupabaseConnection` implementando la interfaz
   - Implementar `DatabaseConnectionFactory`

2. **Configuración**
   - Configurar variables de entorno para cada entorno
   - Crear scripts de migración para Supabase
   - Actualizar scripts de CI/CD

3. **Actualización de Repositorios**
   - Modificar constructores para usar `DatabaseConnection`
   - Actualizar queries si es necesario
   - Mantener la lógica de negocio sin cambios

4. **Controllers**
   - Actualizar la inyección de dependencias
   - Usar factory para obtener la conexión correcta
   - Mantener la lógica de controladores sin cambios

5. **Testing**
   - Adaptar tests de integración para usar PostgreSQL local
   - Actualizar configuración de tests E2E
   - Crear mocks si es necesario

## Ejemplo de Uso

```typescript
// Repositorio actualizado
export class BlogArticleRepository implements IBlogArticleRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async findAll(): Promise<BlogArticle[]> {
    const result = await this.connection.execute(
      'SELECT * FROM articles ORDER BY created_at DESC'
    );
    return result.rows.map(this.mapToArticle);
  }
}

// Controller actualizado
export async function GET() {
  const connection = await DatabaseConnectionFactory.create({
    // config based on environment
  });
  const repository = new BlogArticleRepository(connection);
  // resto del código sin cambios
}
```

## Consideraciones

1. **Gestión de Conexiones**
   - Pool de conexiones en desarrollo
   - Conexión única en producción
   - Cleanup adecuado

2. **Transacciones**
   - Soporte en ambas implementaciones
   - Rollback automático
   - Manejo de errores consistente

3. **Monitorización**
   - Logging consistente
   - Métricas de rendimiento
   - Alertas configuradas

4. **Seguridad**
   - Credenciales seguras
   - Validación de entrada
   - Sanitización de queries

## Siguiente Paso

Cambiar al modo Code para comenzar la implementación, siguiendo este plan en el orden especificado.
