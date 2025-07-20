# OBR 003: Reglas de Negocio para la Migración a Supabase

## Contexto
Este documento define las reglas de negocio y casos de uso específicos para la migración a Supabase, asegurando que se mantenga la integridad y funcionalidad del sistema en todos los entornos.

## Reglas de Negocio

### 1. Gestión de Base de Datos
- **RN1.1**: Toda operación de base de datos debe ser agnóstica al proveedor
- **RN1.2**: Los tiempos de respuesta deben mantenerse por debajo de 200ms
- **RN1.3**: Las transacciones deben mantener ACID en todos los entornos

### 2. Gestión de Entornos
- **RN2.1**: Los entornos de desarrollo y test deben usar PostgreSQL local
- **RN2.2**: El entorno de producción debe usar Supabase
- **RN2.3**: Las migraciones deben ejecutarse automáticamente en todos los entornos

### 3. Integridad de Datos
- **RN3.1**: Las relaciones entre entidades deben mantenerse en todos los entornos
- **RN3.2**: Los datos sensibles deben estar encriptados en todos los entornos
- **RN3.3**: Las validaciones deben ser idénticas en todos los entornos

## Casos de Uso

### CU1: Gestión de Artículos
```gherkin
Escenario: Crear un artículo en producción
  Dado que estoy en el entorno de producción
  Cuando creo un nuevo artículo con referencias a libros
  Entonces el artículo se guarda en Supabase
  Y las referencias a libros se mantienen correctamente
  Y puedo recuperar el artículo con todas sus relaciones

Escenario: Actualizar un artículo en desarrollo
  Dado que estoy en el entorno de desarrollo
  Cuando actualizo un artículo existente
  Entonces los cambios se guardan en PostgreSQL local
  Y el comportamiento es idéntico al de producción
```

### CU2: Gestión de Libros
```gherkin
Escenario: Eliminar un libro referenciado
  Dado que existe un libro referenciado por artículos
  Cuando elimino el libro
  Entonces se actualizan las referencias en los artículos
  Y la integridad referencial se mantiene
  Y el comportamiento es igual en todos los entornos
```

### CU3: Autenticación
```gherkin
Escenario: Login de usuario
  Dado que tengo credenciales válidas
  Cuando intento hacer login
  Entonces la autenticación funciona igual en todos los entornos
  Y los tiempos de respuesta son similares
```

## Escenarios de Test

### 1. Tests de Integración
```typescript
describe('ArticleRepository', () => {
  it('debe mantener consistencia en operaciones CRUD', async () => {
    // El comportamiento debe ser idéntico en ambos entornos
  });

  it('debe manejar correctamente las relaciones', async () => {
    // Las referencias a libros deben mantenerse
  });
});
```

### 2. Tests E2E
```typescript
describe('API Endpoints', () => {
  it('debe funcionar igual en todos los entornos', async () => {
    // Validar comportamiento consistente
  });

  it('debe mantener los tiempos de respuesta', async () => {
    // Validar performance
  });
});
```

## Criterios de Validación

### 1. Performance
- [ ] Tiempos de respuesta similares en todos los entornos
- [ ] Optimización de queries
- [ ] Manejo eficiente de conexiones

### 2. Integridad
- [ ] Consistencia en las relaciones
- [ ] Manejo correcto de transacciones
- [ ] Validaciones uniformes

### 3. Seguridad
- [ ] Encriptación de datos sensibles
- [ ] Control de acceso consistente
- [ ] Auditoría de operaciones

## Referencias
- ADR-016: Migración a Supabase
- Documentación de Supabase
- Patrones actuales del sistema
